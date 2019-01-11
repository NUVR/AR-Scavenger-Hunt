import { THREEx } from '../lib/ar';

import {
  AmbientLight,
  AnimationMixer,
  Camera,
  Clock,
  DoubleSide,
  LoopRepeat,
  PointLight,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
  Group,
  MeshBasicMaterial,
  CubeGeometry,
  TextureLoader,
  RepeatWrapping,
  Mesh,
  BackSide,
  BoxGeometry,
  VideoTexture,
  PlaneBufferGeometry,
  LinearFilter,
  RGBFormat,
} from 'three';

import GLTFLoader from 'three-gltf-loader';

import './style.scss';

const { ArToolkitSource, ArToolkitContext, ArMarkerControls } = THREEx;

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
const clock = new Clock();

const camera = new Camera();
const scene = new Scene();
scene.add(camera);
scene.visible = true;

const light = new AmbientLight(0x404040);
const ptLight = new PointLight(0xffffff);
ptLight.position.set(3, 4, 7);

// 3d models or meshes
let bostonMap, knuckles, aoun, script, blind, portal;
// gltf animation mixers
let knucklesMixer, aounMixer;
// is the 3d model loaded and ready to be rendered?
let knucklesReady,
  aounReady,
  bostonReady,
  scriptReady,
  blindReady = false;

let bostonLoadRequested = false;

let markerArray;

scene.add(light);
scene.add(ptLight);

const arToolkitContext = new ArToolkitContext({
  cameraParametersUrl: 'assets/camera_para.dat',
  detectionMode: 'mono',
});

const arToolkitSource = new ArToolkitSource({
  sourceType: 'webcam',
});

initModels();
const progressMeter = document.querySelector('#progress');
function initModels() {
  var loader = new GLTFLoader();

  markerArray = [];
  let patternArray = [
    'kanji',
    'hiro',
    'NUvr',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'A',
    'B',
    'Train',
  ];
  for (let i = 0; i < patternArray.length; i++) {
    let markerRoot = new Group();
    scene.add(markerRoot);
    markerArray.push({ name: patternArray[i], marker: markerRoot });
    let markerControls = new THREEx.ArMarkerControls(
      arToolkitContext,
      markerRoot,
      {
        type: 'pattern',
        patternUrl: 'assets/Patts/' + patternArray[i] + '.patt',
      }
    );

    switch (patternArray[i]) {
      case 'hiro':
        // will eventually load a temp model here that is used as a loading animation.
        // maybe flossing aoun?
        break;
      case 'kanji':
        loader.load('assets/Models/ugandan_knuckles/scene.gltf', function(
          gltf
        ) {
          knuckles = gltf.scene;
          knuckles.scale.set(0.00125, 0.00125, 0.00125);
          knucklesMixer = new AnimationMixer(knuckles);
          const run = gltf.animations[0];
          const action = knucklesMixer.clipAction(run);
          action.setLoop(LoopRepeat);
          action.play();
          knuckles.position.z -= 0.6;
          knuckles.position.x = 0.45;
          knuckles.rotation.y -= Math.PI / 2;
          markerRoot.add(knuckles);
          knucklesReady = true;
        });
        break;
      case 'NUvr':
        loader.load('assets/Models/Aoun/AounAnimatedNoTexture.gltf', function(
          gltf
        ) {
          aoun = gltf.scene;
          aounMixer = new AnimationMixer(aoun);
          const floss = gltf.animations[0];
          const action = aounMixer.clipAction(floss);
          action.setLoop(LoopRepeat);
          action.play();
          aoun.rotation.x += Math.PI;
          markerRoot.add(aoun);
          aounReady = true;
        });
        break;
      case 'One':
        addMeshesToHole(markerRoot);
        break;
      case 'Two':
        movieScript(markerRoot);
        break;
      case 'Three':
        loader.load('assets/Models/Blind/ForTheBlind.gltf', function(gltf) {
          blind = gltf.scene;
          blind.rotation.x -= Math.PI / 2;
          blind.scale.set(0.25, 0.25, 0.25);
          blind.position.x += 0.5;
          markerRoot.add(blind);
          blindReady = true;
        });
        break;
      case 'Four':
        addWhahVideo(markerRoot);
        break;
      case 'Train':
        loadTrain();
        break;
      case 'A':
        loadOldMen();
        break;
      case 'B':
        loadPhilanthropist();
        break;
      case 'Five':
        loadPortal(markerRoot, true);
        break;
      case 'Six':
        loadPortal(markerRoot, false);
        break;
      case 'Eleven':
        drawBoxes(markerRoot);
    }
  }
}

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const container = document.querySelector('#rendererContainer');
container.appendChild(renderer.domElement);

