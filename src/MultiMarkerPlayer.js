import { THREEx } from '../lib/ar';

import {
  Scene,
  WebGLRenderer,
  Color,
  PerspectiveCamera,
  Camera,
  Group,
  Stats,
  AxisHelper,
  CubeGeometry,
  MeshNormalMaterial,
  Mesh,
  DoubleSide,
  TorusKnotGeometry,
} from 'three';

import './style.scss';

const { ArToolkitSource, ArToolkitContext, ArMarkerControls } = THREEx;

// init renderer
var renderer = new WebGLRenderer({
  alpha: true
});
renderer.setClearColor(new Color('lightgrey'), 0)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild(renderer.domElement);
// init scene and camera
var scene = new Scene();
// array of functions for the rendering loop
var onRenderFcts = [];
////////////////////////////////////////////////////////////////////////////////
//          handle urlOptions
////////////////////////////////////////////////////////////////////////////////
var hasHash = location.hash.substring(1) !== '' ? true : false;
let urlOptions;
if (hasHash === true) {
  urlOptions = JSON.parse(decodeURIComponent(location.hash.substring(1)));
} else {
  urlOptions = {
    trackingBackend: 'artoolkit',
  }
}
window.urlOptions = urlOptions;
urlOptionsUpdate()
function urlOptionsUpdate() {
  location.hash = '#' + encodeURIComponent(JSON.stringify(urlOptions))
}
//////////////////////////////////////////////////////////////////////////////////
//		Initialize a basic camera
//////////////////////////////////////////////////////////////////////////////////
// Create a camera
if (urlOptions.trackingBackend === 'artoolkit') {
  var camera = new Camera();
} else if (urlOptions.trackingBackend === 'aruco') {
  var camera = new PerspectiveCamera(42, renderer.domElement.width / renderer.domElement.height, 0.01, 100);
} else console.assert(false)
scene.add(camera);
////////////////////////////////////////////////////////////////////////////////
//          handle arToolkitSource
////////////////////////////////////////////////////////////////////////////////
var artoolkitProfile = new ARjs.Profile()
artoolkitProfile.sourceWebcam()
  .trackingBackend(urlOptions.trackingBackend);
var arToolkitSource = new ArToolkitSource({
  sourceType: 'webcam',
});
arToolkitSource.init(function onReady() {
  onResize()
})

// handle resize
window.addEventListener('resize', function () {
  onResize()
})
function onResize() {
  arToolkitSource.onResizeElement()
  arToolkitSource.copyElementSizeTo(renderer.domElement)
  if (urlOptions.trackingBackend === 'artoolkit') {
    if (arToolkitContext.arController !== null) {
      arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
    }
  } else if (urlOptions.trackingBackend === 'aruco') {
    arToolkitSource.copyElementSizeTo(arToolkitContext.arucoContext.canvas)
    camera.aspect = renderer.domElement.width / renderer.domElement.height;
    camera.updateProjectionMatrix();
  } else console.assert(false)
}
////////////////////////////////////////////////////////////////////////////////
//          initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////	
// create atToolkitContext
var arToolkitContext = new ArToolkitContext({
  cameraParametersUrl: 'assets/camera_para.dat',
  detectionMode: 'mono',
});
// initialize it
arToolkitContext.init(function onCompleted() {
  // if artoolkit, copy projection matrix to camera
  if (arToolkitContext.parameters.trackingBackend === 'artoolkit') {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  }
})
// update artoolkit on every frame
onRenderFcts.push(function () {
  if (arToolkitSource.ready === false) return
  arToolkitContext.update(arToolkitSource.domElement)
})
//////////////////////////////////////////////////////////////////////////////
//		get multiMarkerFile
//////////////////////////////////////////////////////////////////////////////

// if no localStorage.ARjsMultiMarkerFile, then write one with default marker
if (localStorage.getItem('ARjsMultiMarkerFile') === null) {
  THREEx.ArMultiMarkerUtils.storeDefaultMultiMarkerFile(urlOptions.trackingBackend)
}

// get multiMarkerFile from localStorage
console.assert(localStorage.getItem('ARjsMultiMarkerFile') !== null)
var multiMarkerFile = localStorage.getItem('ARjsMultiMarkerFile')
//////////////////////////////////////////////////////////////////////////////
//		Create ArMultiMarkerControls
//////////////////////////////////////////////////////////////////////////////
// build a markerRoot
var markerRoot = new Group()
scene.add(markerRoot)

