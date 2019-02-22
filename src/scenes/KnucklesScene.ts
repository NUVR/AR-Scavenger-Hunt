import { AnimationMixer, LoopRepeat } from 'three';
import ModelLoader from './ModelLoader';
import { AbstractScene } from './AbstractScene';

export class KnucklesScene extends AbstractScene {
  ASSET_URL = 'assets/Models/ugandan_knuckles/scene.gltf';

  private knucklesMixer: AnimationMixer;
  private reversed = false;

  async loadModel() {
    return ModelLoader.loadModel(this.ASSET_URL).then(gltf => {
      this.model = gltf.scene;
      const knuckles = this.model;
      knuckles.scale.set(0.00125, 0.00125, 0.00125);
      this.knucklesMixer = new AnimationMixer(knuckles);
      const run = gltf.animations[0];
      const action = this.knucklesMixer.clipAction(run);
      action.setLoop(LoopRepeat, -1);
      action.play();
      knuckles.position.z -= 0.6;
      knuckles.position.x = 0.45;
      knuckles.rotation.y -= Math.PI / 2;
      knuckles.name = 'KnucklesScene';
      return this.model;
    });
  }

  update = (delta: number) => {
    this.knucklesMixer.update(delta);
    this.updateKnucklesPosition();
  };

  updateKnucklesPosition() {
    const knuckles = this.model;
    if (!knuckles) {
      return;
    }

    // starting position
    let xv = 0;
    let zv = 0;
    /**
     * If we are within .1 of -.5 for any then start adding
     */
    if (knuckles.position.x > 0 && knuckles.position.z < -0.55) {
      // straight part of s on top
      if (this.reversed && knuckles.position.x > 0.4) {
        this.reversed = false;
        knuckles.rotation.y -= Math.PI;
      }
    } else if (knuckles.position.x < 0 && knuckles.position.z < 0) {
      // first curve
      if (!this.reversed) {
        knuckles.rotation.y += Math.PI / 90;
      } else {
        knuckles.rotation.y -= Math.PI / 90;
      }
    } else if (knuckles.position.x > 0 && knuckles.position.z < 0.55) {
      if (!this.reversed) {
        knuckles.rotation.y -= Math.PI / 90;
      } else {
        knuckles.rotation.y += Math.PI / 90;
      }
      // second curve
    } else if (knuckles.position.x < 0 && knuckles.position.z > 0.5) {
      // straight part of end of s
      if (!this.reversed && knuckles.position.x < -0.5) {
        this.reversed = true;
        console.log('reversed flipped!');
        knuckles.rotation.y += Math.PI;
      }
    }

    xv = Math.sin(knuckles.rotation.y) / 100;
    zv = Math.cos(knuckles.rotation.y) / 100;
    console.log('rotation: ' + knuckles.rotation.y + ' xv: ' + xv);
    console.log('rotation: ' + knuckles.rotation.y + ' zv: ' + zv);

    knuckles.position.x += xv;
    knuckles.position.z += zv;
  }
}
