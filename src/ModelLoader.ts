import { GLTFLoader, GLTF } from 'three';

export class ModelLoader {
  private gltfLoader: GLTFLoader;
  private cachedGLTF: { [key: string]: GLTF };

  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.cachedGLTF = {};
  }

  async loadModel(model: string) {
    return new Promise(
      (resolve: (gltf: GLTF) => void, reject: (error: any) => void) => {
        if (this.cachedGLTF[model]) {
          resolve(this.cachedGLTF[model]);
        }
        this.gltfLoader.load(
          model,
          (gltf: GLTF) => {
            this.cachedGLTF[model] = gltf;
            resolve(gltf);
          },
          error => reject(error)
        );
      }
    );
  }
}
