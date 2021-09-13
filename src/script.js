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
directionalLight.position.set(0, 0.25, 0)
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
camera.position.set(-30, 1, 10)
//proper rotation point
camera.rotation.set(0, -Math.PI*0.3, 0)
scene.add(camera)
cameraCollisionBox(2, 2, 2, { x: 0, y: 0, z: 0 })

/**
 * Objects
 */
//floor
const floorMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.4,
    color: '#FFF1D0', 
})
const wallMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.4,
    color: '#06AED5', 
})

const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 50),floorMaterial)
floor.rotation.set(-Math.PI*0.5, 0, 0)
floor.position.set(0, -1, 0)
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

const wallFront = new THREE.Mesh(new THREE.BoxGeometry(80, 20, 1),wallMaterial)
wallFront.position.set(0, 0, -24)
const wallFrontContainer = []
const wallFrontCollision = new objectColisionBox(wallFrontContainer, wallFront, floorMass)
wallFrontCollision.createBox()

const wallBack = new THREE.Mesh(new THREE.BoxGeometry(80, 20, 1),wallMaterial)
wallBack.position.set(0, 0, 25)
const wallBackContainer = []
const wallBackCollision = new objectColisionBox(wallBackContainer, wallBack, floorMass)
wallBackCollision.createBox()

const wallRight = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 50),wallMaterial)
wallRight.position.set(40, 0, 0)
const wallRightContainer = []
const wallRightCollision = new objectColisionBox(wallRightContainer, wallRight, floorMass)
wallRightCollision.createBox()

const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 50),wallMaterial)
wallLeft.position.set(-39, 0, -10)
const wallLeftContainer = []
const wallLeftCollision = new objectColisionBox(wallLeftContainer, wallLeft, floorMass)
wallLeftCollision.createBox()

//door position
const doorMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.4,
    color: '#000000', 
})

const doorToNews = new THREE.Mesh(new THREE.BoxGeometry(5, 10, 0.1),doorMaterial)
doorToNews.position.set(-20, 3, -24)
const doorToTtv = new THREE.Mesh(new THREE.BoxGeometry(0.1, 10, 5),doorMaterial)
doorToTtv.position.set(39, 3, -5)
const doorToVtr = new THREE.Mesh(new THREE.BoxGeometry(0.1, 10, 5),doorMaterial)
doorToVtr.position.set(39, 3, 2)
const doorToPicasso = new THREE.Mesh(new THREE.BoxGeometry(0.1, 10, 5),doorMaterial)
doorToPicasso.position.set(39, 3, 19)
const doorToPortfolio = new THREE.Mesh(new THREE.BoxGeometry(0.1, 10, 5),doorMaterial)
doorToPortfolio.position.set(-39, 3, -19)
const doorToMediaTeam = new THREE.Mesh(new THREE.BoxGeometry(0.1, 10, 5),doorMaterial)
doorToMediaTeam.position.set(-39, 3, 19)
scene.add(doorToNews, doorToTtv, doorToVtr, doorToPicasso, doorToPortfolio, doorToMediaTeam)

//objects
const objectMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.4,
    color: '#086788', 
})
const monumentMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.4,
    color: '#DD1C1A', 
})

const wallOfFame = new THREE.Mesh(new THREE.BoxGeometry(15, 8, 0.3),objectMaterial)
wallOfFame.position.set(-9, 4, -24)
const wallOfMomentum = new THREE.Mesh(new THREE.BoxGeometry(6, 8, 0.3),objectMaterial)
wallOfMomentum.position.set(3, 4, -24)
//
const grpupIntro = new THREE.Group();
grpupIntro.add(wallOfFame, wallOfMomentum)

const wallOfTtvVideo1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3, 5),objectMaterial)
wallOfTtvVideo1.position.set(39, 7, -3)
const stickerOfTtvPdf = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.5, 1.5),objectMaterial)
stickerOfTtvPdf.position.set(39, 4.5, -1.3)
const wallOfTtvVideo2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3, 5),objectMaterial)
wallOfTtvVideo2.position.set(39, 2, -0.8)
//
const grpupTtv = new THREE.Group();
grpupTtv.add(wallOfTtvVideo1, wallOfTtvVideo2, stickerOfTtvPdf)
grpupTtv.position.set(0, -0.9, -10)

const stickerOfFb = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0),objectMaterial)
stickerOfFb.position.set(-32, 5, 24)
const stickerOfIg= new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0),objectMaterial)
stickerOfIg.position.set(-35, 4, 24)
const stickerOfYt= new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0),objectMaterial)
stickerOfYt.position.set(-33, 3, 24)
//
const grpupSns = new THREE.Group();
grpupSns.add(stickerOfFb, stickerOfIg, stickerOfYt)

const stickerOfTech= new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0),objectMaterial)
stickerOfTech.position.set(32, 5, 24)
const stickerOfArch = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0),objectMaterial)
stickerOfArch.position.set(29, 4, 24)
const stickerOfIr = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0),objectMaterial)
stickerOfIr.position.set(31, 3, 24)
//
const grpupDock = new THREE.Group();
grpupSns.add(stickerOfTech, stickerOfArch, stickerOfIr)

