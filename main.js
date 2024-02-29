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

let initialVelocity = 5; // units/s
let acceleration = 0.1; // units/s^2, assuming downward acceleration like gravity
let positionX = 0; // units
let positionY = 0; // units, added for vertical movement
let lastTime = 0; // seconds
let angle = 45; // Initial angle in degrees
let radianAngle = angle * Math.PI / 180; // Convert angle to radians

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const lineGeometry = new THREE.BufferGeometry();
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);
const points = [];

document.getElementById('velocity').addEventListener('input', function(event) {
    initialVelocity = parseFloat(event.target.value);
    document.getElementById('velocityValue').innerText = event.target.value;
    resetSimulation();
});

document.getElementById('angle').addEventListener('input', function(event) {
    angle = parseFloat(event.target.value);
    radianAngle = angle * Math.PI / 180; // Update radian angle
    document.getElementById('angleValue').innerText = angle;
    resetSimulation();
});

function resetSimulation() {
    positionX = 0;
    positionY = 0;
    cube.position.set(0, 0, 0);
    lastTime = performance.now() * 0.001; // Reset the time
    // Clear the points array and update the line geometry
    points.length = 0;
    lineGeometry.setFromPoints(points);
}

function animate(now) {
    now *= 0.001; // convert time to seconds
    const deltaTime = now - lastTime;
    lastTime = now;

    const velocityX = initialVelocity * Math.cos(radianAngle);
    const velocityY = initialVelocity * Math.sin(radianAngle) - acceleration * deltaTime;

    positionX += velocityX * deltaTime;
    positionY = Math.max(0, positionY + velocityY * deltaTime); // Prevent cube from going below the "ground"

    cube.position.x = positionX;
    cube.position.y = positionY;

    // Add the new position to the points array and update the line geometry
    points.push(cube.position.clone());
    lineGeometry.setFromPoints(points);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

requestAnimationFrame(animate);
