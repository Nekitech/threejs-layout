import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';

function waves(plane, time, a, p, q) {
    const numVertex = plane.geometry.attributes.position.array.length;

    for(let i = -1; i < numVertex; i+=3) {
        const coord = {
            x: plane.geometry.attributes.position.array[i-2],
            y: plane.geometry.attributes.position.array[i-1],
        }
        // plane.geometry.attributes.position.array[i] = a * Math.sin(p * coord.x + time)
        // plane.geometry.attributes.position.array[i] = a * Math.sin(p * coord.x + time) + a * Math.sin(p * coord.y + time)
        plane.geometry.attributes.position.array[i] = new ImprovedNoise().noise(coord.x/q, coord.y/q, time)

    }
    plane.geometry.attributes.position.needsUpdate = true

}

// texture water

const waterTexture = new THREE.TextureLoader().load('public/img/lava.png')
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
// waterTexture.repeat.set( 20, 20);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(devicePixelRatio)
renderer.setClearColor(0xffffff, 1);

document.body.appendChild( renderer.domElement );
//
const orbit = new OrbitControls(camera, renderer.domElement)
orbit.update()

// Initial plane
const planeGeometry = new THREE.PlaneGeometry(50, 50, 20, 20);

const materialPlaneSin = new THREE.MeshBasicMaterial({
    // color: 0x285ca8,
    color: 0x000000,
    wireframe: true,
    flatShading: THREE.FlatShading,
    // map: waterTexture,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, materialPlaneSin)
scene.add( plane );

const clock = new THREE.Clock()

plane.rotation.x = -1.2
camera.position.z = 5;

const light = new THREE.DirectionalLight(
    0xffffff, 1
)
light.position.set(0, 0, 3)
scene.add(light)

function animate() {
    const time = clock.getElapsedTime()
    plane.position.x += 0.001
    waves(plane, time / 5, 0.5, 0.2, 6)

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

animate();