const monumentLogoBot = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), monumentMaterial)
monumentLogoBot.position.set(0, 0, 0)
const monumentLogoTop = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), monumentMaterial)
monumentLogoTop.position.set(0, 2, 0)
//
const grpupLogo = new THREE.Group();
grpupLogo.add(monumentLogoBot, monumentLogoTop)
grpupLogo.position.set(-28, 0, 0)

const monumentContactBot = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), monumentMaterial)
monumentContactBot.position.set(0, 0, 0)
const monumentContactTop = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), monumentMaterial)
monumentContactTop.position.set(0, 2, 0)
//
const grpupContact = new THREE.Group();
grpupContact.add(monumentContactBot, monumentContactTop)
grpupContact.position.set(10, 0, -13)

const monumentTeamBot = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), monumentMaterial)
monumentTeamBot.position.set(0, 0, 0)
const monumentTeamMid = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), monumentMaterial)
monumentTeamMid.position.set(0, 1, 0)
const monumentTeamTop = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), monumentMaterial)
monumentTeamTop.position.set(0, 2, 0)
//
const grpupTeam = new THREE.Group();
grpupTeam.add(monumentTeamBot, monumentTeamMid, monumentTeamTop)
grpupTeam.position.set(-10, 0, 10)

scene.add(grpupIntro, grpupTtv, grpupSns, grpupDock, grpupLogo, grpupContact, grpupTeam);

const sphereBall = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), objectMaterial)
sphereBall.position.set(1.5, 0, 0)
const sphereBallContainer = []
const sphereBallCollision = new objectColisionSphere(sphereBallContainer, sphereBall, objectMass)
sphereBallCollision.createSphere()

/**
 * Models
 */
//gltf
const gltfLoader = new GLTFLoader()
const gltfURL = "/models/gltf/Fox.gltf";
const gltfObjectContainer = []
gltfLoader.load(gltfURL,(gltf) => {
        gltf.scene.scale.set(0.015, 0.015, 0.015)
        gltf.scene.position.set(1.5, -0.5, 0)

        const gltfObjectCollision = new objectColisionBox(gltfObjectContainer, gltf.scene, objectMass)
        gltfObjectCollision.createBox()
    }
)
//3d object
// console.log('cube2Container', typeof cube2Container);
// console.log('cube2Container', cube2Container);
// console.log('cube2Container', cube2Container[0]);
// console.log('cube2Container', cube2Container.body);
// console.log('cube2Container', Object.values(cube2Container));

// console.log('gltfObjectContainer', typeof gltfObjectContainer);
// console.log('gltfObjectContainer', gltfObjectContainer);
// console.log('gltfObjectContainer', gltfObjectContainer[0]);
// console.log('gltfObjectContainer', gltfObjectContainer.body);
// console.log('gltfObjectContainer', Object.values(gltfObjectContainer));

//fbx
//  let fbxURL = "/models/fbx/exportfbx_standard.fbx"; 
//  const fbxLoader = new FBXLoader(); 
//  fbxLoader.load(fbxURL,(fbx) => {
//     fbx.scale.set(0.0015, 0.0015, 0.0015)
//     fbx.position.set(15, 0, 0)
//     fbx.rotation.set(0, Math.PI*0.5, 0)
//     scene.add(fbx)
// }
// )

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
    // cube2Container[0].box.position.copy(cube2Container[0].body.position)
    // cube2Container[0].box.quaternion.copy(cube2Container[0].body.quaternion)
    // objectsToUpdate[0].box.position.copy(objectsToUpdate[0].body.position)
    // objectsToUpdate[0].box.quaternion.copy(objectsToUpdate[0].body.quaternion)

    /**
    * Raycaster
    */
    let cameraPosition = camera.position
    const rayOrigin = new THREE.Vector3(cameraPosition.x, 0, cameraPosition.z)

    //camera & wall
    const raycasterWall = new THREE.Raycaster()
    const rayDirectionWall = new THREE.Vector3(1,10,1)
    rayDirectionWall.normalize()
    raycasterWall.set(rayOrigin, rayDirectionWall)
    const castObject = [wallFront, wallBack, wallRight, wallLeft]
    const intersectWall = raycasterWall.intersectObjects(castObject)

    //camera & floor
    const raycasterFloor = new THREE.Raycaster()
    const rayDirectionFloor = new THREE.Vector3(1,-10,1)
    rayDirectionFloor.normalize()
    raycasterFloor.set(rayOrigin, rayDirectionFloor)
    const castFloor = [floor]
    const intersectFloor = raycasterFloor.intersectObjects(castFloor)

    for(const object of castObject){
        object.material.color.set('#88B7B5')
    }
    for(const intersect of intersectWall){
        for(const intersect of intersectFloor) {
            if(intersectFloor[0].point.x < 0) {
                camera.position.x += 5
            }
            if(intersectFloor[0].point.x > 0) {
                camera.position.x -= 5
            }
            if(intersectFloor[0].point.z < 0) {
                camera.position.z += 5
            }
            if(intersectFloor[0].point.z > 0) {
                camera.position.z -= 5
            }
        }
    }

    // Update objects
    monumentLogoTop.rotation.y = 0.1 * elapsedTime
    monumentLogoTop.rotation.x = 0.15 * elapsedTime 

    monumentContactTop.rotation.y = 0.5 * elapsedTime
    monumentContactTop.rotation.x = 0.15 * elapsedTime
    monumentContactTop.rotation.z = -0.15 * elapsedTime

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