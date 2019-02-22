import { AnimationMixer, LoopRepeat } from 'three';
import ModelLoader from './ModelLoader';
import { AbstractScene } from './AbstractScene';

export class AounScene extends AbstractScene {
  ASSET_URL = 'assets/Models/Aoun/AounAnimatedNoTexture.gltf';

  private aounMixer: AnimationMixer;

  async loadModel() {
    return ModelLoader.loadModel(this.ASSET_URL).then(gltf => {
      this.model = gltf.scene;
      this.aounMixer = new AnimationMixer(this.model);
      const floss = gltf.animations[0];
      const action = this.aounMixer.clipAction(floss);
      action.setLoop(LoopRepeat, -1);
      action.play();
      this.model.rotation.x += Math.PI;
      this.model.name = 'AounScene';
      return this.model;
    });
  }

  update = (delta: number) => {
    this.aounMixer.update(delta);
  };
}
