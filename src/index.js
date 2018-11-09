import { THREEx } from '../lib/ar';

import {
  AmbientLight,
  BoxBufferGeometry,
  ConeBufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  TextureLoader,
  WebGLRenderer,
  MeshPhongMaterial,
} from 'three';

const { ArToolkitSource, ArToolkitContext, ArMarkerControls } = THREEx;

const canvas = document.createElement('canvas');

const camera = new PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 400;

const scene = new Scene();
const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });

const light = new AmbientLight({ color: 0x1f1f1f });
const ptLight = new PointLight({ color: 0xffffff });
ptLight.position.y = 200;

scene.add(light);
scene.add(ptLight);

const arToolkitContext = new ArToolkitContext({
  cameraParametersUrl: 'assets/camera_para.dat',
  detectionMode: 'mono',
});

const arToolkitSource = new ArToolkitSource({
  sourceType: 'webcam',
});

const markerRoot = new Group();
scene.add(markerRoot);

const texture = new TextureLoader().load('assets/crate.gif');
const material = new MeshBasicMaterial({ map: texture });
const mesh = new Mesh(new BoxBufferGeometry(100, 100, 100), material);
markerRoot.add(mesh);

const markerControls = new ArMarkerControls(arToolkitContext, markerRoot, {
  type: 'pattern',
  patternUrl: 'assets/patt.hiro',
  changeMatrixMode: 'cameraTransformMatrix',
});

arToolkitSource.init(onResize);

arToolkitContext.init(() =>
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
);

window.addEventListener('resize', onResize);

function onResize() {
  arToolkitSource.onResize();
  arToolkitSource.copySizeTo(renderer.domElement);
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
  }
}

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(canvas);

render();

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  if (arToolkitSource.ready) {
    arToolkitContext.update(arToolkitSource.domElement);
  }

  mesh.rotation.y += 0.01;
  mesh.rotation.z += 0.05;
}
