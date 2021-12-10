import './style.css'
import * as THREE from 'three'
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import * as environment from './environment'
import * as objects from './objects'

const canvas = document.querySelector('canvas.webgl');

const clock = new THREE.Clock();

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x88ccff );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotation.order = 'YXZ';
camera.position.set(3,1.5,5)
camera.rotation.set(0, -Math.PI, 0)
scene.add(camera)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

function onWindowResize() {
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize );

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const GRAVITY = 30;
const STEPS_PER_FRAME = 5;

const worldOctree = new Octree();

const playerCollider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1, 0 ), 0.35 );
const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();
const keyStates = {};

let playerOnFloor = false;
let mouseTime = 0;

document.addEventListener( 'keydown', ( event ) => {
    keyStates[ event.code ] = true;
});

document.addEventListener( 'keyup', ( event ) => {
    keyStates[ event.code ] = false;
});

document.addEventListener( 'mousedown', () => {
    document.body.requestPointerLock();
    mouseTime = performance.now();
});

document.body.addEventListener( 'mousemove', ( event ) => {
    if ( document.pointerLockElement === document.body ) {
        camera.rotation.y -= event.movementX / 500;
        camera.rotation.x -= event.movementY / 500;
    }
});

function playerCollisions() {
    const result = worldOctree.capsuleIntersect( playerCollider );
    playerOnFloor = false;

    if ( result ) {
        playerOnFloor = result.normal.y > 0;
        if ( ! playerOnFloor ) {
            playerVelocity.addScaledVector( result.normal, - result.normal.dot( playerVelocity ) );
        }
        playerCollider.translate( result.normal.multiplyScalar( result.depth ) );
    }
}

function updatePlayer( deltaTime ) {
    let damping = Math.exp( - 4 * deltaTime ) - 1;
    if ( ! playerOnFloor ) {
        playerVelocity.y -= GRAVITY * deltaTime;
        damping *= 0.1;
    }

    playerVelocity.addScaledVector( playerVelocity, damping );

    const deltaPosition = playerVelocity.clone().multiplyScalar( deltaTime );
    playerCollider.translate( deltaPosition );

    playerCollisions();

    camera.position.copy( playerCollider.end );
}

function getForwardVector() {
    camera.getWorldDirection( playerDirection );
    playerDirection.y = 0;
    playerDirection.normalize();

    return playerDirection;
}

function getSideVector() {
    camera.getWorldDirection( playerDirection );
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross( camera.up );

    return playerDirection;
}

function controls( deltaTime ) {
    const speedDelta = deltaTime * ( playerOnFloor ? 25 : 8 );

    if ( keyStates[ 'KeyW' ] ) {
        playerVelocity.add( getForwardVector().multiplyScalar( speedDelta ) );
    }

    if ( keyStates[ 'KeyS' ] ) {
        playerVelocity.add( getForwardVector().multiplyScalar( - speedDelta ) );
    }

    if ( keyStates[ 'KeyA' ] ) {
        playerVelocity.add( getSideVector().multiplyScalar( - speedDelta ) );
    }

    if ( keyStates[ 'KeyD' ] ) {
        playerVelocity.add( getSideVector().multiplyScalar( speedDelta ) );
    }

    if ( playerOnFloor ) {
        if ( keyStates[ 'Space' ] ) {
            playerVelocity.y = 15;
        }
    }
}

environment.basicSceneAdd(scene)
// objects.loadGltfModel(scene, worldOctree)
objects.loadMoldeledObjects(scene, worldOctree)

/**
 * Animate
 */
const tick = () =>
{
    const deltaTime = Math.min( 0.05, clock.getDelta() ) / STEPS_PER_FRAME;

    for ( let i = 0; i < STEPS_PER_FRAME; i ++ ) {
        controls( deltaTime );
        updatePlayer( deltaTime );
    }

    window.requestAnimationFrame(tick)
}
tick()

function drawScene() { 
    renderer.render(scene, camera);
    requestAnimationFrame(drawScene);
}
drawScene();