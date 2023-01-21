import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import * as dat from '/dat.gui/build/dat.gui.module.js'


const gui = new dat.GUI()
const configGUI = {
    plane: {
        width: 10
    }

}
gui.add(configGUI.plane, 'width', 1, 20).
onChange(() => {
    // plane.geometry.dispose()
    // plane.geomerty = new THREE.
    // PlaneGeometry(configGUI.plane.width, 10, 50, 50)
    // console.log(plane.geometry)
    // generationVertexPlane(plane, 2, 30)
})


// Random generation vertex
const generationVertexPlane  = function (ourPlane, maxRandom = 2, heightVertex = 4)  {
    const numVertex = ourPlane.geometry.attributes.position.array.length
    for(let i = -1; i < numVertex; i+=3) {
        if(Math.floor(Math.random() * maxRandom) === 0){
            ourPlane.geometry.attributes.position.array[i] = Math.random() / heightVertex || 0;
        }
    }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild( renderer.domElement );

const orbit = new OrbitControls(camera, renderer.domElement)
orbit.update()


// Initial plane
const planeGeometry = new THREE.PlaneGeometry(10, 10, 50, 50);
const materialPlane = new THREE.MeshPhongMaterial({
    // color: 0xebda42,
    side: THREE.DoubleSide,
    wireframe: false,
    flatShading: THREE.FlatShading,
    vertexColors: true
});
const materialPlaneSin = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
})
const plane = new THREE.Mesh(planeGeometry, materialPlaneSin)
scene.add( plane );
plane.rotation.x = -1.2
plane.rotation.z = 0.5

generationVertexPlane(plane, 2, 0)


const light = new THREE.DirectionalLight(
    0xffffff, 1
)
light.position.set(0, 0, 1)
scene.add(light)

let raycaster = new THREE.Raycaster();
let mouse = {
    x: undefined,
    y: undefined
}

function onMouseMove(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

const colors = []
const RGBConst = 255
const rgbHover = {
    r: 232 / RGBConst,
    g: 126 / RGBConst,
    b: 12 / RGBConst
}
const rgbPlane = {
    r: 186 / RGBConst,
    g: 133 / RGBConst,
    b: 26 / RGBConst
}
for (let i = 0; i < plane.geometry.attributes.position.count; i++) {
    colors.push(rgbPlane.r, rgbPlane.g, rgbPlane.b)
}

// Add colors for vertex
plane.geometry.setAttribute('color',
    new THREE.BufferAttribute(new Float32Array(colors), 3))

camera.position.z = 7;

function animate() {
    plane.rotation.z += 0.001;
    const intersects = raycaster.intersectObject(plane);
    if (intersects.length > 0) {
        //vertex 1
        intersects[0].object.geometry.attributes.color.setXYZ(intersects[0].face.a,
            rgbHover.r, rgbHover.g, rgbHover.b)
        //vertex 2
        intersects[0].object.geometry.attributes.color.setXYZ(intersects[0].face.b,
            rgbHover.r, rgbHover.g, rgbHover.b)
        //vertex 3
        intersects[0].object.geometry.attributes.color.setXYZ(intersects[0].face.c,
            rgbHover.r, rgbHover.g, rgbHover.b)

        //very interesting effect
        // intersects[0].object.geometry.attributes.color.setX(intersects[0].face.a, 1)
        // intersects[0].object.geometry.attributes.color.setY(intersects[0].face.b, 1)
        // intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.c, 0)

        setTimeout(() => {
            //vertex 1
            intersects[0].object.geometry.attributes.color.setXYZ(intersects[0].face.a,
                rgbPlane.r, rgbPlane.g, rgbPlane.b)
            //vertex 2
            intersects[0].object.geometry.attributes.color.setXYZ(intersects[0].face.b,
                rgbPlane.r, rgbPlane.g, rgbPlane.b)
            //vertex 3
            intersects[0].object.geometry.attributes.color.setXYZ(intersects[0].face.c,
                rgbPlane.r, rgbPlane.g, rgbPlane.b)
        }, 800)

        intersects[0].object.geometry.attributes.color.needsUpdate = true
    }

    raycaster.setFromCamera(mouse, camera)

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

animate();

window.addEventListener('mousemove', onMouseMove);