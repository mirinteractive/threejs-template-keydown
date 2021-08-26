import './style.css'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import CANNON, { Sphere } from 'cannon';

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
 * Physics
 */
const world = new CANNON.World();
world.gravity.set(0, - 9.82, 0)
const sphereShapoe = new CANNON.Sphere(0.5);
const sphereBody = new CANNON.Body({
    mass: 1,
    //position은 fall and bounce를 위한거여서 collision에서는 삭제해야할지도
    position: new CANNON.Vec3(1.5, 0, 0),
    shape: sphereShapoe
})
world.addBody(sphereBody)
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape
})
//rotation
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(- 1, 0, 0), 
    Math.PI * 0.5
) 
world.addBody(floorBody)
//floorBody.addShape(floorShape) 형태로 문법을 작성하면 하나의 body에 여러 shape를 추가 할 수 있다.

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
        // console.log(gltf.scene.scale);
        scene.add(gltf.scene)
        //TODO: 여기 안에다가 physical gemometry 생성하기
    }
)

//fbx
 let fbxURL = "/models/fbx/exportfbx_standard.fbx"; 
 const fbxLoader = new FBXLoader(); 
 fbxLoader.load(fbxURL,(fbx) => {
    fbx.scale.set(0.0015, 0.0015, 0.0015)
    fbx.position.set(3, -0.8, 0)
    fbx.rotation.set(0, 10, 0)
    scene.add(fbx)
}
)

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
//physics: count how much time spent since last tick
let oldElapsedTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    //physice: update time
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    //physics: update physics world
    //use step function
    world.step(1/60, deltaTime, 3)

    //physics: link physics and threejs object
    sphere.position.copy(sphereBody.position)
    floorBody.position.copy(plane.position)

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
