import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import nebula from '../img/nebula.jpg'
import stars from '../img/stars.jpg'


// * 0 create a renderer
const renderer = new THREE.WebGLRenderer();
// ? enable shadow map, off by default
// ? Every shadow in three.js has a different camera that is used to render the shadow, directional light uses orthographic camera to render the shadows
// TODO We need to manually set if the object will cast or receive shadows
renderer.shadowMap.enabled = true;

// ? We can change the color of the background This will change to solid color
// renderer.setClearColor( 0xFFEA00 );


// * set the size of the renderer
renderer.setSize( window.innerWidth, window.innerHeight );
// * add the renderer to the body of the html document
document.body.appendChild(renderer.domElement );

// * 1 create a scene
const scene = new THREE.Scene();

// ? To use an asset in three js we have to load it first
// ? If we want to load an image we need to use texture loader
const textureLoader = new THREE.TextureLoader();
// * Then we add that background to the scene
// scene.background = textureLoader.load(nebula);
// * background looks 2d now, but since the scene is just a cube with 6 sides, we can add a texture of backgroud to each side of the cube
// * for that we need to use another loader which is the cube texture loader
const cubeTextureLoader = new THREE.CubeTextureLoader();
// * we pass an array of 6 images to the loader
scene.background = cubeTextureLoader.load([
    nebula,
    nebula,
    nebula,
    nebula,
    nebula,
    nebula
]);


// * 2 create a camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

// * 3 add orbit controls
const orbit = new OrbitControls( camera, renderer.domElement );

// * 3 add axex helper
const axesHelper = new THREE.AxesHelper( 5 ); // ? 5 is the size of the axis
// * add it to the scene
scene.add( axesHelper );
// * move camera up
camera.position.set(20, 20, 20);
// ! call the update method every time the camera position changes
orbit.update();

// * 4 Add a box to the scene
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const box = new THREE.Mesh( boxGeometry, boxMaterial );
scene.add( box );

// * create a box with a image as a texture
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);  // ? define the geometry
// const box2Material = new THREE.MeshBasicMaterial({color: 0x00FF00, map: textureLoader.load(nebula)});  // ?  define the basic material, load the texture
const box2Material = new THREE.MeshBasicMaterial({});  // ! we can also load the texture later
// ? What if we want every side of the box to have different texture?
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
];

                                            // ! <-- pass the material inside
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial); //box2Material); // ? create a mesh texture
scene.add(box2) // ? add the mesh to the scene
box2.position.set(5, 5, 0) // ? move the box to the right
// box2.material.map = textureLoader.load(nebula) // ! load the texture

// ! We have the ability to change the shape of a mesh by updating the position of the points that make up geometry of that mesh
const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10); //? Create a 10x10 plane
const plane2Material = new THREE.MeshBasicMaterial({  // ? Create a material
    color: 0xFFFFFF,
    wireframe: true
})
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material); // ? Combine geometry and material to create a final product, mesh
scene.add(plane2); // ? Add the mesh to the scene
plane2.position.set(10, 10, 15) // ? Move the plane up and to the right


//! The position of all the points that form the geometry of a mesh are located in an array in a geometry.attributes position property
// ! Each set of the 3 values starting from the first point of the array  xyz, xyz, xyz, xyz, xyz, .....
// ? This will change the position of the first point of the plane
plane2.geometry.attributes.position.array[0] -= 10 * Math.random();   // ?Here we subtract from the initial position
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();

plane2.geometry.attributes.position.array[3] -= 10 * Math.random(); // ? This will change the position of the second point x of the plane

const lastPointZ = plane2.geometry.attributes.position.array.length - 1; // ? Get the last point of the plane
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random(); // ? Change the z position of the last point of the plane
//! Animation means changing position of these points over time
// ! Lets copy all this login into animate function and call it every frame



// ! basic material does not react to light

// * 5 Add a sphere to the scene
const sphereGeometry = new THREE.SphereGeometry(4, 10, 10);
const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xffff00, wireframe: true } );
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
scene.add( sphere );
sphere.position.set(-5, 5, 0)
// TODO Set the sphere to cast shadows on the plane
sphere.castShadow = true;

// ? Add a ambient light   // ? ambient light is a light that is everywhere
const ambientLight = new THREE.AmbientLight( 0x333333 );
scene.add( ambientLight );
// ? Add a directional light  // ? directional light is a light that is coming from a specific direction
//* const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
//* scene.add( directionalLight );
//* directionalLight.position.set( -30, 50, 0 );
//* // TODO Set the directional light to start casting shadows
//* directionalLight.castShadow = true;
//* // ? Shadow helper showed us that we need to move our shadow camera down for the sphere to cast its full shadow on the plane
//* directionalLight.shadow.camera.bottom = -12

//* // ? Directional light has a helper class that helps you work with it
//* // ? Directional helper is a square that shows the direction of the light
//* const dLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5 ); // ? 5 is the size of the helper
//* scene.add( dLightHelper );

//* // ? We also have shadow helpers that help us visualize where the shadows will be casted
//* const dLightShadowHelper = new THREE.CameraHelper( directionalLight.shadow.camera ); // * takes the shadow camera of the directional light as an argument
//* scene.add( dLightShadowHelper );

// ? Add a spot light // ? spot light is a light that is coming from a specific direction and is focused on a specific point

const spotLight = new THREE.SpotLight( 0xffffff );
scene.add( spotLight );
// TODO change the position of the spot light
spotLight.position.set( -100, 100, 0 );
// TODO create a spotlight helper to help us visualize the light
const sLightHelper = new THREE.SpotLightHelper( spotLight );
scene.add( sLightHelper );
// TODO Set the spot light to start casting shadows
spotLight.castShadow = true;
// TODO narrow the lights angle otherwise the shadow is pixelated
spotLight.angle = 0.05;

