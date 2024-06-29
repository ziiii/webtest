
//import * as THREE from 'three';
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';

//load the video 
// let video = document.getElementById('video');
// let videoTexture = new THREE.VideoTexture(video);
// videoTexture.minFilter = THREE.LinearFilter;
// videoTexture.magFilter = THREE.LinearFilter;

// const movieMaterial = new THREE.MeshBasicMaterial({
//     map: videoTexture,
//     side: THREE.FrontSide,
//     toneMapped: false,
// })


const scene = new THREE.Scene();
const sizes = (window.innerWidth, window.innerHeight);
const near = 0.1;
const far = 3000;
const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, near, far);
camera.position.set(40, -40, 850);
scene.add(camera);


const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000); // Set backgroxsund color to black
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);


//load gallery
 const loader = new GLTFLoader();
// loader.load('asset/gallery_newscan/untitled.gltf', function (gltf) {
loader.load('asset/cleanedScan/newscan.gltf', function (gltf) {
    scanModel=gltf.scene;
    scene.add(gltf.scene);
    gltf.scene.scale.set(100, 100, 100);
    gltf.scene.position.set(20, -200, modelPosZ);
   gltf.scene.rotation.y = Math.PI /80;
    console.log(gltf);
   fadeOut(logoModel);

}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "%");
}, function (error) {
    console.error('An error occurred:', error);
});


//ADD lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
ambientLight.castShadow = true;
ambientLight.position.set(30, 20, 500);
scene.add(ambientLight);

//Orbitcontrols
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set(40,-40, 850 );
controls.update();




//ANIMATE
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

