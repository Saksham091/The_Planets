import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// Setup scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector(".about canvas"),
    antialias: true,
});

// Configure renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const loader = new RGBELoader();
loader.load("https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonlit_golf_1k.hdr",
    function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
    }
);

// Add star background
const starTexture = new THREE.TextureLoader().load('./stars.jpg');
starTexture.colorSpace = THREE.SRGBColorSpace;

const starGeometry = new THREE.SphereGeometry(50, 64, 64);
const starMaterial = new THREE.MeshStandardMaterial({
    map: starTexture,
    side: THREE.BackSide
});
const starSphere = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starSphere);

// Create Earth sphere
const radius = 1.2;
const segments = 64;
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./earth/map.jpg");
texture.colorSpace = THREE.SRGBColorSpace;

const geometry = new THREE.SphereGeometry(radius, segments, segments);
const material = new THREE.MeshStandardMaterial({ map: texture });
const earth = new THREE.Mesh(geometry, material);

// Position earth on the left side
earth.position.x = -3;
earth.position.y = -0.3;

scene.add(earth);

camera.position.z = 10;


// Animation loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y = clock.getElapsedTime() * 0.1;
    renderer.render(scene, camera);
}
animate();  

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});