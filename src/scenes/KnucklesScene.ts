import { SceneMapper } from 'SceneMapper';
import { Object3D, AnimationMixer, LoopRepeat } from 'three';
import ModelLoader from './ModelLoader';

export class KnucklesScene implements SceneMapper {
  ASSET_URL = 'assets/Models/ugandan_knuckles/scene.gltf';

  private knuckles: Object3D;
  private knucklesMixer: AnimationMixer;

  async loadModel() {
    return ModelLoader.loadModel(this.ASSET_URL).then(gltf => {
      this.knuckles = gltf.scene;
      const knuckles = this.knuckles;
      knuckles.scale.set(0.00125, 0.00125, 0.00125);
      this.knucklesMixer = new AnimationMixer(knuckles);
      const run = gltf.animations[0];
      const action = this.knucklesMixer.clipAction(run);
      action.setLoop(LoopRepeat, -1);
      action.play();
      knuckles.position.z -= 0.6;
      knuckles.position.x = 0.45;
      knuckles.rotation.y -= Math.PI / 2;
      return this.knuckles;
    });
  }

  update(delta: number) {
    this.knucklesMixer.update(delta);
  }

  hasModel() {
    return !!this.knuckles;
  }

  getModel() {
    return this.knuckles;
  }
}
