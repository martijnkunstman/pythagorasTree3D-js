import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// Lights
scene.add(new THREE.AmbientLight(0x404040));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

function addBranch(parent, size, depth) {
  if (depth === 0) return;

  const cube = new THREE.Mesh(cubeGeometry, material);
  cube.scale.set(size, size, size);
  cube.position.y = size / 2;
  parent.add(cube);

  const group = new THREE.Group();
  group.position.y = size;
  parent.add(group);

  const scale = 0.7;

  const directions = [
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(-1, 1, 0),
    new THREE.Vector3(0, 1, 1),
    new THREE.Vector3(0, 1, -1),
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(-1, 1, -1),
  ];

  for (let dir of directions) {
    const branch = new THREE.Group();

    const axis = new THREE.Vector3(0, 1, 0).cross(dir).normalize();
    const angle = Math.acos(new THREE.Vector3(0, 1, 0).dot(dir.clone().normalize()));

    if (!isNaN(angle)) {
      branch.quaternion.setFromAxisAngle(axis, angle);
    }

    branch.scale.set(scale, scale, scale);
    group.add(branch);

    addBranch(branch, size, depth - 1);
  }
}

const root = new THREE.Group();
scene.add(root);
addBranch(root, 2, 4);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
