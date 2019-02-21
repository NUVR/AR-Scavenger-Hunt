import { SceneMapper } from 'SceneMapper';
import { Object3D, Texture, CubeGeometry, MeshBasicMaterial, BackSide, Mesh, Group } from 'three';
import ModelLoader from './ModelLoader';

export class TrolleyScene implements SceneMapper {

  private meshes: Object3D;

  async loadModel() {
    let trainGeo = new CubeGeometry(1, 1, 4);
    let oldManGeo = new CubeGeometry(1, 1, 1);
  
     let richBoiMaterial = new MeshBasicMaterial({
       color: 0xd4af37,
    });
    let oldManMaterial = new MeshBasicMaterial({
      color: 0xa3a3a3,
    });
    let trainMat = new MeshBasicMaterial({
      color: 0xffffff,
    });
    let train = new Mesh(trainGeo, trainMat);
    let oldMan1 = new Mesh(oldManGeo, oldManMaterial);
    let oldMan2 = new Mesh(oldManGeo, oldManMaterial);
    let richBoi = new Mesh(oldManGeo, richBoiMaterial);
    
    train.position.z -= 2;
  
    oldMan1.position.x -= 1;
    oldMan1.position.z += 2;
  
    oldMan2.position.x -= 1;
    oldMan2.position.z += 3.5;

    richBoi.position.x += 1;
    richBoi.position.z += 2;
    const group = new Group();
    this.meshes = group;
    this.meshes.name = 'TrolleyScene';
    group.add(train, oldMan1, oldMan2, richBoi);
    return group;
  }

  update() {
    // if (this.script.position.z < -4) {
    //   this.script.position.z = 4;
    // } else {
    //   this.script.position.z -= 0.0025;
    // }
  }

  hasModel() {
    return !!this.meshes;
  }

  getModel() {
    return this.meshes;
  }
}
