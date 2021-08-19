import React, {useRef, useState} from 'react';
import {Canvas, useFrame} from 'react-three-fiber';
import {softShadows, MeshWobbleMaterial, OrbitControls} from 'drei'; 
import {useSpring, a} from 'react-spring/three';

import './App.scss';

softShadows();

const SpinningMesh = ({boxPosition, boxArgs, boxColor, boxSpeed}) => {
  const mesh = useRef(null);
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  //define state
  const [expand, setExpand] = useState(false);

  //create props & assign different property
  //changing scale this time
  const props = useSpring({
    //if it expands, change height, weidth, depth to 1.4
    //otherwise, its going to be a default
    scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1]
  });

  return (
    //1. a.mesh = turn it into animated component
    //2. onClick = add onClick event
      // on click, setExpend to opposit which is false 
    //3. scale = add scale and target into props
    <a.mesh 
      onClick={() => setExpand(!expand) } 
      scale={props.scale}
      castShadow 
      position={boxPosition} 
      ref={mesh}
    >
      <boxBufferGeometry attach='geometry' args={boxArgs} />
      <MeshWobbleMaterial 
        attach='material' 
        color={boxColor} 
        speed={boxSpeed}
        factor={0.6}
      />
    </a.mesh>
  )
}

function App() {

  return (
    <>
      <Canvas 
        shadowMap 
        colorManagement 
        camera={{position: [-5, 2, 10], fov: 60 }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight 
          castShadow
          position={[0, 10, 0]} 
          intensity={1.5} 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-10, 0, -20]} intensity={0.5} />
        <pointLight position={[0, -10, 0]} intensity={1.5} />

        <group>
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} >
            <planeBufferGeometry attach='geometry' args={[100, 100]} />
            <shadowMaterial attach='material' opacity={0.3} />
          </mesh>

          <SpinningMesh 
          boxPosition={[0, 1, 0]} 
          boxArgs={[3, 2, 1]}
          boxColor='lightblue'
          boxSpeed={2} 
          />
          <SpinningMesh boxPosition={[-2, 1, -5]} boxColor='pink' boxSpeed={6} />
          <SpinningMesh boxPosition={[5, 1, -2]} boxColor='pink' boxSpeed={6} />
        </group>

        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;