arToolkitContext.init(() =>
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
);
arToolkitSource.init(container, onResize);
window.addEventListener('resize', onResize);

function onResize() {
  arToolkitSource.onResizeElement();
  arToolkitSource.copyElementSizeTo(renderer.domElement);
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
  }
}

render();
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  if (arToolkitSource.ready) {
    arToolkitContext.update(arToolkitSource.domElement);
  }

  if (knucklesReady) {
    // updatePosition();
    knucklesMixer.update(clock.getDelta());
  }
  if (aounReady) {
    aounMixer.update(clock.getDelta());
  }
  if (scriptReady) {
    animateScript();
  }
}

// INITIALIZATION OF MESHES
////////////////////////////////////////////////////////
function loadBoston(aMarkerRoot) {
  if (!bostonLoadRequested) {
    bostonLoadRequested = true;
    progressMeter.classList.remove('hidden');
    var loader = new GLTFLoader();
    loader.load(
      'assets/Models/NortheasternMap2/BostonFromAltizure2-0Cut.gltf',
      function(gltf) {
        setTimeout(() => (progressMeter.innerHTML = 'Done.'), 0);
        bostonMap = gltf.scene;
        bostonMap.rotation.x -= Math.PI / 9; // 20 degree angle?
        bostonMap.scale.set(0.75, 2, 0.75);
        // scene.add(bostonMap);
        bostonReady = true;
        setTimeout(() => progressMeter.classList.add('fadeout'), 5000);
        setTimeout(() => progressMeter.classList.add('hidden'), 6000);
        let index = markerArray.findIndex(x => x.name === 'hiro'); // TODO MUST CHANGE THIS IF THE BOSTON MAP IS MOVED OFF OF HIRO
        markerArray[index].marker.add(bostonMap);
      },
      progressEvent => {
        let progress = `${Math.floor(
          (progressEvent.loaded / progressEvent.total) * 100
        )}%`;
        if (progressEvent.loaded >= progressEvent.total) {
          progress = 'Finishing up...';
        }
        setTimeout(() => (progressMeter.innerHTML = progress), 0);
      }
    );
  }
}

function addMeshesToHole(aMarkerRoot) {
  let geometry1 = new CubeGeometry(1, 15, 1);
  let loader = new TextureLoader();
  let texture = loader.load('assets/Textures/tile4b.gif', render);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1.25, 1.25);
  let material1 = new MeshBasicMaterial({
    transparent: true,
    map: texture,
    side: BackSide,
  });
  let mesh1 = new Mesh(geometry1, material1);
  mesh1.position.y = -7.5;
  aMarkerRoot.add(mesh1);

  // the invisibility cloak (ring; has square hole)
  let geometry0 = new BoxGeometry(1, 15, 1);
  geometry0.faces.splice(4, 2); // make hole by removing top two triangles
  let material0 = new MeshBasicMaterial({
    colorWrite: false,
  });
  let mesh0 = new Mesh(geometry0, material0);
  mesh0.scale.set(1, 1, 1).multiplyScalar(1.01);
  mesh0.position.y = -7.5;
  aMarkerRoot.add(mesh0);
}

function movieScript(aMarkerRoot) {
  let geometry1 = new CubeGeometry(2, 0.25, 8);
  let loader = new TextureLoader();
  let texture = loader.load('assets/Textures/BeeMovieScript.png', render);
  // texture.wrapS = RepeatWrapping;
  // texture.wrapT = RepeatWrapping;
  let material1 = new MeshBasicMaterial({
    transparent: true,
    map: texture,
    side: BackSide,
  });
  script = new Mesh(geometry1, material1);
  script.position.z = 4;
  script.rotation.y += Math.PI;
  script.scale.x = -1;
  aMarkerRoot.add(script);
  scriptReady = true;
}

