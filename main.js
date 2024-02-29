import * as THREE from 'https://threejs.org/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

let initialVelocityMagnitude = 5; // units/s
let acceleration = -9.8; // m/s^2, gravity acceleration
let airResistanceCoefficient = 0; // Dimensionless, affects velocity linearly
let angle = 45; // degrees
let velocity = new THREE.Vector2(); // Velocity vector
let position = new THREE.Vector2(); // Position vector, 2D for simplicity
let gravityEnabled = false;

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const lineGeometry = new THREE.BufferGeometry();
const points = [];
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

// Convert angle and magnitude to velocity vector
function updateInitialVelocity() {
    let radianAngle = angle * Math.PI / 180;
    velocity.x = initialVelocityMagnitude * Math.cos(radianAngle);
    velocity.y = initialVelocityMagnitude * Math.sin(radianAngle);
}

document.getElementById('velocity').addEventListener('input', function(event) {
    initialVelocityMagnitude = parseFloat(event.target.value);
    document.getElementById('velocityValue').innerText = event.target.value;
    updateInitialVelocity();
    resetSimulation();
});

document.getElementById('angle').addEventListener('input', function(event) {
    angle = parseFloat(event.target.value);
    document.getElementById('angleValue').innerText = angle;
    updateInitialVelocity();
    resetSimulation();
});

document.getElementById('gravity').addEventListener('change', function(event) {
    gravityEnabled = event.target.checked;
    resetSimulation();
});

document.getElementById('airResistance').addEventListener('input', function(event) {
    airResistanceCoefficient = parseFloat(event.target.value);
    document.getElementById('airResistanceValue').innerText = event.target.value;
    resetSimulation();
});

function resetSimulation() {
    position.set(0, 0);
    cube.position.set(0, 0, 0);
    points.length = 0;
    lineGeometry.setFromPoints(points);
    updateInitialVelocity();
}

function animate(time) {
    time *= 0.001; // convert time to seconds
    const deltaTime = Math.min(0.02, time - (lastTime || time)); // Cap max deltaTime to avoid large jumps
    lastTime = time;

    // Apply gravity
    if (gravityEnabled) {
        velocity.y += acceleration * deltaTime;
    }

    // Apply air resistance
    velocity.x -= airResistanceCoefficient * velocity.x * deltaTime;
    velocity.y -= airResistanceCoefficient * velocity.y * deltaTime;

    // Update position
    position.x += velocity.x * deltaTime;
    position.y += velocity.y * deltaTime;

    // Prevent cube from going below the "ground"
    if (gravityEnabled && position.y < 0) {
        position.y = 0;
        velocity.y = 0; // Stop vertical motion once it hits the ground
    }

    cube.position.x = position.x;
    cube.position.y = position.y;

    // Add the new position to the points array and update the line geometry
    points.push(new THREE.Vector3(position.x, position.y, 0));
    lineGeometry.setFromPoints(points);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

let lastTime;
requestAnimationFrame(animate);
