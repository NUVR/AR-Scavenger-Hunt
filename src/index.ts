import { THREEx } from 'ar';
import { AmbientLight, Camera, Clock, PointLight, Scene, WebGLRenderer } from 'three';
import './style.scss';
import MaterialMap from './MaterialMap';

const { ArToolkitSource, ArToolkitContext } = THREEx;

class RootScene {
  renderer: WebGLRenderer;
  clock: Clock;
  camera: Camera;
  scene: Scene;

  arToolkitContext: THREEx.ArToolkitContext;
  arToolkitSource: THREEx.ArToolkitSource;
  arMarkerControls: THREEx.ArMarkerControls[];

  constructor() {
    this.arMarkerControls = [];
    this.buildScene();
    this.buildDom();
    this.initModels();
  }

  buildScene = () => {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.clock = new Clock();

    this.camera = new Camera();
    const scene = new Scene();
    scene.add(this.camera);
    scene.visible = true;
    this.scene = scene;

    const light = new AmbientLight(0x404040);
    const ptLight = new PointLight(0xffffff);
    ptLight.position.set(3, 4, 7);
    scene.add(light);
    scene.add(ptLight);

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
      this.camera.projectionMatrix.copy(this.arToolkitContext.getProjectionMatrix())
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

  render = () => {
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);

    const delta = this.clock.getDelta();
    MaterialMap.getActiveScenes().map(scene => {
      if (scene.update) {
        scene.update(delta);
      }
    });

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
    this.render();
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
