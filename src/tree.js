import * as THREE from 'three';

export function addPythagorasTree(size = 2, depth = 4, branchScaleY = 0.7) {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

  const root = new THREE.Group();

  function addBranch(parent, size, depth) {
    if (depth === 0) return;

    const cube = new THREE.Mesh(cubeGeometry, material);
    cube.scale.set(size, size * branchScaleY, size);
    cube.position.y = (size * branchScaleY) / 2;
    parent.add(cube);

    const group = new THREE.Group();
    group.position.y = size * branchScaleY;
    parent.add(group);

    const scale = 0.7;

    // Generate 3 evenly spaced directions in 3D (like points on a cone)
    const directions = [];
    const angleStep = (2 * Math.PI) / 3; // 120 degrees between each
    const coneAngle = Math.PI / 4; // angle from vertical (Y axis)

    for (let i = 0; i < 3; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * Math.sin(coneAngle);
      const z = Math.sin(angle) * Math.sin(coneAngle);
      const y = Math.cos(coneAngle);
      directions.push(new THREE.Vector3(x, y, z));
    }

    for (let dir of directions) {
      const branch = new THREE.Group();

      const normalizedDir = dir.clone().normalize();
      const axis = new THREE.Vector3(0, 1, 0).cross(normalizedDir).normalize();
      const angle = Math.acos(new THREE.Vector3(0, 1, 0).dot(normalizedDir));

      if (!isNaN(angle)) {
        branch.quaternion.setFromAxisAngle(axis, angle);
      }

      branch.scale.set(scale, scale, scale);
      group.add(branch);

      addBranch(branch, size, depth - 1); // recurse
    }
  }

  addBranch(root, size, depth);
  return root;
}
