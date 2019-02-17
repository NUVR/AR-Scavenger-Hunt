import { SceneMapper } from 'SceneMapper';
import { Object3D, Texture, CubeGeometry, MeshBasicMaterial, BackSide, Mesh } from 'three';
import ModelLoader from './ModelLoader';

export class MovieScene implements SceneMapper {
  ASSET_URL = 'assets/Textures/BeeMovieScript.png';

  private texture: Texture;
  private script: Object3D;

  async loadModel() {
    const geometry = new CubeGeometry(2, 0.25, 8);

    return ModelLoader.loadTexture(this.ASSET_URL).then(texture => {
      this.texture = texture;
      // texture.wrapS = RepeatWrapping;
      // texture.wrapT = RepeatWrapping;
      const material = new MeshBasicMaterial({
        transparent: true,
        map: texture,
        side: BackSide,
      });
      const script = new Mesh(geometry, material);
      script.position.z = 4;
      script.rotation.y += Math.PI;
      script.scale.x = -1;
      this.script = script;
      return this.script;
    });
  }

  update() {
    if (this.script.position.z < -4) {
      this.script.position.z = 4;
    } else {
      this.script.position.z -= 0.0025;
    }
  }

  hasModel() {
    return !!this.script;
  }

  getModel() {
    return this.script;
  }

  getTexture() {
    return this.texture;
  }
}
