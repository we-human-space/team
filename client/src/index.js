// import 'babel-polyfill';
import Stats from 'stats.js';
import Helix from './three/helix/helix';
import HelixControls from './three/helix/controls';
import HelixControlsView from './three/helix/controls-view';

const THREE = require('three');

const OrbitControls = require('three-orbit-controls')(THREE);

function main() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  var webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(0, 1.0);
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMapEnabled = true;

  // position and point the camera to the center of the scene
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 100;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  // var spotLight = new THREE.SpotLight(0xffffff, 2);
  // spotLight.position.set(0, 60, 10);
  // spotLight.castShadow = true;
  // scene.add(spotLight);

  // add the output of the renderer to the html element
  document.getElementById('three-container').appendChild(webGLRenderer.domElement);

  var orbit = new OrbitControls(camera, webGLRenderer.domElement);
  orbit.enableZoom = true;

  // draw an axis helper
  var axesLength = 20;
  var axes = new THREE.AxisHelper(axesLength);
  scene.add(axes);

  var helix = new Helix({scene: scene});

  if(__DEV__){
    var stats = initStats();
    /* eslint-disable no-unused-vars */
    var gui = new HelixControlsView(new HelixControls(helix));
    /* eslint-enable no-unused-vars */
  }

  render();

  function render() {
    if(__DEV__){
      stats.update();
    }
    helix.update();
    // spotLight.lookAt(helix.helix3D);
    // render using requestAnimationFrame
    window.requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }

  function initStats() {
    var stats = new Stats();
    stats.setMode(0);

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.getElementById('stats-container').appendChild(stats.domElement);

    return stats;
  }
}

window.onload = main;
