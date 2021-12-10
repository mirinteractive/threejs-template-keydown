import './style.css'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import * as environment from './environment'
import * as objects from './objects'

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x88ccff );
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

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
camera.position.set(-30, 1, 10)
//proper rotation point
camera.rotation.set(0, -Math.PI*0.3, 0)
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
const clock = new THREE.Clock();
let controlCamera = new PointerLockControls(camera, renderer.domElement);
let button = document.querySelector('#button')
let speed = 0.3;
let keyboard = []

button.addEventListener('click', () => {
    console.log('ViewStart');
    controlCamera.lock()
})

addEventListener('keydown', (e)=> {
    keyboard[e.key] = true;
})
addEventListener('keyup', (e)=> {
    keyboard[e.key] = false;
})

function processKeyboard() {
    if(keyboard['w'] || keyboard['ArrowUp']) {
        controlCamera.moveForward(speed);
    }
    if(keyboard['s'] || keyboard['ArrowDown']) {
        controlCamera.moveForward(-speed);
    }
    if(keyboard['d'] || keyboard['ArrowRight']) {
        controlCamera.moveRight(speed);
    }
    if(keyboard['a'] || keyboard['ArrowLeft']) {
        controlCamera.moveRight(-speed);
    }
}

environment.basicSceneAdd(scene)
objects.loadMoldeledObjects(scene)

/**
 * Animate
 */
const tick = () =>
{
    //time
    const elapsedTime = clock.getElapsedTime()

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