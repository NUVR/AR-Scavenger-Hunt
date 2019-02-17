import { Patterns, SceneMapper } from 'SceneMapper';
import {
  KnucklesScene,
  AounScene,
  MovieScene,
  MeshesScene,
  BlindScene,
  PortalScene,
  VideoScene,
} from './scenes';

export const materialMap: { pattern: Patterns; modelLoader: SceneMapper }[] = [
  { pattern: 'One', modelLoader: new MeshesScene() },
  { pattern: 'Two', modelLoader: new KnucklesScene() },
  { pattern: 'Three', modelLoader: new BlindScene() },
  { pattern: 'Four', modelLoader: new VideoScene() },
  { pattern: 'Five', modelLoader: new PortalScene() },
  { pattern: 'NUvr', modelLoader: new AounScene() },
  { pattern: 'hiro', modelLoader: new MovieScene() },
];

export const preload = () =>
  Promise.all([materialMap.map(({ modelLoader }) => modelLoader.loadModel())]);

export const getSceneFromMarker = (marker: Patterns) =>
  materialMap.find(({ pattern }) => pattern === marker);
