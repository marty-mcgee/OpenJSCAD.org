// cd c:\hrg\3dp_dev\three.js; esbuild Three.jscad.js --outfile=C:/hrg/3dp_dev/OpenJSCAD.org/packages/web2/src/Three.jscad.js --bundle --watch --sourcemap=external --minify --format=esm
// cd c:\hrg\3dp_dev\Babylon.js; esbuild src/index.ts --outfile=C:/hrg/3dp_dev/OpenJSCAD.org/packages/web2/src/babylon.js --bundle --watch --sourcemap=external --minify --format=esm

import * as THREE from './Three.jscad.js'
import { CSG2Object3D } from './util/CSG2Object3D.js'

function toColor (c) {
  return new THREE.Color(...c)
}
let scene
let camera
let controls
let ground
let renderer
const SHADOW = false
const shouldRender = Date.now()
const lastRender = true
let renderTimer
// animate()

const entities = []
let canvas

CSG2Object3D(THREE)

const startRenderer = ({
  canvas,
  cameraPosition = [180, -180, 220],
  cameraTarget = [0, 0, 0],
  bg = [1, 1, 1]
}) => {
  camera = new THREE.PerspectiveCamera(45, 1, 1, 50000)
  camera.up.set(0, 0, 1)
  camera.position.set(...cameraPosition)
  camera.lookAt(...cameraTarget)

  scene = new THREE.Scene()

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
  hemiLight.position.set(0, 0, 2000)
  scene.add(hemiLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff)
  directionalLight.position.set(0, 200, 100)
  directionalLight.castShadow = SHADOW
  if (SHADOW) {
    directionalLight.shadow.camera.top = 180
    directionalLight.shadow.camera.bottom = -100
    directionalLight.shadow.camera.left = -120
    directionalLight.shadow.camera.right = 120
  }
  scene.add(directionalLight)

  // ground

  ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 200), new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: false }))
  // ground.rotation.x =  - Math.PI / 2;
  // ground.rotation.y =  - Math.PI / 2;
  ground.receiveShadow = SHADOW
  // scene.add(ground)

  setBg(bg)

  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, canvas })
  renderer.setPixelRatio(window.devicePixelRatio)
  console.log('canvasssssa', renderer.domElement)
  controls = new THREE.OrbitControls(camera, canvas)
  controls.target.set(0, 0, 0)
  controls.update()
  controls.addEventListener('change', function () {
    updateView()
  })
}

const tmFunc = typeof requestAnimationFrame === 'undefined' ? setTimeout : requestAnimationFrame

function updateView (delay = 8) {
  if (renderTimer || !renderer) return
  renderTimer = tmFunc(updateAndRender, delay)
}

function setBg (bg = [1, 1, 1]) {
  scene.background = new THREE.Color(...bg)
  updateView()
}

function updateAndRender () {
  renderTimer = null
  console.log('updateAndRender')
  controls.update()

  renderer.render(scene, camera)
  renderer.autoClear = false // allow to render multiple scenes one over other if needed
  // https://discourse.threejs.org/t/very-low-fps-when-using-composer-with-2-viewports-and-1-renderer/18586
  // https://webgl2fundamentals.org/webgl/lessons/webgl-multiple-views.html
  // http://jyunming-chen.github.io/tutsplus/tutsplus15.html  - top view plus 3d
  // https://codepen.io/jdrew1303/pen/poyVOyG --- BEST example
  // renderer.render(scene2, camera)
  // https://github.com/fennec-hub/ThreeOrbitControlsGizmo
  renderer.autoClear = true

}

function resize ({ width, height }) {
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  updateView()
}

const handlers = {
  entities: ({ entities }) => {
    entities.push()
  }
}

function receiveCmd (cmd) {
  const fn = handlers[cmd.action]
  if (!fn) {
    throw new Error('no handler for type: ' + cmd.action)
  }
  fn(cmd)
}

function sendCmd (cmd) {
  receiveCmd(cmd)
}

function setCamera ({ position, target }) {
  if (position) camera.position.set(...position)
  if (target) camera.lookAt(...position)
  updateView()
}

function getCamera () {
  const target = new THREE.Vector3(0, 0, -1)
  target.applyQuaternion(camera.quaternion)
  return {
    position: camera.position.toArray(),
    target: target.toArray()
  }
}

export default function JscadThreeViewer (el, { camera: _camera = {}, bg } = {}) {
  console.log('init Three.js viewer')
  canvas = document.createElement('CANVAS')
  el.appendChild(canvas)

  const destroy = () => {
    el.removeChild(canvas)
  }

  try {
    startRenderer({ canvas, bg, cameraPosition: _camera.position, cameraTarget: _camera.target })

    const resizeObserver = new ResizeObserver(entries => {
      const rect = entries[0].contentRect
      resize(rect)
    })
    resizeObserver.observe(el)
  } catch (error) {
    destroy()
    throw error
  }

  return { sendCmd, destroy, getCamera, setCamera, camera, setBg: setBg }
}
