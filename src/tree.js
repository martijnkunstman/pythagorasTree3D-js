import * as THREE from 'three';

export function addPythagorasTree(size = 2, depth = 4, branchScaleY = 0.7) {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

  const root = new THREE.Group();

  function addBranch(parent, size, depth) {
    if (depth === 0) return;

    const cube = new THREE.Mesh(cubeGeometry, material);
    cube.scale.set(size, size * branchScaleY, size); // ✨ adjust Y scale
    cube.position.y = (size * branchScaleY) / 2;
    parent.add(cube);

    const group = new THREE.Group();
    group.position.y = size * branchScaleY;
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

      branch.scale.set(scale, scale, scale); // same scale for now
      group.add(branch);

      addBranch(branch, size, depth - 1); // branch length managed at cube level
    }
  }

  addBranch(root, size, depth);
  return root;
}
