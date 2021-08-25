import './style.css'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';


/**
 * Base
 */
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
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
//change position of light to right of the center of the scene
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

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
sphere.position.set(1.5, 0, 0)

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)
cube.position.set(3, 1, -1)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.set(-1.5, 0, 0) 

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    material
)
plane.rotation.set(- Math.PI * 0.5, 0, 0)
plane.position.set(0, -0.65, 0)

scene.add(sphere, cube, torus, plane)

/**
 * Models
 */
//gltf
const gltfLoader = new GLTFLoader()
const gltfURL = "/models/gltf/Fox.gltf";
gltfLoader.load(gltfURL,(gltf) => {
        gltf.scene.scale.set(0.015, 0.015, 0.015)
        scene.add(gltf.scene)
    }
)
 
//obj
const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();
const mtlURL = '/models/obj/exportobj.mtl'
const objURL = "/models/obj/exportobj.obj";
mtlLoader.load(mtlURL, (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load(objURL,(obj) => {
        obj.position.set(3, -0.8, 0)
        obj.rotation.set(0, 10, 0)
        obj.scale.set(0.0015, 0.0015, 0.0015)
        scene.add(obj)
        }
    )
})

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
camera.position.set(0, 1, 2)
scene.add(camera)

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
    if(keyboard['w'] || keyboard['ArrowUp']) {
        controlCamera.moveForward(speed);
    }
    if(keyboard['s'] || keyboard['ArrowDown']) {
        controlCamera.moveForward(-speed);
    }
    if(keyboard['a'] || keyboard['ArrowRight']) {
        controlCamera.moveRight(speed);
    }
    if(keyboard['d'] || keyboard['ArrowLeft']) {
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
    // controls.update()

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
