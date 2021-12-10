# Basic form of collision between space and camera

## This starter mainly comes from..
- three.js journey : webpack and basic settings
- [mrdoob's games_fps example](https://github.com/mrdoob/three.js/blob/master/examples/games_fps.html) : provide collision to space and camera

## To make the collision works fine..
- both gltf and fbx works
- you need to combine (calls **join** in blender world) entire scene
- complex models like chair cause delay to the camera movement
- at least one plane || model must loaded before the camera added to the scene

#### It prevents users to move outside from wall without raycasting and uv detection