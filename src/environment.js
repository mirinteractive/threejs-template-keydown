import * as THREE from 'three'

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(0, 0.25, 0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05

const planeSample = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({color: '#dfe3ee'}))
planeSample.rotation.set(-Math.PI*0.5, 0, 0)
planeSample.position.set(0, -2, 0)

const base = [ambientLight, directionalLight]
const floor = [planeSample]

export { base, floor }