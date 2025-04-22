import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function createControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  return controls;
}
