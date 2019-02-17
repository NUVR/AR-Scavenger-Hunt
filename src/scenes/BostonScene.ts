import { SceneMapper } from 'SceneMapper';
import { Object3D } from 'three';
import ModelLoader from './ModelLoader';

export class BostonScene implements SceneMapper {
  ASSET_URL = 'assets/Models/NortheasternMap2/BostonFromAltizure2-0Cut.gltf';

  private boston: Object3D;

  async loadModel() {
    return ModelLoader.loadModel(this.ASSET_URL).then(gltf => {
      const bostonMap = gltf.scene;
      bostonMap.rotation.x -= Math.PI / 9; // 20 degree angle?
      bostonMap.scale.set(0.75, 2, 0.75);
      this.boston = bostonMap;
      return bostonMap;
    });
  }

  hasModel() {
    return !!this.boston;
  }

  getModel() {
    return this.boston;
  }
}
