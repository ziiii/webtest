
//import * as THREE from 'three';
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';

//load the video 
let video = document.getElementById('video');
let videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;

const movieMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    side: THREE.FrontSide,
    toneMapped: false,
})


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


const loader = new GLTFLoader();
loader.load('asset/Scaniverse 2024-04-10 171624/result.gltf', function (gltf) {

    scene.add(gltf.scene);
    gltf.scene.scale.set(100, 100, 100);
    gltf.scene.position.set(50, -200, 100);
    gltf.scene.rotation.y = Math.PI / 10;
    console.log(gltf);
    playTimeline();

}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "%");
}, function (error) {
    console.error('An error occurred:', error);

});


// Add a reactive box to the wall
const geometry = new THREE.BoxGeometry(10, 80, 140);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });


function createMesh(x, y, z, name) {
    const mesh = new THREE.Mesh(geometry, material.clone());
    mesh.position.set(x, y, z);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}
//Add clickable boxes

// const wallBox = new THREE.Group();
// wallBox.add(createMesh(-95, 10, 500, 'screen1'));
// scene.add(wallBox);


//add NON clickable screen
const screenAuto = new THREE.Mesh( geometry, movieMaterial ); 
screenAuto.position.set(-95, 10, 500);
scene.add(screenAuto);

//MARK THE POSITION OF THE LIGHT
const markgeometry = new THREE.SphereGeometry(40, 40, 40);

function createMark(x, y, z, name) {
    const mesh = new THREE.Mesh(markgeometry, material.clone());
    mesh.position.set(x, y, z);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

const lightmark = new THREE.Group();




//ADD lighting
const topLight = new THREE.SpotLight(0xffffff, 5); // (color, intensity)
topLight.position.set(600, 900, 2000) //top-left-ish
topLight.castShadow = true;
//scene.add(topLight);
lightmark.add(createMark(600, 900, 2000, 'TOPlight'));


const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
ambientLight.position.set(30, 20, 500);
scene.add(ambientLight);
lightmark.add(createMark(30, 20, 500, 'Ambientlight'));

//scene.add(lightmark); //SHOW LIGHT POSITION


//Orbitcontrols

//  const controls = new OrbitControls( camera, renderer.domElement );
// camera.position.set(40,-40, 850 );
// controls.update();




//raycasting: CLICK AND CHANGE
const raycaster = new THREE.Raycaster();
document.addEventListener('mousedown', onMouseDown);
function onMouseDown(event) {

    const coords = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
    );

    raycaster.setFromCamera(coords, camera);
    //const intersections=raycaster.intersectObjects(scene.children,true);
    const intersections = raycaster.intersectObjects(wallBox.children, true);
    if (intersections.length > 0) {
        const selectedObject = intersections[0].object;
        const color = new THREE.Color(Math.random(), Math.random, Math.random());
        // selectedObject.material.color=color;
        selectedObject.material = movieMaterial;
        video.play();
        console.log(selectedObject.name);
    }
}


//ANIMATE
function animate() {
    requestAnimationFrame(animate);
    //controls.update();

    videoTexture.needsUpdate = true;
    renderer.render(scene, camera);
}
animate();

//NON-TIMELINE animation, combined movement，z,y同时移动

// window.addEventListener('mousedown',function(){
//     gsap.to(camera.position,{
//         z:100,
//         duration:2.5
//         // onUpdate:function(){
//         //     camera.lookAt(-40,40,1000);
//         // }
//     });
//     gsap.to(camera.position,{
//         y:100,
//         duration:2.5
//         // onUpdate:function(){
//         //     camera.lookAt(-40,40,1000);
//         // }
//     });

// });


//TIMELINE animation 一个完了再另一个
const tl = gsap.timeline();
//  window.addEventListener('mousedown', function () {

 function playTimeline(){

    tl.to(camera.position, {
        z: 100,
        duration: 3
    })
    

        .to(camera.rotation, {
         
            y:1.57,
            duration: 2.5
            // onUpdate: function () {
            //     camera.lookAt(-40, 40,0);
            // }
        })


        .to(camera.position, {
         
            z:500,
            duration: 2.5
            // onUpdate: function () {
            //     camera.lookAt(-40, 40,0);
            // }
        })
        .to(camera.position, {
         
            x:80,
            duration: 2
          
            // onUpdate: function () {
            //     camera.lookAt(-40, 40,0);
            // }
        });

        video.play();

// });
     }




// //SCROLL TRIGGER
// let tl=gsap.timeline({
//         scrollTrigger:{
//             trigger:'.animated-element',
//             start:'top center',
//             end:'bottom center',
//             scrub:true,
//             markers:true
//         }
// })
// tl.to('.animated-element',{
//     x:800
// });


//     //SMOOTH SCROLL
// const lenis = new Lenis();
// lenis.on('scroll', (e) => {
//   console.log(e)
// });

// function raf(time) {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// }

// requestAnimationFrame(raf);