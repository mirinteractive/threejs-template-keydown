import * as THREE from 'three'

const ambientlight = new THREE.AmbientLight( '#ffffff', 0.05 );

const directionalLight = new THREE.DirectionalLight( '#ffffff', 5 );
directionalLight.position.set(0, 11, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.01;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.left = - 30;
directionalLight.shadow.camera.top	= 30;
directionalLight.shadow.camera.bottom = - 30;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.radius = 4;
directionalLight.shadow.bias = - 0.00006;

const pointLight1 = new THREE.PointLight('#ffffff', 1.2)
pointLight1.position.set(-7.7, 1.3, 13.1)
pointLight1.castShadow = true
pointLight1.shadow.normalBias = 0.04

const pointLight2 = new THREE.PointLight('#ffffff', 1.2)
pointLight2.position.set(-7.7, 1.3, -13.1)
pointLight2.castShadow = true
pointLight2.shadow.normalBias = 0.04

const basicSceneAdd=(scene)=>{
    scene.add(ambientlight, directionalLight,
        pointLight1, pointLight2
    )
}
export { basicSceneAdd }