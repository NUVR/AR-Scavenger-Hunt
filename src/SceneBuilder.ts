import { Camera, Scene, AmbientLight, PointLight, Object3D, Renderer } from 'three';
import { THREEx } from 'ar';

class SceneBuilder {
  camera: Camera;
  scene: Scene;

  arToolkitContext: THREEx.ArToolkitContext;
  arToolkitSource: THREEx.ArToolkitSource;
  arMarkerControls: THREEx.ArMarkerControls[];

  constructor() {
    this.buildScene();
  }

  buildScene() {
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
  }

  add(...object: Object3D[]) {
    this.scene.add(...object);
  }

  render(renderer: Renderer) {
    renderer.render(this.scene, this.camera);
  }
}

export default new SceneBuilder();
