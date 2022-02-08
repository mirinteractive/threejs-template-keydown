import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as environment from './environment'
import * as objects from './objects'
import * as fps from './view-control'

const canvas = document.getElementById('webgl');

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x88ccff );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotation.order = 'YXZ';
camera.rotation.set(0, Math.PI*0.5, 0)
scene.add(camera)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//just for fps
window.addEventListener( 'mousemove', ( event ) => {
    if ( document.pointerLockElement === document.body ) {
        camera.rotation.y -= event.movementX / 500;
        camera.rotation.x -= event.movementY / 500;
    }
});
fps.windowSetting(event)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.physicallyCorrectLights = true
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.PCFSoftShadowMap
renderer.toneMappingExposure = 2

let loadingManager = null;
let loadedBarLengthPercent = 0
let loadingProcessFill = document.getElementById('loading-progress-fill')

loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = function(item, loaded, total){
    loadedBarLengthPercent = (loaded*489)/total
    loadingProcessFill.setAttribute('width', String(loadedBarLengthPercent))
};

loadingManager.onLoad = function(){
    const loadingScreen = document.getElementById( 'loading-screen' );
	loadingScreen.classList.add( 'fade-out' );
    animate()
};

const gltfLoader = new GLTFLoader(loadingManager);
const fbxLoader = new FBXLoader(loadingManager); 

environment.basicSceneAdd(scene)
objects.loadGallerySpaceCollision(gltfLoader, scene, fps.worldOctree)
objects.loadMoldeledObjects(fbxLoader, scene, fps.worldOctree)

function animate() {
    fps.cameraControl(camera)

    renderer.render( scene, camera );
    requestAnimationFrame( animate );

}