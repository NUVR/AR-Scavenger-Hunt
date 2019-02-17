import { SceneMapper } from 'SceneMapper';
import { Object3D, AnimationMixer, LoopRepeat } from 'three';
import ModelLoader from './ModelLoader';

export class AounScene implements SceneMapper {
  ASSET_URL = 'assets/Models/Aoun/AounAnimatedNoTexture.gltf';

  private aoun: Object3D;
  private aounMixer: AnimationMixer;

  async loadModel() {
    return ModelLoader.loadModel(this.ASSET_URL).then(gltf => {
      this.aoun = gltf.scene;
      this.aounMixer = new AnimationMixer(this.aoun);
      const floss = gltf.animations[0];
      const action = this.aounMixer.clipAction(floss);
      action.setLoop(LoopRepeat, -1);
      action.play();
      this.aoun.rotation.x += Math.PI;
      return this.aoun;
    });
  }

  update(delta: number) {
    this.aounMixer.update(delta);
  }

  hasModel() {
    return !!this.aoun;
  }

  getModel() {
    return this.aoun;
  }
}
