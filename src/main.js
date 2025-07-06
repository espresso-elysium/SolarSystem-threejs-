import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

console.log("Starting Solar System...");

// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();
console.log("Scene created");

// add textureLoader
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('/textures/cubeMap/');

// Planet data with additional information
const planetData = {
  Mercury: {
    description: "The smallest and innermost planet in the Solar System. Its orbital period around the Sun of 87.97 days is the shortest of all the planets.",
    facts: [
      "Surface temperature: -180°C to 430°C",
      "No moons",
      "Closest to the Sun",
      "Gray rocky surface"
    ]
  },
  Venus: {
    description: "Often called Earth's 'sister planet' due to similar size and mass. It's the hottest planet in our solar system.",
    facts: [
      "Surface temperature: 462°C",
      "No moons",
      "Rotates backwards",
      "Thick yellowish clouds of sulfuric acid"
    ]
  },
  Earth: {
    description: "Our home planet and the only known planet with life. It has one natural satellite - the Moon.",
    facts: [
      "Surface temperature: -88°C to 58°C",
      "1 moon",
      "Only planet with life",
      "Blue oceans and white clouds"
    ]
  },
  Mars: {
    description: "Known as the 'Red Planet' due to iron oxide on its surface. It has the largest volcano in the solar system.",
    facts: [
      "Surface temperature: -140°C to 20°C",
      "2 moons (Phobos & Deimos)",
      "Largest volcano: Olympus Mons",
      "Red dusty surface"
    ]
  },
  Uranus: {
    description: "The seventh planet from the Sun, Uranus is an ice giant with a blue-green color due to methane in its atmosphere. It has faint rings and rotates on its side!",
    facts: [
      "Surface temperature: -224°C",
      "27 known moons",
      "Faint rings",
      "Rotates on its side (98° tilt)",
      "Discovered in 1781 by William Herschel",
      "Blue-green color from methane"
    ]
  },
  Neptune: {
    description: "The eighth and farthest known planet from the Sun in the Solar System. Neptune is a deep blue ice giant with supersonic winds.",
    facts: [
      "Surface temperature: -214°C",
      "14 known moons",
      "Strongest winds in the solar system (up to 2,100 km/h)",
      "Discovered in 1846",
      "Deep blue color from methane"
    ]
  }
};

// Error handling for texture loading
const loadTexture = (url) => {
  return new Promise((resolve, reject) => {
    textureLoader.load(
      url,
      (texture) => {
        console.log(`Texture loaded: ${url}`);
        texture.colorSpace = THREE.SRGBColorSpace;
        resolve(texture);
      },
      undefined,
      (error) => {
        console.error(`Failed to load texture: ${url}`, error);
        // Return a fallback material instead of rejecting
        resolve(null);
      }
    );
  });
};

