/* api calls to /scene */

import ThreeScenes from '../ThreeScenes';

export default {
  get: fetchSceneToRender
}

// Make API call based on URL provided by the QR code to determine which ThreeScene to use
function fetchSceneToRender(camera, scene, renderer) {
  let sceneKey = 'Initial'; // TODO fetch id of scene. Obviously to /scene
  return ThreeScenes.init(sceneKey, camera, scene, renderer);
}