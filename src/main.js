import { scene, camera, renderer } from './scene.js';
import { createControls } from './controls.js';
import { addPythagorasTree } from './tree.js';

const size = 10;
const depth = 5;
const branchScaleY = 0.9;

const root = addPythagorasTree(size, depth, branchScaleY);
scene.add(root);

// Calculate approximate height of tree
const totalHeight = size * branchScaleY * Math.pow(0.7, 0) * depth;

// Center the tree
root.position.y = 0;

// Set camera far enough to see the whole tree
camera.position.set(0, totalHeight * 0.5, totalHeight * 2);
camera.lookAt(0, totalHeight * 0.5, 0);

// Orbit controls
const controls = createControls(camera, renderer.domElement);
controls.target.set(0, totalHeight * 0.5, 0); // center orbit around tree
controls.update();

// Animate
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
