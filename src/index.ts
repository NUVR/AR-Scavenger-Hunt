import { THREEx } from 'ar';
import { WebGLRenderer } from 'three';
import './style.scss';
import MaterialMap from './MaterialMap';
import SceneBuilder from './SceneBuilder';

const { ArToolkitSource, ArToolkitContext } = THREEx;

class RootScene {
  renderer: WebGLRenderer;
  scene = SceneBuilder;

  arToolkitContext: THREEx.ArToolkitContext;
  arToolkitSource: THREEx.ArToolkitSource;
  arMarkerControls: THREEx.ArMarkerControls[];

  constructor() {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.arMarkerControls = [];
    this.buildAr();
    this.buildDom();
    this.initModels();
  }

  buildAr = () => {
    this.arToolkitContext = new ArToolkitContext({
      cameraParametersUrl: 'assets/camera_para.dat',
      detectionMode: 'mono',
    });

    this.arToolkitSource = new ArToolkitSource({
      sourceType: 'webcam',
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  buildDom = () => {
    const container = document.querySelector('#rendererContainer');
    container.appendChild(this.renderer.domElement);

    this.arToolkitContext.init(() =>
      this.scene.camera.projectionMatrix.copy(this.arToolkitContext.getProjectionMatrix())
    );
    this.arToolkitSource.init(container, this.onResize);
    window.addEventListener('resize', this.onResize);
  };

  onResize = () => {
    this.arToolkitSource.onResizeElement();
    this.arToolkitSource.copyElementSizeTo(this.renderer.domElement);
    if (this.arToolkitContext.arController !== null) {
      this.arToolkitSource.copyElementSizeTo(this.arToolkitContext.arController.canvas);
    }
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.scene.render(this.renderer);

    if (this.arToolkitSource.ready) {
      this.arToolkitContext.update(this.arToolkitSource.domElement);
    }
  };

  initModels() {
    MaterialMap.preload()
      .then(this.loadMarkers)
      .catch(err => console.error(err));
  }

  loadMarkers = () => {
    const markerRoots = MaterialMap.mapMarkers(this.arToolkitContext);
    markerRoots.map(markerRoot => this.scene.add(markerRoot));
    this.animate();
    console.log(this.scene);
  };
}

new RootScene();

// let prevTrolley = false;
// function updateTrolleyGame(trolley, a, b) {
//   // if trolley is false then set a and b to invisible and make sure to reset the game
//   // else see if the game is started
//   // if it isnt then play the intro audio clip explaining the game
//   // setTimeout for 10000 ms on that event check if a and b are still covered
//   // play corresponding animation and audio clip based on choice
//   if (trolley && !prevTrolley) {
//     console.log('Trolley is: ' + trolley + ' a: ' + a + ' b: ' + b);
//   }
// }

// function animatePortal() {
//   let gl = renderer.context;

//   // clear buffers now: color, depth, stencil
//   renderer.clear(true, true, true);
//   // do not clear buffers before each render pass
//   renderer.autoClear = false;

//   // FIRST PASS
//   // goal: using the stencil buffer, place 1's in position of first portal (layer 1)
//   // enable the stencil buffer
//   gl.enable(gl.STENCIL_TEST);

//   // layer 1 contains only the first portal
//   camera.layers.set(1);
//   gl.stencilFunc(gl.ALWAYS, 1, 0xff);
//   gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
//   gl.stencilMask(0xff);
//   // only write to stencil buffer (not color or depth)
//   gl.colorMask(false, false, false, false);
//   gl.depthMask(false);

//   renderer.render(scene, camera);
//   // SECOND PASS
//   // goal: render skybox (layer 2) but only through portal

//   gl.colorMask(true, true, true, true);
//   gl.depthMask(true);

//   gl.stencilFunc(gl.EQUAL, 1, 0xff);
//   gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

//   camera.layers.set(2);
//   renderer.render(scene, camera);

//   // FINAL PASS
//   // goal: render the rest of the scene (layer 0)

//   // using stencil buffer simplifies drawing border around portal
//   gl.stencilFunc(gl.NOTEQUAL, 1, 0xff);
//   gl.colorMask(true, true, true, true);
//   gl.depthMask(true);

//   camera.layers.set(0); // layer 0 contains portal border mesh
//   renderer.render(scene, camera);

//   // set things back to normal
//   renderer.autoClear = true;
// }
