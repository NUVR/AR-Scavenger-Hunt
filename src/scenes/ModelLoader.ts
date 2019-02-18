import { GLTF, Texture, TextureLoader } from 'three';
import GLTFLoader from 'three-gltf-loader'
console.log(GLTFLoader)

class ModelLoader {
  private gltfLoader: GLTFLoader;
  private cachedGLTF: { [key: string]: GLTF };
  private textureLoader: TextureLoader;
  private cachedTextures: { [key: string]: Texture };

  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.cachedGLTF = {};
    this.textureLoader = new TextureLoader();
    this.cachedTextures = {};
  }

  async loadModel(model: string, onProgressEvent?: (progress: ProgressEvent) => void) {
    return new Promise((resolve: (gltf: GLTF) => void, reject: (error: any) => void) => {
      if (this.cachedGLTF[model]) {
        resolve(this.cachedGLTF[model]);
      }
      this.gltfLoader.load(
        model,
        (gltf: GLTF) => {
          this.cachedGLTF[model] = gltf;
          resolve(gltf);
        },
        onProgressEvent ? onProgressEvent : null,
        (error: any) => reject(error)
      );
    });
  }

  async loadTexture(textureFile: string, onProgressEvent?: (progress: ProgressEvent) => void) {
    return new Promise((resolve: (texture: Texture) => void, reject: (error: any) => void) => {
      if (this.cachedTextures[textureFile]) {
        resolve(this.cachedTextures[textureFile]);
      }
      this.textureLoader.load(
        textureFile,
        (texture: Texture) => {
          this.cachedTextures[textureFile] = texture;
          resolve(texture);
        },
        onProgressEvent ? onProgressEvent : null,
        error => reject(error)
      );
    });
  }
}

export default new ModelLoader();
