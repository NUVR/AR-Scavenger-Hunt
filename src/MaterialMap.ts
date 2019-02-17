import { Patterns, SceneMapper } from 'SceneMapper';
import { KnucklesScene, AounScene, MovieScene, MeshesScene } from './scenes';

export const materialMap: { pattern: Patterns; modelLoader: SceneMapper }[] = [
  { pattern: 'One', modelLoader: new MeshesScene() },
  { pattern: 'Two', modelLoader: new KnucklesScene() },
  { pattern: 'NUvr', modelLoader: new AounScene() },
  { pattern: 'hiro', modelLoader: new MovieScene() },
];

export const preload = () =>
  Promise.all([materialMap.map(({ modelLoader }) => modelLoader.loadModel())]);
