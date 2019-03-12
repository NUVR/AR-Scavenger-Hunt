import { Clock } from 'three';

type DeltaEvent = (delta: number) => void;
class ClockSingleton {
  private clock: Clock;
  private eventMap: { [key: number]: DeltaEvent };
  constructor() {
    this.clock = new Clock();
    this.eventMap = {};
    setInterval(this.onTick, 1000 / 60);
  }

  addEventListener(listener: DeltaEvent) {
    const id = performance.now();
    this.eventMap[id] = listener;
    return id;
  }

  removeEventListener(id: number) {
    delete this.eventMap[id];
  }

  private onTick = () => {
    const delta = this.clock.getDelta();
    for (const key of Object.keys(this.eventMap)) {
      const listener = this.eventMap[key as any];
      listener(delta);
    }
  };
}

export const clock = new ClockSingleton();
