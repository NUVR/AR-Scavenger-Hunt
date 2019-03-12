import ModelLoader from './ModelLoader';
import { AbstractScene } from './AbstractScene';

export class BlindScene extends AbstractScene {
  ASSET_URL = 'assets/Models/Blind/ForTheBlind.gltf';

  async loadModel() {
    return ModelLoader.loadModel(this.ASSET_URL).then(gltf => {
      const blind = gltf.scene;
      blind.rotation.x -= Math.PI / 2;
      blind.scale.set(0.25, 0.25, 0.25);
      blind.position.x += 0.5;
      blind.name = 'BlindScene';
      this.model = blind;
      return blind;
    });
  }
}
