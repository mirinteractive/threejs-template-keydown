const collisionURL = "/models/gltf/220112/220112_01_export.gltf";
const cylinderURL = "models/fbx/cylinder.fbx"; 

const updateAllMaterials = (scene) =>{
    scene.traverse((child) =>{
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
            if ( child.material.map ) {
                child.material.map.anisotropy = 8;
            }
        }
    })
}

const loadGallerySpaceCollision=(gltfLoader, scene, worldOctree)=>{
    gltfLoader.load( collisionURL, ( gltf ) => {
        gltf.scene.position.set(10, -3, -3)
        scene.add( gltf.scene );
        worldOctree.fromGraphNode( gltf.scene );
        updateAllMaterials(scene)
    });
}

function loadMoldeledObjects(fbxLoader, scene, worldOctree) {
    fbxLoader.load(cylinderURL,(fbx) => {
        fbx.scale.set(0.01, 0.01, 0.01)
        fbx.position.set(-15.1, -3, -23.74)
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

export {loadGallerySpaceCollision, loadMoldeledObjects}