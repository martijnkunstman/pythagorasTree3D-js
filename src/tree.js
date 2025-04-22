import * as THREE from 'three';

export function addPythagorasTree(size = 2, depth = 4, branchScaleY = 0.7, branchRadius = 0.2) {
  const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

  const root = new THREE.Group();

  // Base geometry for a unit-height cylinder
  const baseGeometry = new THREE.CylinderGeometry(branchRadius, branchRadius, 1, 8);

  function addBranch(parent, size, depth, direction = new THREE.Vector3(0, 1, 0), scaleFactor = 1) {
    if (depth === 0) return;

    const length = size * branchScaleY * scaleFactor;

    // Create a group to handle rotation + position
    const branch = new THREE.Group();

    // Calculate rotation to match direction
    const up = new THREE.Vector3(0, 1, 0);
    const axis = new THREE.Vector3().crossVectors(up, direction).normalize();
    const angle = Math.acos(up.dot(direction.clone().normalize()));

    if (!isNaN(angle) && axis.lengthSq() > 0) {
      branch.quaternion.setFromAxisAngle(axis, angle);
    }

    // Position this group at the tip of the parent branch
    branch.position.copy(direction.clone().normalize().multiplyScalar(length));

    // Create and position the cylinder inside the group
    const cylinder = new THREE.Mesh(baseGeometry, material);
    cylinder.scale.set(1, length / 2, 1); // since height is centered, Y = half
    cylinder.position.y = length / 2;     // move it so bottom touches origin
    branch.add(cylinder);

    // Add this branch group to the parent
    parent.add(branch);

    // Recurse
    const newScale = scaleFactor * 0.7;

    const angleStep = (2 * Math.PI) / 3;
    const coneAngle = Math.PI / 4;

    for (let i = 0; i < 3; i++) {
      const theta = i * angleStep;
      const x = Math.cos(theta) * Math.sin(coneAngle);
      const z = Math.sin(theta) * Math.sin(coneAngle);
      const y = Math.cos(coneAngle);
      const dir = new THREE.Vector3(x, y, z).normalize();

      addBranch(branch, size, depth - 1, dir, newScale);
    }
  }

  // Start recursion from root, pointing up
  addBranch(root, size, depth, new THREE.Vector3(0, 1, 0), 1);

  return root;
}
