import { scene, camera, renderer } from './scene.js';
import { createControls } from './controls.js';
import { addPythagorasTree } from './tree.js';

const controls = createControls(camera, renderer.domElement);

// 🔧 You control size, depth, and vertical scale of branches here
const size = 2;                 // base cube size
const depth = 5;                // recursion depth
const branchScaleY = 0.8;       // how long each branch is vertically

//const root = addPythagorasTree(size, depth, branchScaleY);
const root = addPythagorasTree(10, 5, 6); // tall narrow branches

scene.add(root);

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
