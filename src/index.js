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

// const light = new AmbientLight(0x404040);
const ptLight = new PointLight(0xffffff);
ptLight.position.set(3, 4, 7);

let knucklesMixer, aounMixer, kReady, aReady, bReady, bostonMap, knuckles, aoun;

// scene.add(light);
scene.add(ptLight);

const arToolkitContext = new ArToolkitContext({
  cameraParametersUrl: 'assets/camera_para.dat',
  detectionMode: 'mono',
});

const arToolkitSource = new ArToolkitSource({
  sourceType: 'webcam',
});

// const markerControls = new ArMarkerControls(arToolkitContext, camera, {
//   type: 'pattern',
//   patternUrl: 'assets/patt.kanji',
//   changeMatrixMode: 'cameraTransformMatrix',
// });

initModels();

function initModels() {
  var loader = new GLTFLoader();
  const progressMeter = document.querySelector('#progress');
  progressMeter.classList.remove('hidden');

  let patternArray = ['kanji', 'hiro', 'NUvr', 'One'];
  for (let i = 0; i < patternArray.length; i++) {
    let markerRoot = new Group();
    scene.add(markerRoot);
    let markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
      type : 'pattern', patternUrl : "assets/Patts/" + patternArray[i] + '.patt',
    });
  
    switch(patternArray[i]) {
      case 'hiro':
        loader.load(
          'assets/Models/NortheasternMap2/BostonFromAltizure2-0Cut.gltf',
          function(gltf) {
            setTimeout(() => (progressMeter.innerHTML = 'Done.'), 0);
            bostonMap = gltf.scene;
            bostonMap.rotation.x -= Math.PI / 9; // 20 degree angle?
            bostonMap.scale.set(0.75, 2, 0.75);
            // scene.add(bostonMap);
            bReady = true;
            setTimeout(() => progressMeter.classList.add('fadeout'), 5000);
            setTimeout(() => progressMeter.classList.add('hidden'), 6000);
            markerRoot.add(bostonMap);
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
          kReady = true;
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
          aReady = true;
        });
        break;
      case 'One':
        addMeshesToHole(markerRoot);
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
    // scene.visible = camera.visible;
  }

  if (kReady && aReady) {
    // updatePosition();
    knucklesMixer.update(clock.getDelta());
    aounMixer.update(clock.getDelta());
  }
}

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

function addMeshesToHole(aMarkerRoot) {
  let geometry1	= new CubeGeometry(1, 15, 1);
  let loader = new TextureLoader();
  let texture = loader.load('assets/Textures/tile4b.gif', render);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1.25, 1.25);
  let material1	= new MeshBasicMaterial({
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