// Create materials with textures or fallback to basic colors
const createMaterials = async () => {
  console.log("Loading textures...");

  try {
    // Load textures with fallback
    const sunTexture = await loadTexture("/textures/2k_sun.jpg");
    const mercuryTexture = await loadTexture("/textures/2k_mercury.jpg");
    const venusTexture = await loadTexture("/textures/2k_venus_surface.jpg");
    const earthTexture = await loadTexture("/textures/2k_earth_daymap.jpg");
    const marsTexture = await loadTexture("/textures/2k_mars.jpg");
    const moonTexture = await loadTexture("/textures/2k_moon.jpg");

    // Load cubemap
    const backgroundCubemap = await new Promise((resolve) => {
      cubeTextureLoader.load(
        ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'],
        (texture) => {
          console.log("Cubemap loaded successfully");
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error("Failed to load cubemap, using fallback", error);
          resolve(null);
        }
      );
    });

    // Load Saturn ring texture
    const saturnRingTexture = await loadTexture("/textures/saturn_ring.png");

    // Create materials with textures or fallback colors
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture,
      color: 0xffff00, // fallback yellow
      emissive: 0xffff00,
      emissiveIntensity: 0.2
    });

    const mercuryMaterial = new THREE.MeshStandardMaterial({
      map: mercuryTexture,
      color: 0x8c7853, // fallback brown
      roughness: 0.6,
      metalness: 0.1,
      emissive: 0x222222,
      emissiveIntensity: 0.1
    });

    const venusMaterial = new THREE.MeshStandardMaterial({
      map: venusTexture,
      color: 0xe39e1c, // fallback orange
      roughness: 0.5,
      metalness: 0.2,
      emissive: 0x222222,
      emissiveIntensity: 0.1
    });

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      color: 0x6b93d6, // fallback blue
      roughness: 0.4,
      metalness: 0.1,
      emissive: 0x222222,
      emissiveIntensity: 0.1
    });

    const marsMaterial = new THREE.MeshStandardMaterial({
      map: marsTexture,
      color: 0xc1440e, // fallback red
      roughness: 0.7,
      metalness: 0.1,
      emissive: 0x222222,
      emissiveIntensity: 0.1
    });

    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      color: 0xcccccc, // fallback gray
      roughness: 0.6,
      metalness: 0.1,
      emissive: 0x222222,
      emissiveIntensity: 0.1
    });

    // Saturn material (golden/yellow color)
    const saturnMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4d03f, // golden yellow
      roughness: 0.5,
      metalness: 0.1,
      emissive: 0x222222,
      emissiveIntensity: 0.1
    });

    // Add Uranus and Neptune materials
    const uranusMaterial = new THREE.MeshStandardMaterial({
      color: 0x7fffd4, // aquamarine
      roughness: 0.5,
      metalness: 0.1,
      emissive: 0x224444,
      emissiveIntensity: 0.12
    });
    const neptuneMaterial = new THREE.MeshStandardMaterial({
      color: 0x4166f5, // deep blue
      roughness: 0.5,
      metalness: 0.1,
      emissive: 0x222244,
      emissiveIntensity: 0.12
    });

    return {
      sunMaterial,
      mercuryMaterial,
      venusMaterial,
      earthMaterial,
      marsMaterial,
      moonMaterial,
      saturnMaterial,
      uranusMaterial,
      neptuneMaterial,
      backgroundCubemap,
      saturnRingTexture
    };

  } catch (error) {
    console.error("Error in texture loading, using basic materials:", error);
    return createBasicMaterials();
  }
};

// Create basic materials without textures
const createBasicMaterials = () => {
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const mercuryMaterial = new THREE.MeshStandardMaterial({ color: 0x8c7853 });
  const venusMaterial = new THREE.MeshStandardMaterial({ color: 0xe39e1c });
  const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x6b93d6 });
  const marsMaterial = new THREE.MeshStandardMaterial({ color: 0xc1440e });
  const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });

  return {
    sunMaterial,
    mercuryMaterial,
    venusMaterial,
    earthMaterial,
    marsMaterial,
    moonMaterial,
    backgroundCubemap: null,
    saturnRingTexture: null
  };
};

