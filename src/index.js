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
} from 'three';

import GLTFLoader from 'three-gltf-loader';

import './style.scss';

const { ArToolkitSource, ArToolkitContext, ArMarkerControls } = THREEx;

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
const clock = new Clock();

const camera = new Camera();
const scene = new Scene();
scene.add(camera);
scene.visible = false;

let model = null;

const light = new AmbientLight({ color: 0x1f1f1f });
const ptLight = new PointLight({ color: 0xffffff });
ptLight.position.y = 200;

let mixer, ready;

scene.add(light);
scene.add(ptLight);

const arToolkitContext = new ArToolkitContext({
  cameraParametersUrl: 'assets/camera_para.dat',
  detectionMode: 'mono',
});

const arToolkitSource = new ArToolkitSource({
  sourceType: 'webcam',
});

const markerControls = new ArMarkerControls(arToolkitContext, camera, {
  type: 'pattern',
  patternUrl: 'assets/patt.hiro',
  changeMatrixMode: 'cameraTransformMatrix',
});

initModel();

function initModel() {
  var loader = new GLTFLoader();
  loader.load('assets/Models/ugandan_knuckles/scene.gltf', function(gltf) {
    model = gltf.scene;
    model.scale.set(0.00125, 0.00125, 0.00125);
    mixer = new AnimationMixer(model);
    const run = gltf.animations[0];
    const action = mixer.clipAction(run);
    action.setLoop(LoopRepeat);
    action.play();
    scene.add(model);
    model.position.z -= 0.6;
    model.position.x -= 0.45;
    ready = true;
  });
}

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

arToolkitContext.init(() =>
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
);
arToolkitSource.init(onResize);
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
    scene.visible = camera.visible;
  }

  if (ready) {
    updatePosition();
    mixer.update(clock.getDelta());
  }
}

let xv = 0.02;
let zv = 0.01;

function updatePosition() {
  /*
      If we are within .1 of -.5 for any then start adding
     */
  if (model.position.x < -0.4) {
    xv += 0.001;
  }
  if (model.position.z < -0.4) {
    zv += 0.001;
  }
  if (model.position.x > 0.4) {
    xv -= 0.001;
  }
  if (model.position.z > 0.4) {
    zv -= 0.001;
  }

  xv += Math.random() * (0.001 - -0.001) + -0.001;
  zv += Math.random() * (0.001 - -0.001) + -0.001;

  // This is really sad but I don't remember how to do this with trig and this works:
  let rotation = (Math.abs(xv) / Math.abs(zv)) * 1.57;
  if (xv > 0 && zv > 0) {
    // 0 to pi/2
  } else if (xv < 0 && zv > 0) {
    // pi/2 -> pi
    rotation += 1.57;
  } else if (xv < 0 && zv < 0) {
    // pi -> 3/4 pi
    rotation += 3.14;
  } else {
    // 3/4 pi to 2 pi
    rotation += 4.71;
  }
  model.rotation.y = rotation;

  model.position.x += xv;
  model.position.z += zv;
}
