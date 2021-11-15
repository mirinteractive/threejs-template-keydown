import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const scene = new THREE.Scene();

const floorMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.4,
    color: '#FFF1D0', 
})
const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 50),floorMaterial)
floor.rotation.set(-Math.PI*0.5, 0, 0)
floor.position.set(0, -1, 0)

const testSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial()
) 

let fbxURL = "/models/fbx/exportfbx_standard.fbx"; 
const fbxLoader = new FBXLoader(); 
function loadMoldeledObjects(sceneTest) {
    fbxLoader.load(fbxURL,(fbx) => {
        fbx.scale.set(0.0015, 0.0015, 0.0015)
        fbx.position.set(1.5, -0.5, 0)
        fbx.rotation.set(0, Math.PI*0.5, 0)
        sceneTest.add(fbx)
        }
     )
}

const baseObjects = [floor]
const geometry = [testSphere]
export {geometry, baseObjects, loadMoldeledObjects}