// Initialize the scene
const initializeScene = async () => {
  console.log("Initializing scene...");

  const materials = await createMaterials();

  // Create starfield background
  const createStarfield = () => {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      // Random positions in a sphere
      const radius = 200 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);

      // Random star colors (white, blue, yellow, red)
      const starType = Math.random();
      if (starType < 0.7) {
        // White stars
        colors[i] = 1;
        colors[i + 1] = 1;
        colors[i + 2] = 1;
      } else if (starType < 0.85) {
        // Blue stars
        colors[i] = 0.7;
        colors[i + 1] = 0.8;
        colors[i + 2] = 1;
      } else if (starType < 0.95) {
        // Yellow stars
        colors[i] = 1;
        colors[i + 1] = 1;
        colors[i + 2] = 0.8;
      } else {
        // Red stars
        colors[i] = 1;
        colors[i + 1] = 0.6;
        colors[i + 2] = 0.6;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    return stars;
  };

  // Set background
  if (materials.backgroundCubemap) {
    scene.background = materials.backgroundCubemap;
  } else {
    scene.background = new THREE.Color(0x000011);
    // Add starfield
    const starfield = createStarfield();
    scene.add(starfield);
  }

  // add stuff here
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

  // Create enhanced sun with multiple layers
  const sunCore = new THREE.Mesh(sphereGeometry, materials.sunMaterial);
  sunCore.scale.setScalar(5);
  sunCore.userData = { name: "Sun", type: 'star' };
  scene.add(sunCore);

  // Sun corona effect
  const coronaGeometry = new THREE.SphereGeometry(7, 32, 32);
  const coronaMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide
  });
  const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
  scene.add(corona);

  // Sun particles effect
  const particleCount = 1000;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    const radius = 6 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i + 2] = radius * Math.cos(phi);
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffff00,
    size: 0.1,
    transparent: true,
    opacity: 0.6
  });

  const sunParticles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(sunParticles);

  console.log("Enhanced sun added to scene");

  // Remove Saturn from the planets array
  const planets = [
    {
      name: "Mercury",
      radius: 0.5,
      distance: 10,
      speed: 0.01,
      material: materials.mercuryMaterial,
      moons: [],
    },
    {
      name: "Venus",
      radius: 0.8,
      distance: 15,
      speed: 0.007,
      material: materials.venusMaterial,
      moons: [],
    },
    {
      name: "Earth",
      radius: 1,
      distance: 20,
      speed: 0.005,
      material: materials.earthMaterial,
      moons: [
        {
          name: "Moon",
          radius: 0.3,
          distance: 3,
          speed: 0.015,
        },
      ],
    },
    {
      name: "Mars",
      radius: 0.7,
      distance: 25,
      speed: 0.003,
      material: materials.marsMaterial,
      moons: [
        {
          name: "Phobos",
          radius: 0.1,
          distance: 2,
          speed: 0.02,
        },
        {
          name: "Deimos",
          radius: 0.2,
          distance: 3,
          speed: 0.015,
          color: 0xffffff,
        },
      ],
    },
    {
      name: "Uranus",
      radius: 1.1,
      distance: 45,
      speed: 0.0012,
      material: materials.uranusMaterial,
      moons: [],
      hasRings: true,
      ringColor: 0xcccccc,
      ringTilt: Math.PI / 180 * 98
    },
    {
      name: "Neptune",
      radius: 1.1,
      distance: 55,
      speed: 0.0008,
      material: materials.neptuneMaterial,
      moons: [],
    },
  ];

  // Remove Saturn-specific code from createPlanet
  const createPlanet = (planet) => {
    const planetMesh = new THREE.Mesh(
      sphereGeometry,
      planet.material
    )
    planetMesh.scale.setScalar(planet.radius)
    planetMesh.position.x = planet.distance
    planetMesh.userData = { name: planet.name, type: 'planet' }

    // Add subtle atmospheric glow effect (only for Earth-like planets)
    if (planet.name === "Earth") {
      const atmosphereGeometry = new THREE.SphereGeometry(planet.radius * 1.02, 32, 32);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      planetMesh.add(atmosphere);
    }

    // Add Uranus's ring (thin, faint, colored, no texture)
    if (planet.name === "Uranus" && planet.hasRings) {
      const uranusRingGeometry = new THREE.RingGeometry(planet.radius * 1.1, planet.radius * 1.3, 128);
      const uranusRingMaterial = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
      });
      const uranusRing = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);
      uranusRing.rotation.x = planet.ringTilt || Math.PI / 2;
      planetMesh.add(uranusRing);
    }

    // Orbital paths are now created separately for better visibility

    return planetMesh
  }

  const createMoon = (moon) => {
    const moonMesh = new THREE.Mesh(
      sphereGeometry,
      materials.moonMaterial
    )
    moonMesh.scale.setScalar(moon.radius)
    moonMesh.position.x = moon.distance
    moonMesh.userData = { name: moon.name, type: 'moon' }
    return moonMesh
  }

  const planetMeshes = planets.map((planet) => {
    const planetMesh = createPlanet(planet)
    scene.add(planetMesh)
    console.log(`Added planet: ${planet.name} at position:`, planetMesh.position);

    planet.moons.forEach((moon) => {
      const moonMesh = createMoon(moon)
      planetMesh.add(moonMesh)
      console.log(`Added moon: ${moon.name} to ${planet.name}`);
    })
    return planetMesh
  })

  console.log("Planets added to scene:", planetMeshes.length);
  console.log("Planet positions:", planetMeshes.map(p => ({ name: p.userData.name, pos: p.position })));

  // Store planet data for the render loop
  const planetDataForRender = planets.map(planet => ({
    name: planet.name,
    speed: planet.speed,
    distance: planet.distance,
    moons: planet.moons
  }));

  // Enhanced lighting system
  const ambientLight = new THREE.AmbientLight(
    0x404040,
    0.4
  )
  scene.add(ambientLight)

  // Sun light (main light source)
  const sunLight = new THREE.PointLight(
    0xffffff,
    5,
    0,
    0
  )
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight)

  // Additional fill light
  const fillLight = new THREE.DirectionalLight(
    0x404040,
    0.6
  )
  fillLight.position.set(50, 50, 50);
  scene.add(fillLight)

  // Sun glow effect (reduced)
  const sunGlowGeometry = new THREE.SphereGeometry(7, 32, 32);
  const sunGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff99,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide
  });
  const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
  scene.add(sunGlow);

  console.log("Enhanced lighting system added to scene");

  // initialize the camera
  const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    400
  );
  camera.position.z = 100;
  camera.position.y = 5;
  console.log("Camera initialized");

  // initialize the renderer
  const canvas = document.querySelector("canvas.threejs");
  if (!canvas) {
    console.error("Canvas not found!");
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  console.log("Renderer initialized with enhanced settings");

  // add controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.maxDistance = 200;
  controls.minDistance = 20;
  console.log("Controls initialized");

  // add resize listener
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // UI Elements
  const loadingScreen = document.getElementById('loadingScreen');
  const infoPanel = document.getElementById('infoPanel');
  const planetInfo = document.getElementById('planetInfo');
  const toggleInfoBtn = document.getElementById('toggleInfo');
  const closeInfoBtn = document.getElementById('closeInfo');
  const resetCameraBtn = document.getElementById('resetCamera');
  const speedControl = document.getElementById('speedControl');
  const speedValue = document.getElementById('speedValue');
  const planetLabels = document.getElementById('planetLabels');

  // Speed control
  let simulationSpeed = 1;
  if (speedControl) {
    speedControl.addEventListener('input', (e) => {
      simulationSpeed = parseFloat(e.target.value);
      if (speedValue) speedValue.textContent = simulationSpeed + 'x';
    });
  }

  // Info panel toggle
  if (toggleInfoBtn) {
    toggleInfoBtn.addEventListener('click', () => {
      if (infoPanel) infoPanel.classList.toggle('active');
    });
  }

  if (closeInfoBtn) {
    closeInfoBtn.addEventListener('click', () => {
      if (infoPanel) infoPanel.classList.remove('active');
    });
  }

  // Reset camera
  if (resetCameraBtn) {
    resetCameraBtn.addEventListener('click', () => {
      camera.position.set(0, 5, 100);
      controls.reset();
    });
  }

  // Raycaster for planet selection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  canvas.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Get all objects in the scene including children
    const allObjects = [];
    scene.traverse((object) => {
      if (object.isMesh) {
        allObjects.push(object);
      }
    });

    const intersects = raycaster.intersectObjects(allObjects, true);
    console.log("Click detected, intersects:", intersects.length);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      console.log("Clicked object:", object.userData);

      // Check if it's a planet or moon
      if (object.userData.name && planetData[object.userData.name]) {
        const data = planetData[object.userData.name];
        console.log("Planet data found:", data);

        if (planetInfo) {
          planetInfo.innerHTML = `
            <h3>${object.userData.name}</h3>
            <p>${data.description}</p>
            <h4>Quick Facts:</h4>
            <ul>
              ${data.facts.map(fact => `<li>${fact}</li>`).join('')}
            </ul>
          `;
        }
        if (infoPanel) {
          infoPanel.classList.add('active');
          console.log("Info panel activated");
        }
      } else if (object.userData.name === "Moon") {
        // Handle moon click
        if (planetInfo) {
          planetInfo.innerHTML = `
            <h3>Moon</h3>
            <p>Earth's only natural satellite, the Moon is the fifth largest moon in the Solar System.</p>
            <h4>Quick Facts:</h4>
            <ul>
              <li>Distance from Earth: 384,400 km</li>
              <li>Surface temperature: -233°C to 123°C</li>
              <li>No atmosphere</li>
            </ul>
          `;
        }
        if (infoPanel) {
          infoPanel.classList.add('active');
          console.log("Moon info panel activated");
        }
      }
    }
  });

  // Planet labels disabled - removed for cleaner look
  const createPlanetLabels = () => {
    // Labels are disabled
  };

  const updatePlanetLabels = () => {
    // Labels are disabled
  };

  // Hide loading screen
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    createPlanetLabels();
  }

  // Create orbital paths (lines only, no rings)
  const createOrbitalPaths = () => {
    const orbitPaths = [];

    planets.forEach((planet) => {
      // Add orbital line only
      const points = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle) * planet.distance;
        const z = Math.sin(angle) * planet.distance;
        points.push(new THREE.Vector3(x, 0, z));
      }

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x666666,
        transparent: true,
        opacity: 0.3
      });
      const orbitLine = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(orbitLine);
      orbitPaths.push(orbitLine);
    });

    return orbitPaths;
  };

  // Create orbital paths
  const orbitPaths = createOrbitalPaths();
  console.log("Orbital paths created:", orbitPaths.length);

  // render loop
  let lastUserInteraction = Date.now();
  window.addEventListener('pointerdown', () => { lastUserInteraction = Date.now(); });
  window.addEventListener('pointermove', () => { lastUserInteraction = Date.now(); });
  window.addEventListener('wheel', () => { lastUserInteraction = Date.now(); });

  const AUTO_ROTATE_IDLE_TIME = 6000; // ms
  const AUTO_ROTATE_SPEED = 0.002;

  const renderloop = () => {
    // Animate sun
    sunCore.rotation.y += 0.005 * simulationSpeed;
    corona.rotation.y += 0.003 * simulationSpeed;
    sunParticles.rotation.y += 0.002 * simulationSpeed;

    // Orbital paths are static lines, no animation needed

    // Animate planets
    planetMeshes.forEach((planet, planetIndex) => {
      const planetData = planetDataForRender[planetIndex];
      planet.rotation.y += planetData.speed * simulationSpeed
      planet.position.x = Math.sin(planet.rotation.y) * planetData.distance
      planet.position.z = Math.cos(planet.rotation.y) * planetData.distance

      planet.children.forEach((moon, moonIndex) => {
        if (planetData.moons[moonIndex]) {
          moon.rotation.y += planetData.moons[moonIndex].speed * simulationSpeed
          moon.position.x = Math.sin(moon.rotation.y) * planetData.moons[moonIndex].distance
          moon.position.z = Math.cos(moon.rotation.y) * planetData.moons[moonIndex].distance
        }
      })
    })

    updatePlanetLabels();
    controls.update();

    if (Date.now() - lastUserInteraction > AUTO_ROTATE_IDLE_TIME) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = AUTO_ROTATE_SPEED;
    } else {
      controls.autoRotate = false;
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(renderloop);
  };

  console.log("Starting render loop...");
  renderloop();
};

// Start the application
console.log("Starting Solar System with textures...");
initializeScene().catch((error) => {
  console.error("Failed to initialize scene:", error);
  // Fallback to basic materials
  console.log("Falling back to basic materials...");
  initializeScene();
});