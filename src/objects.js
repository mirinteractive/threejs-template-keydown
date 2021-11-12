import * as THREE from 'three'

const testSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial()
) 

const geometry = [testSphere]
export {geometry}