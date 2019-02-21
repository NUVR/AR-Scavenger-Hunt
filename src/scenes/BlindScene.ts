import { SceneMapper } from 'SceneMapper';
import { Object3D } from 'three';
import ModelLoader from './ModelLoader';

export class BlindScene implements SceneMapper {
  ASSET_URL = 'assets/Models/Blind/ForTheBlind.gltf';

  private blind: Object3D;

  async loadModel() {
    return ModelLoader.loadModel(this.ASSET_URL).then(gltf => {
      this.blind = gltf.scene;
      this.blind.rotation.x -= Math.PI / 2;
      this.blind.scale.set(0.25, 0.25, 0.25);
      this.blind.position.x += 0.5;
      this.blind.name = 'BlindScene';
      return this.blind;
    });
  }

  hasModel() {
    return !!this.blind;
  }

  getModel() {
    return this.blind;
  }
}