function loadPortal(aMarkerRoot, isFirstPortal) {
  // is firstPortal will determine which textures are loaded onto the cube later

  let loader = new TextureLoader();

  // material for portal (for debugging)

  let defaultMaterial = new MeshBasicMaterial({
    map: loader.load('images/sphere-colored.png'),
    color: 0x444444,
    side: DoubleSide,
    transparent: true,
    opacity: 0.6,
  });

  let portalWidth = 2;
  let portalHeight = 2;
  let portalBorder = 0.1;

  portal = new Mesh(
    new PlaneGeometry(portalWidth, portalHeight),
    defaultMaterial
  );
  portal.rotation.x += Math.PI / 2;
  portal.position.y = portalHeight / 2 + portalBorder;
  portal.layers.set(1);
  aMarkerRoot.add(portal);

  camera.layers.enable(1);

  let portalMaterial = new MeshBasicMaterial({
    color: 0xffff00,
    side: DoubleSide,
    transparent: true,
    opacity: 0.75,
  });

  let portalBorderMesh = new Mesh(
    new PlaneGeometry(
      portalWidth + 2 * portalBorder,
      portalHeight + 2 * portalBorder
    ),
    portalMaterial
  );
  portalBorderMesh.rotation.x += Math.PI / 2;
  portalBorderMesh.position.y = portal.position.y;
  portalBorderMesh.layers.set(0);
  aMarkerRoot.add(portalBorderMesh);

  // the world beyond the portal

  // textures from http://www.humus.name/
  let skyMaterialArray = [
    new MeshBasicMaterial({
      map: loader.load('assets/Textures/mountain/posx.jpg'),
      side: BackSide,
    }),
    new MeshBasicMaterial({
      map: loader.load('assets/Textures/mountain/negx.jpg'),
      side: BackSide,
    }),
    new MeshBasicMaterial({
      map: loader.load('assets/Textures/mountain/posy.jpg'),
      side: BackSide,
    }),
    new MeshBasicMaterial({
      map: loader.load('assets/Textures/mountain/negy.jpg'),
      side: BackSide,
    }),
    new MeshBasicMaterial({
      map: loader.load('assets/Textures/mountain/posz.jpg'),
      side: BackSide,
    }),
    new MeshBasicMaterial({
      map: loader.load('assets/Textures/mountain/negz.jpg'),
      side: BackSide,
    }),
  ];
  let skyMesh = new Mesh(new CubeGeometry(30, 30, 30), skyMaterialArray);
  skyMesh.rotation.x -= Math.PI / 2;
  skyMesh.layers.set(2);
  aMarkerRoot.add(skyMesh);
}

function loadTrain() {
  console.log('loading train.');
}

function loadOldMen() {
  console.log('loading old men');
}

function loadPhilanthropist() {
  console.log('loading philanthropist');
}

function drawBoxes(aMarkerRoot) {

}

// ANIMATION OF MESHES!
//////////////////////////////////////////////////////////////////

