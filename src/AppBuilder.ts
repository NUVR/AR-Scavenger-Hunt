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

export default RootScene;
