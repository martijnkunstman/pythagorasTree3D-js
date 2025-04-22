// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// Utility to create a cylinder between two points
function createBranch(start, end, startRadius = 0.1, endRadius = 0.05, color = 0x00ff00) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const cylinder = new THREE.CylinderGeometry(endRadius, startRadius, length, 32);

  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(cylinder, material);

  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  mesh.position.copy(midpoint);

  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );

  return mesh;
}

function generateTree(origin, direction, depth, angle, scale, thickness) {
  if (depth <= 0) return;

  const length = scale;
  const end = origin.clone().add(direction.clone().normalize().multiplyScalar(length));

  const branch = createBranch(origin, end, thickness, thickness * 0.7);
  scene.add(branch);

  const basis = direction.clone().normalize();

  // Use fixed equally spaced directions in spherical coordinates
  const childDirections = [
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(-0.5, 1, Math.sqrt(3) / 2),
    new THREE.Vector3(-0.5, 1, -Math.sqrt(3) / 2)
  ];

  childDirections.forEach(dir => {
    dir.normalize();
    const rotatedDir = dir.clone().applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), basis)
    );
    generateTree(end, rotatedDir, depth - 1, angle, scale * 0.7, thickness * 0.7);
  });
}

// Start Tree
const start = new THREE.Vector3(0, -10, 0);
const direction = new THREE.Vector3(0, 1, 0);
generateTree(start, direction, 9, Math.PI / 6, 8, 2);

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