function detectVisibleMarkers() {
  let shouldWhahPlay = false;
  let shouldScriptReset = true;
  let trolley,
    a,
    b = false;
  for (let i = 0; i < markerArray.length; i++) {
    if (markerArray[i].marker.visible) {
      switch (markerArray[i].name) {
        case 'hiro':
          loadBoston();
          break;
        case 'kanji':
          updateKnuckles();
          break;
        case 'NUvr':
          console.log('NUvr marker detected');
          break;
        case 'One':
          console.log('One detected');
          break;
        case 'Two':
          shouldScriptReset = false;
          break;
        case 'Three':
          console.log('Three detected');
          break;
        case 'Four':
          // set the video's play state
          shouldWhahPlay = true;
          break;
        case 'Five':
          animatePortal();
          break;
        case 'Six':
          // portal 2
          animatePortal();
          break;
        case 'Train':
          trolley = true;
          break;
        case 'A':
          a = true;
          break;
        case 'B':
          b = true;
      }
    }
  }
  let video = document.getElementById('video');
  if (shouldWhahPlay) {
    video.play();
  } else {
    video.pause();
  }
  if (shouldScriptReset) {
    script.position.z = 4;
  }
  updateTrolleyGame(trolley, a, b);
}
let reversed = false;
function updateKnuckles() {
  // starting position
  let xv = 0;
  let zv = 0;
  /*
      If we are within .1 of -.5 for any then start adding
     */
  if (knuckles.position.x > 0 && knuckles.position.z < -0.55) {
    // straight part of s on top
    if (reversed && knuckles.position.x > 0.4) {
      reversed = false;
      knuckles.rotation.y -= Math.PI;
    }
  } else if (knuckles.position.x < 0 && knuckles.position.z < 0) {
    // first curve
    if (!reversed) {
      knuckles.rotation.y += Math.PI / 90;
    } else {
      knuckles.rotation.y -= Math.PI / 90;
    }
  } else if (knuckles.position.x > 0 && knuckles.position.z < 0.55) {
    if (!reversed) {
      knuckles.rotation.y -= Math.PI / 90;
    } else {
      knuckles.rotation.y += Math.PI / 90;
    }
    // second curve
  } else if (knuckles.position.x < 0 && knuckles.position.z > 0.5) {
    // straight part of end of s
    if (!reversed && knuckles.position.x < -0.5) {
      reversed = true;
      console.log('reversed flipped!');
      knuckles.rotation.y += Math.PI;
    }
  }

  xv = Math.sin(knuckles.rotation.y) / 100;
  zv = Math.cos(knuckles.rotation.y) / 100;
  console.log('rotation: ' + knuckles.rotation.y + ' xv: ' + xv);
  console.log('rotation: ' + knuckles.rotation.y + ' zv: ' + zv);

  knuckles.position.x += xv;
  knuckles.position.z += zv;
}

function animateScript() {
  detectVisibleMarkers();
  if (script.position.z < -4) {
    script.position.z = 4;
  } else {
    script.position.z -= 0.0025;
  }
}

function addWhahVideo(aMarkerRoot) {
  let geometry = new PlaneBufferGeometry(2, 2, 4, 4);
  let video = document.getElementById('video');
  let texture = new VideoTexture(video);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.format = RGBFormat;
  let material = new MeshBasicMaterial({ map: texture });

  let mesh = new Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  aMarkerRoot.add(mesh);
}

let prevTrolley = false;
function updateTrolleyGame(trolley, a, b) {
  // if trolley is false then set a and b to invisible and make sure to reset the game
  // else see if the game is started
  // if it isnt then play the intro audio clip explaining the game
  // setTimeout for 10000 ms on that event check if a and b are still covered
  // play corresponding animation and audio clip based on choice
  if (trolley && !prevTrolley) {
    console.log('Trolley is: ' + trolley + ' a: ' + a + ' b: ' + b);
  }
}

function animatePortal() {
  let gl = renderer.context;

  // clear buffers now: color, depth, stencil
  renderer.clear(true, true, true);
  // do not clear buffers before each render pass
  renderer.autoClear = false;

  // FIRST PASS
  // goal: using the stencil buffer, place 1's in position of first portal (layer 1)
  // enable the stencil buffer
  gl.enable(gl.STENCIL_TEST);

  // layer 1 contains only the first portal
  camera.layers.set(1);
  gl.stencilFunc(gl.ALWAYS, 1, 0xff);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
  gl.stencilMask(0xff);
  // only write to stencil buffer (not color or depth)
  gl.colorMask(false, false, false, false);
  gl.depthMask(false);

  renderer.render(scene, camera);
  // SECOND PASS
  // goal: render skybox (layer 2) but only through portal

  gl.colorMask(true, true, true, true);
  gl.depthMask(true);

  gl.stencilFunc(gl.EQUAL, 1, 0xff);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

  camera.layers.set(2);
  renderer.render(scene, camera);

  // FINAL PASS
  // goal: render the rest of the scene (layer 0)

  // using stencil buffer simplifies drawing border around portal
  gl.stencilFunc(gl.NOTEQUAL, 1, 0xff);
  gl.colorMask(true, true, true, true);
  gl.depthMask(true);

  camera.layers.set(0); // layer 0 contains portal border mesh
  renderer.render(scene, camera);

  // set things back to normal
  renderer.autoClear = true;
}
