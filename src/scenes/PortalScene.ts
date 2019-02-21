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

export class PortalScene implements SceneMapper {
  TEXTURES = [
    'assets/Textures/mountain/posx.jpg',
    'assets/Textures/mountain/negx.jpg',
    'assets/Textures/mountain/posy.jpg',
    'assets/Textures/mountain/negy.jpg',
    'assets/Textures/mountain/posz.jpg',
    'assets/Textures/mountain/negz.jpg',
    'assets/Textures/mountain/sphere-colored.png',
  ];

  private textures: Texture[];
  private group: Object3D;

  async loadModel() {
    const promises = this.TEXTURES.map(texture => ModelLoader.loadTexture(texture));
    return Promise.all(promises).then(textures => {
      this.textures = textures;
      this.group = new Group();

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
      this.group.add(portal);

      // TODO? camera.layers.enable(1); set up in index.ts?

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
      this.group.add(portalBorderMesh);

      // the world beyond the portal
      // textures from http://www.humus.name/
      const skyMaterialArray = skyTextures.map(
        texture => new MeshBasicMaterial({ map: texture, side: BackSide })
      );
      const skyMesh = new Mesh(new CubeGeometry(30, 30, 30), skyMaterialArray);
      skyMesh.rotation.x -= Math.PI / 2;
      skyMesh.layers.set(2);
      this.group.add(skyMesh);

      this.group.name = 'PortalScene';
      return this.group;
    });
  }

  hasModel() {
    return !!this.group;
  }

  getModel() {
    return this.group;
  }
  update() {
    // TODO: needs to do some fancy layer work directly effecting the camera and the renderer
  }
}
