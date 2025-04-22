import * as THREE from 'three';

export function addPythagorasTree(
  size = 2,
  depth = 4,
  branchScaleY = 0.7,
  initialRadius = 0.2,
  taperFactor = 0.7
) {
  const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
  const root = new THREE.Group();

  const worldMatrix = new THREE.Matrix4();

  function addBranch(
    parent,
    size,
    depth,
    direction = new THREE.Vector3(0, 1, 0),
    scale = 1,
    radius = initialRadius
  ) {
    if (depth === 0) return;

    const length = size * branchScaleY * scale;

    // Create branch geometry and mesh
    const geometry = new THREE.CylinderGeometry(radius, radius, 1, 8);
    const cylinder = new THREE.Mesh(geometry, material);

    // Scale and position the cylinder so it starts from the base
    cylinder.scale.set(1, length / 2, 1);
    cylinder.position.y = length / 2;

    // Create branch group for rotation and positioning
    const branchGroup = new THREE.Group();
    branchGroup.add(cylinder);

    // Align branch group with the direction vector
    const up = new THREE.Vector3(0, 1, 0);
    const dir = direction.clone().normalize();
    const axis = new THREE.Vector3().crossVectors(up, dir).normalize();
    const angle = Math.acos(up.dot(dir));

    if (!isNaN(angle) && axis.lengthSq() > 0) {
      branchGroup.quaternion.setFromAxisAngle(axis, angle);
    }

    parent.add(branchGroup);

    // Compute the tip position of this branch in world space
    branchGroup.updateMatrixWorld(true); // ensure transforms are current
    const tip = new THREE.Vector3(0, length, 0); // local Y-up tip
    tip.applyMatrix4(branchGroup.matrixWorld);  // convert to world position

    // Create a group at the tip of the current branch
    const nextGroup = new THREE.Group();
    nextGroup.position.set(0, length, 0); // local Y-up, no world transform
    branchGroup.add(nextGroup); // Keep it in local space

    const nextScale = scale * 1;
    const nextRadius = radius * taperFactor;

    const angleStep = (2 * Math.PI) / 3;
    const coneAngle = Math.PI / 4;

    for (let i = 0; i < 3; i++) {
      const theta = i * angleStep;
      const x = Math.cos(theta) * Math.sin(coneAngle);
      const z = Math.sin(theta) * Math.sin(coneAngle);
      const y = Math.cos(coneAngle);
      const newDir = new THREE.Vector3(x, y, z);
      addBranch(nextGroup, size, depth - 1, newDir, nextScale, nextRadius);
    }
  }

  addBranch(root, size, depth);
  return root;
}
