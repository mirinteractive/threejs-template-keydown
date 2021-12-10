import * as THREE from 'three'
import CANNON from 'cannon';

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(0, 0.25, 0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05

const world = new CANNON.World();
world.gravity.set(0, - 9.82, 0);

const basicSceneAdd=(scene)=>{
  scene.add(ambientLight, directionalLight)
}

export { basicSceneAdd }