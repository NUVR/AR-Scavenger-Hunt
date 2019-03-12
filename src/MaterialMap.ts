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

type MatMap = { pattern: Patterns; modelLoader: SceneMapper };

const materialMap: MatMap[] = [
  { pattern: 'One', modelLoader: new MeshesScene() },
  { pattern: 'Two', modelLoader: new KnucklesScene() },
  { pattern: 'Three', modelLoader: new BlindScene() },
  { pattern: 'Four', modelLoader: new VideoScene() },
  { pattern: 'Five', modelLoader: new PortalScene() },
  { pattern: 'NUvr', modelLoader: new AounScene() },
  { pattern: 'hiro', modelLoader: new MovieScene() },
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
          minConfidence: 0.6,
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
