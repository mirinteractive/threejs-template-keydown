import './style.css'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import CANNON from 'cannon';

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

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
 * Lights
 */
//ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)

//directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

/**
 * Physics
 */
 const world = new CANNON.World();
 world.gravity.set(0, - 9.82, 0);
 const floorMass = 0;
 const objectMass = 1;
 const cameraMass = 2;

 /**
 * Collision
 */
//camera
const cameraCollision = []
const collisionBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
        color: '#847996',
    })
)
scene.add(collisionBox)
const cameraCollisionBox = (width, height, depth, position) =>
{
    collisionBox.scale.set(width, height, depth)
    collisionBox.castShadow = true
    collisionBox.position.copy(position)
    scene.add(collisionBox)

    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

    const body = new CANNON.Body({
        mass: cameraMass,
        position: new CANNON.Vec3(0, 0, 0),
        shape: shape,
    })
    body.position.copy(position)
    world.addBody(body)

    cameraCollision.push({ collisionBox, body })
}

//object: box
function objectColisionBox(container, box, mass) {
    this.container = container,
    this.box = box,
    this.mass = mass,

    this.createBox = function createBox() {
        const shape = new CANNON.Box(new CANNON.Vec3(
            this.box.scale.x * 0.5, 
            this.box.scale.y * 0.5, 
            this.box.scale.z * 0.5
            ))
        const body = new CANNON.Body({
            mass: this.mass,
            position: new CANNON.Vec3(0, 0, 0),
            shape: shape,
        })
        body.position.copy(box.position)
        body.rotation = box.rotation
        scene.add(box)
        world.addBody(body)

        this.container.push({ box, body })
    }
}
//object: sphere
function objectColisionSphere(container, sphere, mass) {
    this.container = container,
    this.sphere = sphere,
    this.mass = mass,

    this.createSphere = function createSphere() {
        const shape = new CANNON.Sphere(this.sphere.scale.x * 0.5)
        const body = new CANNON.Body({
            mass: this.mass,
            position: new CANNON.Vec3(0, 0, 0),
            shape: shape,
        })
        body.position.copy(sphere.position)
        body.rotation = sphere.rotation
        scene.add(sphere)
        world.addBody(body)

        this.container.push({ sphere, body })
    }
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
//camera collision test
camera.position.set(3, 1, 5)
scene.add(camera)
cameraCollisionBox(1, 2, 1, { x: 0, y: 0, z: 0 })

/**
 * Objects
 */
//floor
const floorMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.4,
    color: '#F4ECD6', 
})

const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50),floorMaterial)
floor.rotation.set(-Math.PI*0.5, 0, 0)
floor.position.set(0, -0.65, 0)
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: floorMass,
    shape: floorShape
})
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(- 1, 0, 0), 
    Math.PI * 0.5
) 
world.addBody(floorBody)
scene.add(floor)

const wallFront = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 1))
wallFront.position.set(0, 0, -20)
const wallFrontContainer = []
const wallFrontCollision = new objectColisionBox(wallFrontContainer, wallFront, floorMass)
wallFrontCollision.createBox()

const wallBack = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 1))
wallBack.position.set(0, 0, 20)
const wallBackContainer = []
const wallBackCollision = new objectColisionBox(wallBackContainer, wallBack, floorMass)
wallBackCollision.createBox()

const wallRight = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 50))
wallRight.position.set(20, 0, 0)
const wallRightContainer = []
const wallRightCollision = new objectColisionBox(wallRightContainer, wallRight, floorMass)
wallRightCollision.createBox()

const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 50))
wallLeft.position.set(-20, 0, 0)
const wallLeftContainer = []
const wallLeftCollision = new objectColisionBox(wallLeftContainer, wallLeft, floorMass)
wallLeftCollision.createBox()

//objects
const objectMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.4,
    color: '#88B7B5', 
})

const sphereBall = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), objectMaterial)
sphereBall.position.set(1.5, 0, 0)
const sphereBallContainer = []
const sphereBallCollision = new objectColisionSphere(sphereBallContainer, sphereBall, objectMass)
sphereBallCollision.createSphere()

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), objectMaterial)
cube.position.set(3, 1, -1)

