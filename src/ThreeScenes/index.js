/* Entry point to three.js scenes that may be rendered by the app as the AR image above HIRO marker. */
import Initial from './Initial';

export default {
  init
}

/**
 * I expect to have few models for the time being. If the number grows the scene functions
 * should be hosted on backend.
 */
function init(sceneKey, camera, scene, renderer) {
  switch(sceneKey) {
    case 'Initial':
    default:
      return Initial(camera, scene, renderer);
  }
}