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
    const model = gltf.scene;
    model.scale.set(0.00125, 0.00125, 0.00125);
    // model.traverse( function ( o ) {
    //     if ( !o.isMesh ) return;
    //     o.material.emissive = o.material.color.clone().multiplyScalar( 0.3 );
    // } );
    mixer = new AnimationMixer(model);
    const run = gltf.animations[0];
    const action = mixer.clipAction(run);
    action.setLoop(LoopRepeat);
    action.play();
    scene.add(model);
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
    mixer.update(clock.getDelta());
  }
}
