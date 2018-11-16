import { THREEx } from '../lib/ar';

import {
  AmbientLight,
  BoxBufferGeometry,
  Camera,
  DoubleSide,
  Mesh,
  MeshPhongMaterial,
  PointLight,
  Scene,
  TextureLoader,
  WebGLRenderer,
  AnimationMixer,
  LoopRepeat,
} from 'three';

import GLTFLoader from 'three-gltf-loader';

import './style.scss';

const { ArToolkitSource, ArToolkitContext, ArMarkerControls } = THREEx;

const renderer = new WebGLRenderer({ antialias: true, alpha: true });

const camera = new Camera();
const scene = new Scene();
scene.add(camera);
scene.visible = false;

const light = new AmbientLight({ color: 0x1f1f1f });
const ptLight = new PointLight({ color: 0xffffff });
ptLight.position.y = 200;

let mixer, ready;

scene.add(light);
scene.add(ptLight);

// const texture = new TextureLoader().load('assets/crate.gif');
// const material = new MeshPhongMaterial({ map: texture, side: DoubleSide });
// const mesh = new Mesh(new BoxBufferGeometry(1, 1, 1), material);
// mesh.position.y = 0.5;
// scene.add(mesh);

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
    var model = gltf.scene;
    model.scale.set(0.005, 0.005, 0.005);
    // model.traverse( function ( o ) {
    //     if ( !o.isMesh ) return;
    //     o.material.emissive = o.material.color.clone().multiplyScalar( 0.3 );
    // } );
    mixer = new AnimationMixer(model);
    var run = gltf.animations.find(function ( clip ) {
      return clip.name === 'WalkCycle';
    });
    var action = mixer.clipAction(run);
    action.setLoop(LoopRepeat);
    action.play();
    scene.add(model);
    ready = true;
  });
}

// Instantiate a loader
var loader = new GLTFLoader();

// Load a glTF resource
loader.load(
  // resource URL
  'assets/Models/ugandan_knuckles/scene.gltf',
  // called when the resource is loaded
  function(gltf) {
    gltf.scene.position.set(-1, -0.5, -1);
    gltf.scene.scale.set(0.0005, 0.0005, 0.0005);
    scene.add(gltf.scene);
    // let mixer = new AnimationMixer(gltf.scene);
    // let action = mixer.clipAction(gltf.animations[0]);
    // action.setLoop(LoopRepeat);
    // action.play();
  },
  // called while loading is progressing
  function(xhr) {
    console.log((xhr.loaded / xhr.total * 100 ) + '% loaded');
  },
  // called when loading has errors
  function(error) {
    console.log('An error happened' + error);
  }
);

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
}
