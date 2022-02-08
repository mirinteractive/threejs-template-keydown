import * as THREE from 'three'
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

const STEPS_PER_FRAME = 5;
const keyStates = {};
const GRAVITY = 30;
const worldOctree = new Octree();
const playerCollider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1.2, 0 ), 0.35 );
const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();
const clock = new THREE.Clock();
let playerOnFloor = false;
let mouseTime = 0;

const windowSetting =(event)=>{
    document.addEventListener( 'keydown', ( event ) => {
        keyStates[ event.code ] = true;
    } );
    
    document.addEventListener( 'keyup', ( event ) => {
        keyStates[ event.code ] = false;
    } );
    
    document.addEventListener( 'mousedown', () => {
        document.body.requestPointerLock();
        mouseTime = performance.now();
    });
}

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

function updatePlayer( camera, deltaTime ) {
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

function getForwardVector(camera) {
    camera.getWorldDirection( playerDirection );
    playerDirection.y = 0;
    playerDirection.normalize();

    return playerDirection;
}

function getSideVector(camera) {
    camera.getWorldDirection( playerDirection );
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross( camera.up );

    return playerDirection;
}

function controls( camera, deltaTime ) {
    const speedDelta = deltaTime * ( playerOnFloor ? 25 : 8 );

    if ( keyStates[ 'KeyW' ] ) {
        playerVelocity.add( getForwardVector(camera).multiplyScalar( speedDelta ) );
    }

    if ( keyStates[ 'KeyS' ] ) {
        playerVelocity.add( getForwardVector(camera).multiplyScalar( - speedDelta ) );
    }

    if ( keyStates[ 'KeyA' ] ) {
        playerVelocity.add( getSideVector(camera).multiplyScalar( - speedDelta ) );
    }

    if ( keyStates[ 'KeyD' ] ) {
        playerVelocity.add( getSideVector(camera).multiplyScalar( speedDelta ) );
    }

    if ( playerOnFloor ) {

        if ( keyStates[ 'Space' ] ) {
            playerVelocity.y = 15;
        }
    }
}

const cameraControl =(camera)=>{
    const deltaTime = Math.min( 0.05, clock.getDelta() ) / STEPS_PER_FRAME;

    for ( let i = 0; i < STEPS_PER_FRAME; i ++ ) {
        controls( camera, deltaTime );
        updatePlayer(camera, deltaTime)
    }
}

export {
    windowSetting, cameraControl, worldOctree
}