const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 1), objectMaterial)
cube2.position.set(1, 0, 1)
const cube2Container = []
const testCube = new objectColisionBox(cube2Container, cube2, objectMass)
testCube.createBox()

const cubeTest = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), objectMaterial)
cubeTest.position.set(-3, 0, 0)

const boxGeometry = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), objectMaterial)
boxGeometry.position.set(5, 0, 1)
const objectsToUpdate = []
const testCube2 = new objectColisionBox(objectsToUpdate, boxGeometry, objectMass)
testCube2.createBox()

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), objectMaterial)
torus.position.set(-1.5, 0, 0) 

scene.add(cube, torus, cubeTest)

/**
 * Models
 */
//gltf
const gltfLoader = new GLTFLoader()
const gltfURL = "/models/gltf/Fox.gltf";
gltfLoader.load(gltfURL,(gltf) => {
        gltf.scene.scale.set(0.015, 0.015, 0.015)
        gltf.scene.position.set(10, 0, 0)
        scene.add(gltf.scene)
        //TODO: 여기 안에다가 physical gemometry 생성하기
    }
)

//fbx
 let fbxURL = "/models/fbx/exportfbx_standard.fbx"; 
 const fbxLoader = new FBXLoader(); 
 fbxLoader.load(fbxURL,(fbx) => {
    fbx.scale.set(0.0015, 0.0015, 0.0015)
    fbx.position.set(15, 0, 0)
    fbx.rotation.set(0, Math.PI*0.5, 0)
    scene.add(fbx)
}
)

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
let speed = 0.2;
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

/**
* Camera Raycaster
*/
//up key를 누르고 옆으로 빠져나가면 나가짐
//이걸 해결해야함
function processKeyboardRaycaster() {
    if(keyboard['w'] || keyboard['ArrowUp']) {
        camera.position.z +=5
    }
    if(keyboard['s'] || keyboard['ArrowDown']) {
        camera.position.z -=5
    }
    if(keyboard['d'] || keyboard['ArrowRight']) {
        camera.position.x -=5
    }
    if(keyboard['a'] || keyboard['ArrowLeft']) {
        camera.position.x +=5
    }
}

/**
 * Animate
 */
//physics: count how much time spent since last tick
let oldElapsedTime = 0;

const tick = () =>
{
    //time
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    world.step(1/60, deltaTime, 3)

    //camera
    for(const object of cameraCollision){
        object.collisionBox.position.copy(camera.position)
        object.body.position.copy(object.collisionBox.position)
    }

    //objects
    wallFrontContainer[0].box.position.copy(wallFrontContainer[0].body.position)
    wallBackContainer[0].box.position.copy(wallBackContainer[0].body.position)
    wallRightContainer[0].box.position.copy(wallRightContainer[0].body.position)
    wallLeftContainer[0].box.position.copy(wallLeftContainer[0].body.position)
    floorBody.position.copy(floor.position)
    sphereBallContainer[0].sphere.position.copy(sphereBallContainer[0].body.position)
    cube2Container[0].box.position.copy(cube2Container[0].body.position)
    objectsToUpdate[0].box.position.copy(objectsToUpdate[0].body.position)

    /**
     * Raycaster
     */
    let cameraPosition = camera.position
    const rayOrigin = new THREE.Vector3(cameraPosition.x, 0, cameraPosition.z)
    const raycaster = new THREE.Raycaster()
    const rayDirection = new THREE.Vector3(10,10,10)
    rayDirection.normalize()
    raycaster.set(rayOrigin, rayDirection)
    
    const objectsToTest = [wallFront, wallBack, wallRight, wallLeft]
    const intersects = raycaster.intersectObjects(objectsToTest)
    for(const object of objectsToTest){
        object.material.color.set('#88B7B5')
    }
    for(const intersect of intersects){
        intersect.object.material.color.set('#310A31')
        processKeyboardRaycaster()
        console.log(cameraPosition);
    }

    // Update objects
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    cube.rotation.x = 0.15 * elapsedTime 
    torus.rotation.x = 0.15 * elapsedTime

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