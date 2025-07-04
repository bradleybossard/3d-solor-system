
import './style.css'
/*
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
*/

        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x333333); // Softer ambient light
        scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xffffff, 3, 2000); // Stronger point light
        sunLight.castShadow = true; // Enable shadows for the sun
        scene.add(sunLight);
        
        // Configure shadow properties for the renderer
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows

        // Orbit Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 10;
        controls.maxDistance = 1000;
        controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera from going below ground

        // Sun
        const sunGeometry = new THREE.SphereGeometry(5, 64, 64); // Increased segments for smoother sphere
        const sunMaterial = new THREE.MeshStandardMaterial({ 
            emissive: 0xffff00, // Sun emits light
            emissiveIntensity: 1,
            map: createSunTexture() // Procedural texture for the sun
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);

        // Function to create a procedural sun texture
        function createSunTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const context = canvas.getContext('2d');
            
            // Create a radial gradient for a sun-like appearance
            const gradient = context.createRadialGradient(128, 128, 20, 128, 128, 128);
            gradient.addColorStop(0, 'rgba(255, 255, 0, 1)'); // Yellow center
            gradient.addColorStop(0.6, 'rgba(255, 200, 0, 1)'); // Orange
            gradient.addColorStop(1, 'rgba(255, 100, 0, 0.5)'); // Reddish, semi-transparent edge
            
            context.fillStyle = gradient;
            context.fillRect(0, 0, 256, 256);

            // Add some noise/texture
            for (let i = 0; i < 5000; i++) {
                const x = Math.random() * 256;
                const y = Math.random() * 256;
                const alpha = Math.random() * 0.2 + 0.05; // Faint spots
                const size = Math.random() * 2 + 1;
                context.fillStyle = `rgba(255, 230, 180, ${alpha})`;
                context.fillRect(x, y, size, size);
            }
            
            return new THREE.CanvasTexture(canvas);
        }


        // Planets Data
        // Sizes and distances are scaled for visualization. Orbital speeds are relative.
        // Real data for info panel.
        const planetsData = [
            { name: "Mercury", radius: 0.38, color: 0xaaaaaa, orbitalRadius: 10, orbitalSpeed: 0.047, textureFile: null,
              info: { distanceFromSunKM: "57.9 million", orbitalSpeedKMPS: "47.87", diameterKM: "4,879", funFact: "Mercury is the smallest planet and closest to the Sun." } },
            { name: "Venus", radius: 0.95, color: 0xffe5b4, orbitalRadius: 15, orbitalSpeed: 0.035, textureFile: null,
              info: { distanceFromSunKM: "108.2 million", orbitalSpeedKMPS: "35.02", diameterKM: "12,104", funFact: "Venus has a thick, toxic atmosphere and rotates backwards." } },
            { name: "Earth", radius: 1, color: 0x6699ff, orbitalRadius: 20, orbitalSpeed: 0.029, textureFile: null, // Placeholder for texture
              info: { distanceFromSunKM: "149.6 million", orbitalSpeedKMPS: "29.78", diameterKM: "12,742", funFact: "Our home planet, teeming with life!" } },
            { name: "Mars", radius: 0.53, color: 0xff5733, orbitalRadius: 28, orbitalSpeed: 0.024, textureFile: null,
              info: { distanceFromSunKM: "227.9 million", orbitalSpeedKMPS: "24.07", diameterKM: "6,779", funFact: "Known as the Red Planet due to iron oxide on its surface." } },
            { name: "Jupiter", radius: 3.5, color: 0xffcc99, orbitalRadius: 50, orbitalSpeed: 0.013, textureFile: null,
              info: { distanceFromSunKM: "778.5 million", orbitalSpeedKMPS: "13.07", diameterKM: "139,820", funFact: "The largest planet, with a Great Red Spot - a giant storm." } },
            { name: "Saturn", radius: 3, color: 0xf0e68c, orbitalRadius: 75, orbitalSpeed: 0.009, textureFile: null, hasRings: true,
              info: { distanceFromSunKM: "1.434 billion", orbitalSpeedKMPS: "9.68", diameterKM: "116,460", funFact: "Famous for its stunning and complex ring system." } },
            { name: "Uranus", radius: 2, color: 0xace5ee, orbitalRadius: 100, orbitalSpeed: 0.006, textureFile: null, hasRings: true, ringColor: 0xADD8E6,
              info: { distanceFromSunKM: "2.871 billion", orbitalSpeedKMPS: "6.80", diameterKM: "50,724", funFact: "An ice giant that rotates on its side." } },
            { name: "Neptune", radius: 1.9, color: 0x3f51b5, orbitalRadius: 130, orbitalSpeed: 0.005, textureFile: null,
              info: { distanceFromSunKM: "4.495 billion", orbitalSpeedKMPS: "5.43", diameterKM: "49,244", funFact: "The windiest planet, with supersonic methane winds." } }
        ];

        const planets = [];
        const textureLoader = new THREE.TextureLoader(); // For loading textures

        planetsData.forEach(pData => {
            const planetGeometry = new THREE.SphereGeometry(pData.radius, 32, 32); // Smoother spheres
            let planetMaterial;
            
            // Basic color material if no texture
            planetMaterial = new THREE.MeshStandardMaterial({ color: pData.color, roughness: 0.8, metalness: 0.2 });
            planetMaterial.color.convertSRGBToLinear(); // Ensure colors are in linear space for PBR

            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.name = pData.name;
            planet.userData = pData; // Store all data for easy access
            planet.castShadow = true; // Planets cast shadows
            planet.receiveShadow = true; // Planets can receive shadows

            // Orbit paths
            const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
                new THREE.Path().absellipse(0, 0, pData.orbitalRadius, pData.orbitalRadius, 0, Math.PI * 2, false, 0).getSpacedPoints(128)
            );
            const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.5 });
            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2; // Rotate orbit to be horizontal
            scene.add(orbit);

            // Rings for Saturn and Uranus
            if (pData.hasRings) {
                const ringColor = pData.ringColor || 0xaaaaaa; // Default ring color if not specified
                const innerRadius = pData.radius * 1.2;
                const outerRadius = pData.radius * 2.2;
                const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
                
                // Make ring material double-sided and slightly transparent
                const ringMaterial = new THREE.MeshBasicMaterial({ 
                    color: ringColor, 
                    side: THREE.DoubleSide, 
                    transparent: true, 
                    opacity: 0.6 
                });
                ringMaterial.color.convertSRGBToLinear();

                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2 + 0.1; // Tilt rings slightly
                planet.add(ring); // Add rings as a child of the planet
            }

            scene.add(planet);
            planets.push(planet);
        });
        
        // Raycaster for clicking on planets
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const infoPanel = document.getElementById('infoPanel');
        const planetNameEl = document.getElementById('planetName');
        const distanceEl = document.getElementById('distance');
        const orbitalSpeedEl = document.getElementById('orbitalSpeed');
        const diameterEl = document.getElementById('diameter');
        const funFactEl = document.getElementById('funFact');

        let selectedPlanet = null;

        function onMouseClick(event) {
            // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(planets); // Check intersection with planets array

            if (intersects.length > 0) {
                const clickedPlanet = intersects[0].object;
                if (selectedPlanet !== clickedPlanet) {
                    // Deselect previous planet (if any)
                    if (selectedPlanet) {
                        selectedPlanet.material.emissive.setHex(0x000000); // Remove emissive color
                    }
                    
                    selectedPlanet = clickedPlanet;
                    selectedPlanet.material.emissive.setHex(0x555555); // Highlight selected planet

                    const data = selectedPlanet.userData.info;
                    planetNameEl.textContent = selectedPlanet.userData.name;
                    distanceEl.textContent = data.distanceFromSunKM;
                    orbitalSpeedEl.textContent = data.orbitalSpeedKMPS;
                    diameterEl.textContent = data.diameterKM;
                    funFactEl.textContent = data.funFact;
                    infoPanel.classList.remove('hidden');
                }
            } else {
                 // Clicked on empty space, deselect planet and hide panel
                if (selectedPlanet) {
                    selectedPlanet.material.emissive.setHex(0x000000);
                    selectedPlanet = null;
                }
                infoPanel.classList.add('hidden');
            }
        }
        window.addEventListener('click', onMouseClick);

        // Camera initial position
        camera.position.set(0, 60, 150); // Elevated and further back
        camera.lookAt(scene.position); // Look at the center of the scene (Sun)

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);

            const time = Date.now() * 0.0001; // Time factor for orbital speed

            planets.forEach(planet => {
                const pData = planet.userData;
                planet.position.x = Math.cos(time * pData.orbitalSpeed + pData.orbitalRadius) * pData.orbitalRadius;
                planet.position.z = Math.sin(time * pData.orbitalSpeed + pData.orbitalRadius) * pData.orbitalRadius;
                // Simple rotation on Y axis for planets
                planet.rotation.y += 0.005; 
            });
            
            sun.rotation.y += 0.001; // Sun slowly rotates

            controls.update(); // Only required if controls.enableDamping or controls.autoRotate are set to true
            renderer.render(scene, camera);
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate();
                                                                        