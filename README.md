# Threejs fps view starter template

## You will be able to..
- create basic form of collision between space and camera
- use keydown event and mouse to move/rotate camera
- prevents users to move outside from wall without raycasting and uv detection
- both gltf and fbx works
- loading manager included and got simple loading screen/bar
- tick(animating) function added inside of the loading manager so animation starts when loading completed
- ... and lots of other stuff

## Should consider followings..
- you need to combine (calls **join** in blender world) entire scene
- complex models like chair cause delay to the camera movement
- at least one plane || model must loaded before the camera added to the scene
- be aware using shadow option to too many lights (it will cause performance issue)

## This starter references..
- three.js journey : webpack and basic settings
- [mrdoob's games_fps example](https://github.com/mrdoob/three.js/blob/master/examples/games_fps.html) : provides collision to space and camera
- [website of shim](https://hopju1.wixsite.com/shim) : provides model for the space

## How you can run the code..
- npm install
- npm run dev

### Other starter
- [basic starter](https://github.com/mirinteractive/threejs-template-basic.git)
- [mouse scroll starter](https://github.com/mirinteractive/threejs-templete-mousewheel.git)