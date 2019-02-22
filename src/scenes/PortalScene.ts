import { SceneMapper } from 'SceneMapper';
import {
  Object3D,
  Texture,
  MeshBasicMaterial,
  DoubleSide,
  Mesh,
  PlaneGeometry,
  BackSide,
  CubeGeometry,
  Group,
} from 'three';
import ModelLoader from './ModelLoader';
import { AbstractScene } from './AbstractScene';

export class PortalScene extends AbstractScene {
  ASSET_URL = 'images/sphere-colored.png';
  TEXTURES = [
    'assets/Textures/mountain/posx.jpg',
    'assets/Textures/mountain/negx.jpg',
    'assets/Textures/mountain/posy.jpg',
    'assets/Textures/mountain/negy.jpg',
    'assets/Textures/mountain/posz.jpg',
    'assets/Textures/mountain/negz.jpg',
  ];

  private textures: Texture[];

  async loadModel() {
    const promises = this.TEXTURES.map(texture => ModelLoader.loadTexture(texture));
    promises.push(ModelLoader.loadTexture(this.ASSET_URL));
    return Promise.all(promises).then(textures => {
      this.textures = textures;
      this.model = new Group();

      const skyTextures = textures.slice(0, 6);
      const defaultTexture = textures[6];

      // material for portal (for debugging)
      const defaultMaterial = new MeshBasicMaterial({
        map: defaultTexture,
        color: 0x444444,
        side: DoubleSide,
        transparent: true,
        opacity: 0.6,
      });

      const portalWidth = 2;
      const portalHeight = 2;
      const portalBorder = 0.1;
      const portal = new Mesh(new PlaneGeometry(portalWidth, portalHeight), defaultMaterial);
      portal.rotation.x += Math.PI / 2;
      portal.position.y = portalHeight / 2 + portalBorder;
      portal.layers.set(1);
      this.model.add(portal);

      // TODO: camera.layers.enable(1);

      const portalMaterial = new MeshBasicMaterial({
        color: 0xffff00,
        side: DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const portalBorderMesh = new Mesh(
        new PlaneGeometry(portalWidth + 2 * portalBorder, portalHeight + 2 * portalBorder),
        portalMaterial
      );
      portalBorderMesh.rotation.x += Math.PI / 2;
      portalBorderMesh.position.y = portal.position.y;
      portalBorderMesh.layers.set(0);
      this.model.add(portalBorderMesh);

      // the world beyond the portal
      // textures from http://www.humus.name/
      const skyMaterialArray = skyTextures.map(
        texture => new MeshBasicMaterial({ map: texture, side: BackSide })
      );
      const skyMesh = new Mesh(new CubeGeometry(30, 30, 30), skyMaterialArray);
      skyMesh.rotation.x -= Math.PI / 2;
      skyMesh.layers.set(2);
      this.model.add(skyMesh);

      this.model.name = 'PortalScene';
      return this.model;
    });
  }
}
