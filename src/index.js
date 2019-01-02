import { THREEx } from '../lib/ar';

import {
  AmbientLight,
  AnimationMixer,
  Camera,
  Clock,
  LoopRepeat,
  PointLight,
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
let bostonMap, knuckles, aoun, script, blind;
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
  let patternArray = ['kanji', 'hiro', 'NUvr', 'One', 'Two', 'Three', 'Four', 'A', 'B', 'Train'];
  for (let i = 0; i < patternArray.length; i++) {
    let markerRoot = new Group();
    scene.add(markerRoot);
    markerArray.push({ name: patternArray[i], marker: markerRoot });
    let markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
      type : 'pattern', patternUrl : "assets/Patts/" + patternArray[i] + '.patt',
    });
  
    switch(patternArray[i]) {
      case 'hiro':
        // will eventually load a temp model here that is used as a loading animation.
        // maybe flossing aoun?
        break;
      case 'kanji':
        loader.load('assets/Models/ugandan_knuckles/scene.gltf', function(gltf) {
          knuckles = gltf.scene;
          knuckles.scale.set(0.00125, 0.00125, 0.00125);
          knucklesMixer = new AnimationMixer(knuckles);
          const run = gltf.animations[0];
          const action = knucklesMixer.clipAction(run);
          action.setLoop(LoopRepeat);
          action.play();
          knuckles.position.z -= 0.6;
          knuckles.position.x -= 0.45;
          markerRoot.add(knuckles);
          knucklesReady = true;
        });
        break;
      case 'NUvr':
        loader.load('assets/Models/Aoun/AounAnimatedNoTexture.gltf', function(gltf) {
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

function loadTrain() {
  console.log('loading train.');
}

function loadOldMen() {
  console.log('loading old men');
}

function loadPhilanthropist() {
  console.log('loading philanthropist');
}

// ANIMATION OF MESHES!
//////////////////////////////////////////////////////////////////


function detectVisibleMarkers() {
  let shouldWhahPlay = false;
  let shouldScriptReset = true;
  let trolley, a, b = false;
  for (let i = 0; i < markerArray.length; i++) {
    if (markerArray[i].marker.visible) {
      switch (markerArray[i].name) {
        case 'hiro':
          loadBoston();
          break;
        case 'kanji':
          console.log('kanji marker detected');
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

// knuckles update not set up for a particular letter yet.
// let xv = 0.02;
// let zv = 0.01;

// function updatePosition() {
//   /*
//       If we are within .1 of -.5 for any then start adding
//      */
//   if (model.position.x < -0.4) {
//     xv += 0.001;
//   }
//   if (model.position.z < -0.4) {
//     zv += 0.001;
//   }
//   if (model.position.x > 0.4) {
//     xv -= 0.001;
//   }
//   if (model.position.z > 0.4) {
//     zv -= 0.001;
//   }

//   xv += Math.random() * 0.001 - 0.0005;
//   zv += Math.random() * 0.001 - 0.0005;

//   // This is really sad but I don't remember how to do this with trig and this works:
//   let rotation = (Math.abs(xv) / Math.abs(zv)) * (Math.PI / 2);
//   if (xv > 0 && zv > 0) {
//     // 0 to pi/2
//   } else if (xv < 0 && zv > 0) {
//     // pi/2 -> pi
//     rotation += Math.PI / 2;
//   } else if (xv < 0 && zv < 0) {
//     // pi -> 3/2 pi
//     rotation += Math.PI;
//   } else {
//     // 3/2 pi to 2 pi
//     rotation += Math.PI * 0.75;
//   }
//   model.rotation.y = rotation;

//   model.position.x += xv;
//   model.position.z += zv;
// }

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


function updateTrolleyGame(trolley, a, b) {
  // if trolley is false then set a and b to invisible and make sure to reset the game
  // else see if the game is started
  // if it isnt then play the intro audio clip explaining the game
  // setTimeout for 10000 ms on that event check if a and b are still covered
  // play corresponding animation and audio clip based on choice
}
