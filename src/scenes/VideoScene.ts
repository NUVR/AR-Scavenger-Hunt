import {
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  RGBFormat,
  Texture,
  VideoTexture,
} from 'three';
import { AbstractScene } from './AbstractScene';

export class VideoScene extends AbstractScene {
  private texture: Texture;

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
      this.model = videoMesh;
      this.model.name = 'VideoScene';
      return this.model;
    });
  }

  update = () => {};

  getTexture() {
    return this.texture;
  }
}
