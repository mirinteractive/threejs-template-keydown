import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

let fbxURL = "/models/fbx/sample.fbx"; 
const fbxLoader = new FBXLoader(); 
function loadMoldeledObjects(scene, worldOctree) {
    fbxLoader.load(fbxURL,(fbx) => {
        fbx.scale.set(0.01, 0.01, 0.01)
        fbx.position.set(0,-1,23)
        fbx.rotation.set(0, Math.PI*0.5, 0)
        scene.add(fbx)

        worldOctree.fromGraphNode( fbx );
        fbx.traverse( child => {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
    
                if ( child.material.map ) {
                    child.material.map.anisotropy = 8;
                }
            }
        });
        }
     )
}

export {loadMoldeledObjects}