import { Texture, CubeGeometry, MeshBasicMaterial, BackSide, Mesh } from 'three';
import ModelLoader from './ModelLoader';
import { AbstractScene } from './AbstractScene';

export class MovieScene extends AbstractScene {
  ASSET_URL = 'assets/Textures/BeeMovieScript.png';

  private texture: Texture;

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
      this.model = script;
      this.model.name = 'MovieScene';
      return this.model;
    });
  }

  update = () => {
    if (this.model.position.z < -4) {
      this.model.position.z = 4;
    } else {
      this.model.position.z -= 0.0025;
    }
  };

  getTexture() {
    return this.texture;
  }
}
