import ModelLoader from './ModelLoader';
import { AbstractScene } from './AbstractScene';

export class BostonScene extends AbstractScene {
  ASSET_URL = 'assets/Models/NortheasternMap2/BostonFromAltizure2-0Cut.gltf';

  async loadModel() {
    return ModelLoader.loadModel(this.ASSET_URL).then(gltf => {
      const bostonMap = gltf.scene;
      bostonMap.rotation.x -= Math.PI / 9; // 20 degree angle?
      bostonMap.scale.set(0.75, 2, 0.75);
      this.model = bostonMap;
      this.model.name = 'BostonScene';
      return bostonMap;
    });
  }
}
