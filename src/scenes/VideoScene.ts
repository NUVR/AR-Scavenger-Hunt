import { SceneMapper } from 'SceneMapper';
import {
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneBufferGeometry,
  RGBFormat,
  Texture,
  VideoTexture,
} from 'three';
import ModelLoader from './ModelLoader';

export class VideoScene implements SceneMapper {
  private texture: Texture;
  private videoMesh: Object3D;

  async loadModel() {
    const geometry = new PlaneBufferGeometry(2, 2, 4, 4);
    const video = document.getElementById('video') as HTMLVideoElement;

    return Promise.resolve(new VideoTexture(video)).then(texture => {
      this.texture = texture;
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.format = RGBFormat;
      let material = new MeshBasicMaterial({ map: texture });

      let videoMesh = new Mesh(geometry, material);
      videoMesh.rotation.x = -Math.PI / 2;
      this.videoMesh = videoMesh;
      return this.videoMesh;
    });
  }

  update() {}

  hasModel() {
    return !!this.videoMesh;
  }

  getModel() {
    return this.videoMesh;
  }

  getTexture() {
    return this.texture;
  }
}
