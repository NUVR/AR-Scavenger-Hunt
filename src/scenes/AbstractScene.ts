import { SceneMapper } from 'SceneMapper';
import { Object3D } from 'three';
import { clock } from '../ClockSingleton';

class NotImplementedError extends Error {}

export abstract class AbstractScene implements SceneMapper {
  protected model: Object3D;
  private eventListenerId: number;

  constructor() {
    this.eventListenerId = clock.addEventListener(this.update);
  }

  update = (delta: number) => {};

  abstract async loadModel(): Promise<Object3D>;

  hasModel() {
    return !!this.model;
  }

  getModel() {
    return this.model;
  }
}
