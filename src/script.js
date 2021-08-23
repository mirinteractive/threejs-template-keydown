import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
//ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)

//directional light
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
//change position of light to right of the center of the scene
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

//hemisphere light
//onefrombottom,onefromtop, between mix
const hemisphereLight =new THREE.HemisphereLight(0xff0000, 0x0000ff,0.3)
scene.add(hemisphereLight) 

//point light
const pointLight = new THREE.PointLight(0xff9000, 0.5)
//change position
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

//rect area light
//color, intensity, width, height 
const rectAreaLight = new THREE.RectAreaLight(0x4000ff, 2, 1, 1)
//change position
rectAreaLight.position.set(-1.5, 0, 1.5)
//make light look the center of the scene
//default Vecter3 = 0,0,0
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

//spot light
//color, intensity, distance, angle(= smaller darker), penumbra(= dim of edges), decay(=keep 1)
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI*0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
//add target to move around
spotLight.target.position.x = -1.75
scene.add(spotLight.target)


//debug panel
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)

/**
 * helpers
 */
//hemisphereLightHelper
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

//directional light helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

//point light helper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

//spot light helper
//has no size thow
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
//update position
spotLightHelper.update()
window.requestAnimationFrame(() => {
    spotLightHelper.update()
})

//rect area light helper
//it is not a part of three.js so we need import it
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * FPS View
 */
let controlCamera = new PointerLockControls(camera, renderer.domElement);
const clock = new THREE.Clock();
// let delta = clock.getDelta;

let button = document.querySelector('#button')
button.addEventListener('click', () => {
    console.log('ViewStart');
    controlCamera.lock()
})

let keyboard = []
addEventListener('keydown', (e)=> {
    keyboard[e.key] = true;
})
addEventListener('keyup', (e)=> {
    keyboard[e.key] = false;
})

function processKeyboard() {
    let speed = 0.2;
    // let actualSpeed = speed * delta;
    if(keyboard['w', 'ArrowUp']) {
        controlCamera.moveForward(speed);
    }
    if(keyboard['s', 'ArrowDown']) {
        controlCamera.moveForward(-speed);
    }
    if(keyboard['a', 'ArrowRight']) {
        controlCamera.moveRight(speed);
    }
    if(keyboard['d', 'ArrowLeft']) {
        controlCamera.moveRight(-speed);
    }
}

/**
 * Animate
 */
// const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

function drawScene() { 
    renderer.render(scene, camera);
    processKeyboard();
    requestAnimationFrame(drawScene);
}
drawScene();
