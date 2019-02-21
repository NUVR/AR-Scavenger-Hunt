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
import { Group } from 'three';
import { THREEx } from 'ar';
import { TrolleyScene } from './scenes/TrolleyScene';

type MatMap = { pattern: Patterns; modelLoader: SceneMapper };

const materialMap: MatMap[] = [
  { pattern: 'One', modelLoader: new MeshesScene() }, // D
  { pattern: 'Two', modelLoader: new KnucklesScene() }, // S
  { pattern: 'Three', modelLoader: new BlindScene() }, // E
  { pattern: 'Four', modelLoader: new VideoScene() }, // Y
  { pattern: 'Five', modelLoader: new PortalScene() }, // R
  { pattern: 'NUvr', modelLoader: new AounScene() }, // No letter/Hint just promotional
  { pattern: 'hiro', modelLoader: new MovieScene() }, // Bee movie B
  { pattern: 'Train', modelLoader: new TrolleyScene() }, // o
];

class MaterialMap {
  sceneControls: {
    [key: string]: {
      matMap: MatMap;
      controls: THREEx.ArMarkerControls;
    };
  };

  constructor() {
    this.sceneControls = {};
  }

  preload() {
    return Promise.all(
      materialMap.map(async ({ modelLoader }) => {
        try {
          await modelLoader.loadModel();
        } catch (e) {
          return e;
        }
      })
    );
  }

  mapMarkers(context: THREEx.ArToolkitContext) {
    return materialMap
      .map(values => {
        const markerRoot = new Group();
        const arMarkerControls = new THREEx.ArMarkerControls(context, markerRoot, {
          type: 'pattern',
          patternUrl: `assets/Patts/${values.pattern}.patt`,
          // minConfidence: 0.2,
        });
        this.sceneControls[`${arMarkerControls.id}`] = {
          matMap: values,
          controls: arMarkerControls,
        };
        const { modelLoader } = values;
        if (modelLoader.hasModel()) {
          const model = modelLoader.getModel();
          markerRoot.add(model);
          markerRoot.name = model.name.split('Scene')[0];
        } else {
          console.error(`Unable to load model for ${values.pattern}`);
          return null;
        }
        return markerRoot;
      })
      .filter(group => !!group);
  }

  getActiveScenes() {
    return Object.keys(this.sceneControls)
      .map(key => {
        const obj = this.sceneControls[key];
        if (obj.controls.object3d.visible) {
          return obj.matMap.modelLoader;
        }
        return null;
      })
      .filter(mapper => !!mapper);
  }

  getSceneFromMarker(marker: Patterns) {
    return materialMap.find(({ pattern }) => pattern === marker);
  }
}

export default new MaterialMap();
