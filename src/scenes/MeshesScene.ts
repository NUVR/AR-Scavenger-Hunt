import {
  Object3D,
  CubeGeometry,
  Texture,
  RepeatWrapping,
  MeshBasicMaterial,
  BackSide,
  Mesh,
  BoxGeometry,
  Group,
} from 'three';
import ModelLoader from './ModelLoader';
import { SceneMapper } from 'SceneMapper';

export class MeshesScene implements SceneMapper {
  ASSET_URL = 'assets/Textures/tile4b.gif';

  private texture: Texture;
  private meshes: Object3D;

  async loadModel() {
    // the invisibility cloak (ring; has square hole)
    const geometry0 = new BoxGeometry(1, 15, 1);
    geometry0.faces.splice(4, 2); // make hole by removing top two triangles
    const material0 = new MeshBasicMaterial({
      colorWrite: false,
    });
    const mesh0 = new Mesh(geometry0, material0);
    mesh0.scale.set(1, 1, 1).multiplyScalar(1.01);
    mesh0.position.y = -7.5;

    return ModelLoader.loadTexture(this.ASSET_URL).then(texture => {
      this.texture = texture;
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set(1.25, 1.25);
      const geometry1 = new CubeGeometry(1, 15, 1);
      const material1 = new MeshBasicMaterial({
        transparent: true,
        map: texture,
        side: BackSide,
      });
      const mesh1 = new Mesh(geometry1, material1);
      mesh1.position.y = -7.5;

      const group = new Group();
      group.add(mesh1, mesh0);
      this.meshes = group;
      return this.meshes;
    });
  }

  hasModel() {
    return !!this.meshes;
  }

  getModel() {
    return this.meshes;
  }

  getTexture() {
    return this.texture;
  }
}
