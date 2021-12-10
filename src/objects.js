import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

let fbxURL = "/models/fbx/sample.fbx"; 
const fbxLoader = new FBXLoader(); 
function loadMoldeledObjects(sceneTest) {
    fbxLoader.load(fbxURL,(fbx) => {
        fbx.scale.set(0.01, 0.01, 0.01)
        fbx.position.set(0,-1,23)
        fbx.rotation.set(0, Math.PI*0.5, 0)
        sceneTest.add(fbx)
        }
     )
}

export {loadMoldeledObjects}