// build a multiMarkerControls
var multiMarkerControls = THREEx.ArMultiMarkerControls.fromJSON(arToolkitContext, scene, markerRoot, multiMarkerFile)
// build a smoothedControls
var smoothedRoot = new Group()
scene.add(smoothedRoot)
var smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot)
onRenderFcts.push(function (delta) {
  // update smoothedControls parameters depending on how many markers are visible in multiMarkerControls
  multiMarkerControls.updateSmoothedControls(smoothedControls)
  // update smoothedControls position
  smoothedControls.update(markerRoot)
})
//////////////////////////////////////////////////////////////////////////////
//		markerHelpers
//////////////////////////////////////////////////////////////////////////////
// display THREEx.ArMarkerHelper if needed - useful to debug
var markerHelpers = []
multiMarkerControls.subMarkersControls.forEach(function (subMarkerControls) {
  // add an helper to visuable each sub-marker
  var markerHelper = new THREEx.ArMarkerHelper(subMarkerControls)
  markerHelpers.push(markerHelper)
  subMarkerControls.object3d.add(markerHelper.object3d)
})
function markerHelpersToggleVisibility() {
  var wasVisible = markerHelpers[0].object3d.visible
  markerHelpers.forEach(function (markerHelper) {
    markerHelper.object3d.visible = wasVisible ? false : true
  })
}
window.markerHelpersToggleVisibility = markerHelpersToggleVisibility
//////////////////////////////////////////////////////////////////////////////
//		init UI
//////////////////////////////////////////////////////////////////////////////
document.querySelector('#recordButton').addEventListener('click', function () {
  urlOptionsUpdate()
  THREEx.ArMultiMarkerUtils.navigateToLearnerPage('learner.html', urlOptions.trackingBackend)
})

window.resetMarkerFile = function () {
  THREEx.ArMultiMarkerUtils.storeDefaultMultiMarkerFile(urlOptions.trackingBackend)
  location.reload()
}

function trackingBackendSet(trackingBackend) {
  THREEx.ArMultiMarkerUtils.storeDefaultMultiMarkerFile(trackingBackend)

  urlOptions.trackingBackend = trackingBackend
  urlOptionsUpdate()

  location.reload()
}
window.trackingBackendSet = trackingBackendSet

  //////////////////////////////////////////////////////////////////////////////////
  //		Add simple object on smoothedRoot
  //////////////////////////////////////////////////////////////////////////////////
  ; (function () {
    var arWorldRoot = new Group()
    var averageMatrix = THREEx.ArMultiMarkerControls.computeCenter(multiMarkerFile)
    averageMatrix.decompose(arWorldRoot.position, arWorldRoot.quaternion, arWorldRoot.scale)
    smoothedRoot.add(arWorldRoot)
    // markerRoot.add(arWorldRoot)
    // var screenAsPortal = new THREEx.ScreenAsPortal(multiMarkerFile)
    // arWorldRoot.add(screenAsPortal.object3d)
    var mesh = new AxisHelper()
    arWorldRoot.add(mesh)

    // add a torus knot	
    var geometry = new CubeGeometry(1, 1, 1);
    var material = new MeshNormalMaterial({
      transparent: true,
      opacity: 0.5,
      side: DoubleSide
    });
    var mesh = new Mesh(geometry, material);
    mesh.position.y = geometry.parameters.height / 2
    arWorldRoot.add(mesh)

    var geometry = new TorusKnotGeometry(0.3, 0.1, 64, 16);
    var material = new MeshNormalMaterial();
    var mesh = new Mesh(geometry, material);
    mesh.position.y = 0.5
    arWorldRoot.add(mesh);

    onRenderFcts.push(function (delta) {
      mesh.rotation.x += delta * Math.PI
    })
  })()
//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////
var stats = new Stats();
// document.body.appendChild( stats.dom );
// render the scene
onRenderFcts.push(function () {
  renderer.render(scene, camera);
  stats.update();
})
// run the rendering loop
var lastTimeMsec = null
requestAnimationFrame(function animate(nowMsec) {
  // keep looping
  requestAnimationFrame(animate);
  // measure time
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec = nowMsec
  // call each update function
  onRenderFcts.forEach(function (onRenderFct) {
    onRenderFct(deltaMsec / 1000, nowMsec / 1000)
  })
})