// * method 1) We can create a fog effect by adding a fog to the scene
// scene.fog = new THREE.Fog( 0xFFFFFF, 0, 200 );  //! Notice the syntax here, we are not creating a new instance of the fog class, we are setting the fog property of the scene to a new instance of the fog class
// * method 2) This time fog grows exponentially with distance from the camera
scene.fog = new THREE.FogExp2( 0xFFFFFF, 0.01 ); 

// * Add A plane to the scene
const planeGeometry = new THREE.PlaneGeometry( 30, 30 );
const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
scene.add( plane );
plane.rotation.x = - Math.PI / 2;  // ? rotate the plane 90 degrees to match the grid
// TODO Set the plane to receive shadows casted by the sphere
plane.receiveShadow = true;

// * Add a grid helper
const gridHelper = new THREE.GridHelper(30);
scene.add( gridHelper );

// * Add a gui
const gui = new dat.GUI();
// ? 1 Set the default values
const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.05, //? spot light 
    penumbra: 0, //? spot light blurs the edges out
    intensity: 1, //? spot light 
}

// ? 2 Add the options to the gui and set the max and minimum values
gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
})

gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
})

gui.add(options, 'speed', 0, 0.1)

gui.add(options, 'angle', 0, 1)
gui.add(options, 'penumbra', 0, 1)
gui.add(options, 'intensity', 0, 1)

// * make the sphere bounce
let step = 0;

// ? Interact with the objects using mouse, three.js uses raycaster to detect the objects, raycaster has a source and a destination, every element that the raycaster goes thru is registered as an intersection
// ? In case we want to interact with the mouse, we need to set camera as the source and mouse as the destination

// * 1 Create a 2d vector that will hold the mouse position
const mousePosition = new THREE.Vector2();
// * 2 Add an event listener that will update the mouse position on mouse move
window.addEventListener('mousemove', function(e){
    // * 3 set the mousePosition to the normalized mouse position
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

// * 4 Create a raycaster
const rayCaster = new THREE.Raycaster();
// TODO 5 in the animate function we call setFromCamera function on mousePosition and camera


// ? Get only the sphere by id
const sphereId = sphere.id;


// ? We can set names to the elements
box2.name = 'theBox';


// ? there are 2 methods to add vertex and fragment shaders in three js.

// ? vertex shader code, more advanced topic that we will cover later
// const vShader = `
//     void main() {
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
// `;

// // ? fragment shader code, more advanced topic that we will cover later
// const fShader = `
//     void main() {
//         gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
//     }
// `;


// ! importing 3D models from blender / spline etc. needs to be in gltf format
const textUrl = new URL('../assets/text.gltf', import.meta.url);
const assetLoader = new GLTFLoader();

// ! load it in and add it to the scene like a normal mesh
assetLoader.load(textUrl.href, function(gltf){
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-12, 4, 10);
}, undefined, function(error){  // ? undefined is a function that will be called if error occurs
    console.error(error);
})




// * Create a geometry
const sphere2Geometry = new THREE.SphereGeometry(5);
// * Create a shader material that takes 2 values, vertex and fragment shader
const sphere2Material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
})
// * Create a mesh
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
// * Add the mesh to the scene
scene.add(sphere2);
// * Set the position of the sphere
sphere2.position.set(-5, 10, 10);


// ? function animate
function animate(time) {
    // * rotate the box
    box.rotation.x += time / 100000;
    box.rotation.y += time / 10000000;
    // * bounce the sphere
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));
    // ? Register options on the animation loop
    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    // ! every time we change the values of the lights properties we need to call the update method
    sLightHelper.update();

    // TODO 5 in the animate function we call setFromCamera function on mousePosition and camera
    rayCaster.setFromCamera( mousePosition, camera );
    // * 6 create an array that will hold the intersections
    const intersects = rayCaster.intersectObjects(scene.children); // * scene.children is an array that holds all the objects in the scene
    console.log(intersects);
    // ? Returns object with some properties
        // ? 1st property is the mesh that we intersected
    // ? This is not very usefull since we are returning a bunch of objects, lets say we want to get only the sphere
    // ? *****Three js gives the id to each element that is rendered on the scene, so we can use that to check if we are intersecting only on the element with given id.

    // * Now we loop over interesects and if the id of the object is the same as the id of the sphere we change the color of the sphere

    for (let i = 0; i < intersects.length; i++) {
        if(intersects[i].object.id === sphereId){   //! We can use either id provided by three js
            intersects[i].object.material.color.set(0xFF0000);
        }

        if(intersects[i].object.name === 'theBox'){ //! Or we can use the name that we set to the object
            intersects[i].object.rotation.x += time / 1000;
            intersects[i].object.rotation.y += time / 10000000;
        }

    }

    plane2.geometry.attributes.position.array[0] = 10 * Math.random(); // ? Here we set the position to new value
    plane2.geometry.attributes.position.array[1] = 10 * Math.random();
    plane2.geometry.attributes.position.array[2] = 10 * Math.random();
    plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random(); // ? Change the z position of the last point of the plane
    plane2.geometry.attributes.position.needsUpdate = true; // !! We need to set this to true so that the changes are applied

    // * 5 link camera to scene
    renderer.render(scene, camera);
}

// * 6 call animate function
renderer.setAnimationLoop( animate );

// * make the canvas resizable

window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();  // ! needs to be called every time we update the camera
    renderer.setSize(window.innerWidth, window.innerHeight);
})