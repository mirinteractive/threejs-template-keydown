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
        color: '#458625',
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
function objectColisionBox(container, box) {
    this.container = container,
    this.box = box,
    // this.width = width,
    // this.height = height,
    // this.depth = depth,
    // this.positionX = positionX,
    // this.positionY = positionY,
    // this.positionZ = positionZ

    this.createBox = function createBox() {
        scene.add(box)

        const shape = new CANNON.Box(new CANNON.Vec3(
            this.box.scale.x * 0.5, 
            this.box.scale.y * 0.5, 
            this.box.scale.z * 0.5
            ))
        const body = new CANNON.Body({
            mass: objectMass,
            shape: shape,
        })
        body.position.copy(box.position)
        world.addBody(body)

        this.container.push({ box, body })
    }
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 1, 2)
scene.add(camera)
cameraCollisionBox(1, 2, 1, { x: 0, y: 0, z: 0 })

/**
 * Objects
 */
const material = new THREE.MeshStandardMaterial({
    roughness: 0.4
})

//sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.set(1.5, 0, 0)
const sphereShape = new CANNON.Sphere(0.5);
const sphereBody = new CANNON.Body({
    mass: objectMass,
    position: sphere.position,
    shape: sphereShape
})

//cube
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    
)
cube.position.set(3, 1, -1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 3, 1),
    
)
cube2.position.set(1, 0, 1)
const cube2Container = []
const testCube = new objectColisionBox(cube2Container, cube2)

testCube.createBox()

//cubeTest
const cubeTest = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
)
cubeTest.position.set(-3, 0, 0)


//torus
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    
)
torus.position.set(-1.5, 0, 0) 

//floor
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    material
)
plane.rotation.set(- Math.PI * 0.5, 0, 0)
plane.position.set(0, -0.65, 0)
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: floorMass,
    shape: floorShape
})
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(- 1, 0, 0), 
    Math.PI * 0.5
) 
//floorBody.addShape(floorShape) 형태로 문법을 작성하면 하나의 body에 여러 shape를 추가 할 수 있다.

scene.add(sphere, cube, torus, plane, cubeTest)
world.addBody(sphereBody)
world.addBody(floorBody)

//box adding test
const objectsToUpdate = []
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const createBox = (width, height, depth, position) =>
{
    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

    const body = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(1, 4, 2),
        shape: shape,
        // material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)

    // Save in objects
    objectsToUpdate.push({ mesh, body })
}
createBox(1, 4, 2, { x: 5, y: 0, z: 0 })

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
    fbx.position.set(20, 0, 0)
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
function processKeyboardRaycaster() {
    if(keyboard['w'] || keyboard['ArrowUp']) {
        camera.position.x =+1
        console.log('up');
    }
    if(keyboard['s'] || keyboard['ArrowDown']) {
        camera.position.x =-1
        console.log('down');
    }
    if(keyboard['d'] || keyboard['ArrowRight']) {
        camera.position.z =-1
        console.log('right');
    }
    if(keyboard['a'] || keyboard['ArrowLeft']) {
        camera.position.z =+1
        console.log('left');
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
        // object.collisionBox.position.copy(camera.position)
        object.collisionBox.position.x = camera.position.x-3
        object.collisionBox.position.z = camera.position.z-5
        object.body.position.copy(object.collisionBox.position)
    }

    //objects
    sphere.position.copy(sphereBody.position)
    floorBody.position.copy(plane.position)

    /**
     * Raycaster
     */
    const testX = camera.position.x-3
    const testZ = camera.position.z-5
    const rayOrigin = new THREE.Vector3(testX, 0, testZ)
    const raycaster = new THREE.Raycaster()
    const rayDirection = new THREE.Vector3(10,10,10)
    rayDirection.normalize()
    raycaster.set(rayOrigin, rayDirection)
    
    const objectsToTest = [torus, cube, cubeTest]
    const intersects = raycaster.intersectObjects(objectsToTest)
    for(const object of objectsToTest)
    {
        object.material.color.set('#ff0000')
    }

    for(const intersect of intersects)
    {
        intersect.object.material.color.set('#0000ff')
        processKeyboardRaycaster()
    }
    // console.log(camera.position);

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