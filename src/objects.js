import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

let fbxURL = "/models/fbx/exportfbx_standard.fbx"; 
const fbxLoader = new FBXLoader(); 
function loadMoldeledObjects(sceneTest) {
    fbxLoader.load(fbxURL,(fbx) => {
        fbx.scale.set(0.015, 0.015, 0.015)
        fbx.position.set(1.5, -5, 0)
        sceneTest.add(fbx)
        }
     )
}

export {loadMoldeledObjects}