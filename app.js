// Three.js scene setup
let scene, camera, renderer;
let components = {};
let particles = [];
let connections = [];

// Initialize Three.js
function initThree() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three-canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // Create components
    createMachineSimulators();
    createDIMEServices();
    createMQTTBroker();
    createStorageComponents();
    createAnalysisComponents();
    createUIComponent();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

// Create machine simulators
function createMachineSimulators() {
    // Common geometry and materials
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const edgeGeometry = new THREE.EdgesGeometry(boxGeometry);
    
    // Mazak simulator
    const mazakMaterial = new THREE.MeshPhongMaterial({
        color: 0x5a67d8,
        emissive: 0x5a67d8,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9
    });
    const mazakMesh = new THREE.Mesh(boxGeometry, mazakMaterial);
    mazakMesh.position.set(-4, 0, 0);
    mazakMesh.castShadow = true;
    mazakMesh.receiveShadow = true;
    
    const mazakEdges = new THREE.LineSegments(
        edgeGeometry,
        new THREE.LineBasicMaterial({ color: 0x667eea, linewidth: 2 })
    );
    mazakMesh.add(mazakEdges);
    
    scene.add(mazakMesh);
    components.mazak = mazakMesh;

    // Okuma simulator
    const okumaMaterial = new THREE.MeshPhongMaterial({
        color: 0x38b2ac,
        emissive: 0x38b2ac,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9
    });
    const okumaMesh = new THREE.Mesh(boxGeometry, okumaMaterial);
    okumaMesh.position.set(0, 0, 0);
    okumaMesh.castShadow = true;
    okumaMesh.receiveShadow = true;
    
    const okumaEdges = new THREE.LineSegments(
        edgeGeometry,
        new THREE.LineBasicMaterial({ color: 0x4fd1c5, linewidth: 2 })
    );
    okumaMesh.add(okumaEdges);
    
    scene.add(okumaMesh);
    components.okuma = okumaMesh;

    // Your Machine placeholder
    const yourMachineGeometry = new THREE.BoxGeometry(2, 2, 2);
    const yourMachineMaterial = new THREE.MeshPhongMaterial({
        color: 0x4a5568,
        emissive: 0x4a5568,
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: 0.5,
        wireframe: true
    });
    const yourMachineMesh = new THREE.Mesh(yourMachineGeometry, yourMachineMaterial);
    yourMachineMesh.position.set(4, 0, 0);
    
    scene.add(yourMachineMesh);
    components.yourMachine = yourMachineMesh;

    // Add floating animation
    gsap.to(mazakMesh.position, {
        y: 0.5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });

    gsap.to(okumaMesh.position, {
        y: 0.5,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 0.5
    });

    gsap.to(yourMachineMesh.position, {
        y: 0.5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1
    });
}

// Create DIME Services
function createDIMEServices() {
    const geometry = new THREE.CylinderGeometry(2, 2, 2, 8);
    const material = new THREE.MeshPhongMaterial({
        color: 0x9f7aea,
        emissive: 0x9f7aea,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -25, 0); // Start much further below viewport to ensure it's completely hidden
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edges = new THREE.LineSegments(
        edgeGeometry,
        new THREE.LineBasicMaterial({ color: 0xb794f4, linewidth: 2 })
    );
    mesh.add(edges);
    
    scene.add(mesh);
    components.agent = mesh;
}

// Create MQTT Broker
function createMQTTBroker() {
    const geometry = new THREE.OctahedronGeometry(1.5);
    const material = new THREE.MeshPhongMaterial({
        color: 0xf6ad55,
        emissive: 0xf6ad55,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -20, 0); // Start below viewport
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edges = new THREE.LineSegments(
        edgeGeometry,
        new THREE.LineBasicMaterial({ color: 0xfbd38d, linewidth: 2 })
    );
    mesh.add(edges);
    
    scene.add(mesh);
    components.mqtt = mesh;
}

// Create MTC2Redis and Redis DB components
function createStorageComponents() {
    // MTC2Redis Service
    const mtc2redisGeometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const mtc2redisMaterial = new THREE.MeshPhongMaterial({
        color: 0x48bb78,
        emissive: 0x48bb78,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9
    });
    const mtc2redisMesh = new THREE.Mesh(mtc2redisGeometry, mtc2redisMaterial);
    mtc2redisMesh.position.set(-3, -30, 0); // Start below viewport, left side
    mtc2redisMesh.castShadow = true;
    mtc2redisMesh.receiveShadow = true;
    
    const mtc2redisEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(mtc2redisGeometry),
        new THREE.LineBasicMaterial({ color: 0x68d391, linewidth: 2 })
    );
    mtc2redisMesh.add(mtc2redisEdges);
    
    scene.add(mtc2redisMesh);
    components.mtc2redis = mtc2redisMesh;

    // Redis Database
    const redisGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 6);
    const redisMaterial = new THREE.MeshPhongMaterial({
        color: 0xfc8181,
        emissive: 0xfc8181,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9
    });
    const redisMesh = new THREE.Mesh(redisGeometry, redisMaterial);
    redisMesh.position.set(3, -30, 0); // Start below viewport, right side
    redisMesh.castShadow = true;
    redisMesh.receiveShadow = true;
    
    const redisEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(redisGeometry),
        new THREE.LineBasicMaterial({ color: 0xfeb2b2, linewidth: 2 })
    );
    redisMesh.add(redisEdges);
    
    scene.add(redisMesh);
    components.redis = redisMesh;
}

// Create MTC2Anomaly and MTC2HTM components
function createAnalysisComponents() {
    // MTC2Anomaly Service
    const anomalyGeometry = new THREE.DodecahedronGeometry(1.5);
    const anomalyMaterial = new THREE.MeshPhongMaterial({
        color: 0xed64a6,
        emissive: 0xed64a6,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9
    });
    const anomalyMesh = new THREE.Mesh(anomalyGeometry, anomalyMaterial);
    anomalyMesh.position.set(-2, -40, 0); // Start below viewport
    anomalyMesh.castShadow = true;
    anomalyMesh.receiveShadow = true;
    
    const anomalyEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(anomalyGeometry),
        new THREE.LineBasicMaterial({ color: 0xf687b3, linewidth: 2 })
    );
    anomalyMesh.add(anomalyEdges);
    
    scene.add(anomalyMesh);
    components.mtc2anomaly = anomalyMesh;

    // MTC2HTM Service
    const htmGeometry = new THREE.IcosahedronGeometry(1.5);
    const htmMaterial = new THREE.MeshPhongMaterial({
        color: 0xa78bfa,
        emissive: 0xa78bfa,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9
    });
    const htmMesh = new THREE.Mesh(htmGeometry, htmMaterial);
    htmMesh.position.set(4, -40, 0); // Start below viewport
    htmMesh.castShadow = true;
    htmMesh.receiveShadow = true;
    
    const htmEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(htmGeometry),
        new THREE.LineBasicMaterial({ color: 0xc4b5fd, linewidth: 2 })
    );
    htmMesh.add(htmEdges);
    
    scene.add(htmMesh);
    components.mtc2htm = htmMesh;
}

// Create MTC2UI component
function createUIComponent() {
    const uiGeometry = new THREE.BoxGeometry(3, 2, 0.5);
    const uiMaterial = new THREE.MeshPhongMaterial({
        color: 0x60a5fa,
        emissive: 0x60a5fa,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9
    });
    const uiMesh = new THREE.Mesh(uiGeometry, uiMaterial);
    uiMesh.position.set(0, -50, 0); // Start below viewport
    uiMesh.castShadow = true;
    uiMesh.receiveShadow = true;
    
    const uiEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(uiGeometry),
        new THREE.LineBasicMaterial({ color: 0x93c5fd, linewidth: 2 })
    );
    uiMesh.add(uiEdges);
    
    scene.add(uiMesh);
    components.mtc2ui = uiMesh;
}

// Particle system for data flow
class ParticleFlow {
    constructor(startPos, endPos, color, isInformation = false) {
        this.particles = [];
        this.startPos = startPos;
        this.endPos = endPos;
        this.color = color;
        this.isInformation = isInformation;
        this.active = false;
        
        // Create particle geometry
        const geometry = new THREE.SphereGeometry(isInformation ? 0.15 : 0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 1,
            transparent: true
        });
        
        // Create particle pool
        for (let i = 0; i < 20; i++) {
            const particle = new THREE.Mesh(geometry, material.clone());
            particle.visible = false;
            scene.add(particle);
            this.particles.push({
                mesh: particle,
                progress: Math.random(),
                speed: 0.003 + Math.random() * 0.002  // Reduced from 0.01-0.02 to 0.003-0.005
            });
        }
    }
    
    start() {
        this.active = true;
    }
    
    stop() {
        this.active = false;
        this.particles.forEach(p => p.mesh.visible = false);
    }
    
    destroy() {
        this.stop();
        this.particles.forEach(p => {
            scene.remove(p.mesh);
            if (p.mesh.geometry) p.mesh.geometry.dispose();
            if (p.mesh.material) p.mesh.material.dispose();
        });
        this.particles = [];
    }
    
    update() {
        if (!this.active) return;
        
        this.particles.forEach(particle => {
            if (particle.mesh.visible || Math.random() < 0.02) {  // Reduced spawn rate from 0.05 to 0.02
                particle.mesh.visible = true;
                particle.progress += particle.speed;
                
                if (particle.progress >= 1) {
                    particle.progress = 0;
                    particle.mesh.visible = Math.random() < 0.5;
                }
                
                // Calculate position
                const t = particle.progress;
                particle.mesh.position.lerpVectors(this.startPos, this.endPos, t);
                
                // Add some curve to the path
                const curve = Math.sin(t * Math.PI) * 0.5;
                particle.mesh.position.y += curve;
                
                // Fade in/out
                const opacity = Math.sin(t * Math.PI);
                particle.mesh.material.opacity = opacity;
                
                // Scale based on information vs data
                const scale = this.isInformation ? 1 + Math.sin(t * Math.PI) * 0.5 : 1;
                particle.mesh.scale.setScalar(scale);
            }
        });
    }
}

// Create connections
function createConnection(start, end, color) {
    const points = [start, end];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    return line;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update particles
    particles.forEach(flow => flow.update());
    
    // Rotate components slightly
    if (components.agent) {
        components.agent.rotation.y += 0.005;
    }
    if (components.mqtt) {
        components.mqtt.rotation.y += 0.01;
        components.mqtt.rotation.z += 0.005;
    }
    if (components.mtc2redis) {
        components.mtc2redis.rotation.y += 0.003;
    }
    if (components.redis) {
        components.redis.rotation.y -= 0.004;
    }
    if (components.mtc2anomaly) {
        components.mtc2anomaly.rotation.x += 0.003;
        components.mtc2anomaly.rotation.y += 0.002;
    }
    if (components.mtc2htm) {
        components.mtc2htm.rotation.x -= 0.002;
        components.mtc2htm.rotation.y += 0.003;
    }
    if (components.mtc2ui) {
        components.mtc2ui.rotation.y += 0.002;
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Force scroll to top before page unload to prevent restoration
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// Track connections and particle flows for cleanup
let activeConnections = [];
let activeParticles = [];

// Scroll lock state
let isAnimating = false;
let scrollLocked = false;
let currentSection = 0;
let sectionAnimationComplete = {};

// Helper to create section trigger with animation guard
function createSectionTrigger(config) {
    const originalOnEnter = config.onEnter;
    const originalOnLeaveBack = config.onLeaveBack;
    
    config.onEnter = function() {
        if (isAnimating) return;
        if (originalOnEnter) originalOnEnter.call(this);
    };
    
    config.onLeaveBack = function() {
        if (isAnimating) return;
        if (originalOnLeaveBack) originalOnLeaveBack.call(this);
    };
    
    return ScrollTrigger.create(config);
}

// Scroll lock functions
function lockScroll() {
    if (!scrollLocked) {
        scrollLocked = true;
        document.body.classList.add('scroll-locked');
        document.documentElement.style.overflow = 'hidden';
    }
}

function unlockScroll() {
    if (scrollLocked) {
        scrollLocked = false;
        document.body.classList.remove('scroll-locked');
        document.documentElement.style.overflow = '';
    }
}

// Animation loading indicator functions
function showAnimationLoading() {
    const loader = document.querySelector('.animation-loading');
    if (loader) loader.classList.add('active');
    lockScroll();
    isAnimating = true;
}

function hideAnimationLoading() {
    const loader = document.querySelector('.animation-loading');
    if (loader) loader.classList.remove('active');
    // Delay unlock to ensure animation completes
    setTimeout(() => {
        unlockScroll();
        isAnimating = false;
    }, 300);
}

// Initialize scroll animations
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Configure ScrollTrigger to respect animation state
    ScrollTrigger.config({
        limitCallbacks: true,
        syncInterval: 40
    });
    
    // Fade in narrative elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        gsap.to(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                end: "bottom 20%",
                onEnter: () => {
                    if (!isAnimating) {
                        element.classList.add('visible');
                    }
                },
                onLeaveBack: () => {
                    if (!isAnimating) {
                        element.classList.remove('visible');
                    }
                }
            }
        });
    });
    
    // Section 2: DIME Services animation
    let agentConnections = [];
    let agentParticles = [];
    
    createSectionTrigger({
        trigger: "#section-agent .narrative-content",
        start: "top top+=50",
        end: "bottom top",
        onEnter: () => {
            // Show loading indicator
            showAnimationLoading();
            
            // Fade out machine simulator labels
            ['label-mazak', 'label-okuma', 'label-your-machine'].forEach(id => {
                const label = document.getElementById(id);
                if (label) {
                    gsap.to(label, {
                        opacity: 0,
                        duration: 1,
                        onComplete: () => {
                            label.style.display = 'none';
                        }
                    });
                }
            });
            
            // Animate agent into position
            gsap.to(components.agent.position, {
                y: -3,
                duration: 2,
                ease: "power2.out"
            });
            
            // Create and animate connections
            setTimeout(() => {
                // Create connection lines
                const mazakConnection = createConnection(
                    components.mazak.position,
                    new THREE.Vector3(0, -3, 0),
                    0x667eea
                );
                const okumaConnection = createConnection(
                    components.okuma.position,
                    new THREE.Vector3(0, -3, 0),
                    0x4fd1c5
                );
                
                agentConnections = [mazakConnection, okumaConnection];
                
                // Fade in connections
                gsap.to([mazakConnection.material, okumaConnection.material], {
                    opacity: 0.5,
                    duration: 1
                });
                
                // Start data flow particles
                const mazakFlow = new ParticleFlow(
                    components.mazak.position,
                    new THREE.Vector3(0, -3, 0),
                    0x667eea,
                    false
                );
                const okumaFlow = new ParticleFlow(
                    components.okuma.position,
                    new THREE.Vector3(0, -3, 0),
                    0x4fd1c5,
                    false
                );
                
                agentParticles = [mazakFlow, okumaFlow];
                particles.push(mazakFlow, okumaFlow);
                mazakFlow.start();
                okumaFlow.start();
            }, 1000);
            
            // Show agent label
            showLabel('agent', components.agent);
            
            // Hide loading indicator after animation completes
            setTimeout(() => {
                hideAnimationLoading();
            }, 2000);
        },
        onLeaveBack: () => {
            // Show loading indicator
            showAnimationLoading();
            
            // Restore machine simulator labels
            ['label-mazak', 'label-okuma', 'label-your-machine'].forEach(id => {
                const label = document.getElementById(id);
                if (label) {
                    label.style.display = 'block';
                    gsap.to(label, {
                        opacity: 0.7,
                        duration: 1
                    });
                }
            });
            
            // Reverse animation when scrolling up
            gsap.to(components.agent.position, {
                y: -25,
                duration: 2,
                ease: "power2.in"
            });
            
            // Fade out connections
            agentConnections.forEach(conn => {
                gsap.to(conn.material, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        scene.remove(conn);
                    }
                });
            });
            
            // Stop and remove particles
            agentParticles.forEach(flow => {
                flow.stop();
                const index = particles.indexOf(flow);
                if (index > -1) particles.splice(index, 1);
            });
            
            // Hide label
            const label = document.getElementById('label-agent');
            if (label) label.style.display = 'none';
            
            // Hide loading indicator
            setTimeout(() => {
                hideAnimationLoading();
            }, 2000);
        }
    });
    
    // Section 3: MQTT Broker animation
    let mqttConnections = [];
    let mqttParticles = [];
    
    createSectionTrigger({
        trigger: "#section-mqtt .narrative-content",
        start: "top top+=50",
        end: "bottom top",
        onEnter: () => {
            // Show loading indicator
            showAnimationLoading();
            
            // Fade out previous section labels
            const agentLabel = document.getElementById('label-agent');
            if (agentLabel) {
                gsap.to(agentLabel, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        agentLabel.style.display = 'none';
                    }
                });
            }
            
            // Animate MQTT broker into position
            gsap.to(components.mqtt.position, {
                y: -6,
                duration: 2,
                ease: "power2.out"
            });
            
            // Create and animate connection
            setTimeout(() => {
                const agentConnection = createConnection(
                    new THREE.Vector3(0, -3, 0),
                    new THREE.Vector3(0, -6, 0),
                    0xfbd38d
                );
                
                mqttConnections = [agentConnection];
                
                gsap.to(agentConnection.material, {
                    opacity: 0.5,
                    duration: 1
                });
                
                // Start information flow (larger, different particles)
                const infoFlow = new ParticleFlow(
                    new THREE.Vector3(0, -3, 0),
                    new THREE.Vector3(0, -6, 0),
                    0xfbd38d,
                    true // This is information, not raw data
                );
                
                mqttParticles = [infoFlow];
                particles.push(infoFlow);
                infoFlow.start();
            }, 1000);
            
            // Show MQTT label
            showLabel('mqtt', components.mqtt);
            
            // Hide loading indicator
            setTimeout(() => {
                hideAnimationLoading();
            }, 2000);
        },
        onLeaveBack: () => {
            // Show loading indicator
            showAnimationLoading();
            
            // Restore agent label
            const agentLabel = document.getElementById('label-agent');
            if (agentLabel) {
                agentLabel.style.display = 'block';
                gsap.to(agentLabel, {
                    opacity: 0.7,
                    duration: 1
                });
            }
            
            // Reverse animation when scrolling up
            gsap.to(components.mqtt.position, {
                y: -20,
                duration: 2,
                ease: "power2.in"
            });
            
            // Fade out connections
            mqttConnections.forEach(conn => {
                gsap.to(conn.material, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        scene.remove(conn);
                    }
                });
            });
            
            // Stop and remove particles
            mqttParticles.forEach(flow => {
                flow.stop();
                const index = particles.indexOf(flow);
                if (index > -1) particles.splice(index, 1);
            });
            
            // Hide label
            const label = document.getElementById('label-mqtt');
            if (label) label.style.display = 'none';
            
            // Hide loading indicator
            setTimeout(() => {
                hideAnimationLoading();
            }, 2000);
        }
    });
    
    // Section 4: Storage animation
    let storageConnections = [];
    let storageParticles = [];
    
    createSectionTrigger({
        trigger: "#section-storage .narrative-content",
        start: "top top+=50",
        end: "bottom top",
        onEnter: () => {
            // Show loading indicator
            showAnimationLoading();
            
            // Fade out previous section labels
            const mqttLabel = document.getElementById('label-mqtt');
            if (mqttLabel) {
                gsap.to(mqttLabel, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        mqttLabel.style.display = 'none';
                    }
                });
            }
            
            // Animate MTC2Redis and Redis DB into position
            gsap.to(components.mtc2redis.position, {
                y: -9,
                duration: 2,
                ease: "power2.out"
            });
            
            gsap.to(components.redis.position, {
                y: -9,
                duration: 2,
                delay: 0.3,
                ease: "power2.out"
            });
            
            // Create connections after components are in place
            setTimeout(() => {
                // Connection from MQTT to MTC2Redis
                const brokerToMtc2Redis = createConnection(
                    new THREE.Vector3(0, -6, 0),
                    new THREE.Vector3(-3, -9, 0),
                    0x68d391
                );
                
                // Connection from MTC2Redis to Redis
                const mtc2RedisToRedis = createConnection(
                    new THREE.Vector3(-3, -9, 0),
                    new THREE.Vector3(3, -9, 0),
                    0xfeb2b2
                );
                
                storageConnections = [brokerToMtc2Redis, mtc2RedisToRedis];
                
                // Fade in connections
                gsap.to([brokerToMtc2Redis.material, mtc2RedisToRedis.material], {
                    opacity: 0.5,
                    duration: 1
                });
                
                // Start particle flows
                const brokerFlow = new ParticleFlow(
                    new THREE.Vector3(0, -6, 0),
                    new THREE.Vector3(-3, -9, 0),
                    0x68d391,
                    true
                );
                
                const storageFlow = new ParticleFlow(
                    new THREE.Vector3(-3, -9, 0),
                    new THREE.Vector3(3, -9, 0),
                    0xfeb2b2,
                    true
                );
                
                storageParticles = [brokerFlow, storageFlow];
                particles.push(brokerFlow, storageFlow);
                brokerFlow.start();
                
                // Delay storage flow slightly
                setTimeout(() => {
                    storageFlow.start();
                }, 500);
            }, 1500);
            
            // Show labels
            setTimeout(() => {
                showLabel('mtc2redis', components.mtc2redis);
                showLabel('redis', components.redis);
                
                // Hide loading indicator
                setTimeout(() => {
                    hideAnimationLoading();
                }, 1000);
            }, 1000);
        },
        onLeaveBack: () => {
            // Show loading indicator
            showAnimationLoading();
            
            // Restore MQTT label
            const mqttLabel = document.getElementById('label-mqtt');
            if (mqttLabel) {
                mqttLabel.style.display = 'block';
                gsap.to(mqttLabel, {
                    opacity: 0.7,
                    duration: 1
                });
            }
            
            // Reverse animation when scrolling up
            gsap.to(components.mtc2redis.position, {
                y: -30,
                duration: 2,
                ease: "power2.in"
            });
            
            gsap.to(components.redis.position, {
                y: -30,
                duration: 2,
                delay: 0.1,
                ease: "power2.in"
            });
            
            // Fade out connections
            storageConnections.forEach(conn => {
                gsap.to(conn.material, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        scene.remove(conn);
                    }
                });
            });
            
            // Stop and remove particles
            storageParticles.forEach(flow => {
                flow.stop();
                const index = particles.indexOf(flow);
                if (index > -1) particles.splice(index, 1);
            });
            
            // Hide labels
            const mtc2redisLabel = document.getElementById('label-mtc2redis');
            const redisLabel = document.getElementById('label-redis');
            if (mtc2redisLabel) mtc2redisLabel.style.display = 'none';
            if (redisLabel) redisLabel.style.display = 'none';
            
            // Hide loading indicator
            setTimeout(() => {
                hideAnimationLoading();
            }, 2000);
        }
    });
    
    // Section 5: Anomaly Detection animation
    let anomalyConnections = [];
    let anomalyParticles = [];
    
    // Make these accessible to UI section
    window.anomalyConnections = anomalyConnections;
    window.anomalyParticles = anomalyParticles;
    
    createSectionTrigger({
        trigger: "#section-anomaly .narrative-content",
        start: "top top+=50",
        end: "bottom top",
        onEnter: () => {
            // Show loading indicator
            showAnimationLoading();
            
            // First, collapse all existing components into Redis
            const componentsToCollapse = [
                components.mazak, components.okuma, components.yourMachine,
                components.agent, components.mqtt, components.mtc2redis
            ];
            
            componentsToCollapse.forEach((comp, index) => {
                gsap.to(comp.position, {
                    x: components.redis.position.x,
                    y: components.redis.position.y,
                    z: components.redis.position.z,
                    duration: 1.5,
                    delay: index * 0.1,
                    ease: "power2.in",
                    onComplete: () => {
                        comp.visible = false;
                    }
                });
                
                gsap.to(comp.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1.5,
                    delay: index * 0.1,
                    ease: "power2.in"
                });
            });
            
            // Hide all previous labels including Redis
            ['label-mazak', 'label-okuma', 'label-your-machine', 'label-agent', 
             'label-mqtt', 'label-mtc2redis', 'label-redis'].forEach(id => {
                const label = document.getElementById(id);
                if (label) {
                    gsap.to(label, {
                        opacity: 0,
                        duration: 1,
                        onComplete: () => {
                            label.style.display = 'none';
                        }
                    });
                }
            });
            
            // Hide previous connections
            [...agentConnections, ...mqttConnections, ...storageConnections].forEach(conn => {
                if (conn) scene.remove(conn);
            });
            
            // Stop previous particles
            [...agentParticles, ...mqttParticles, ...storageParticles].forEach(flow => {
                flow.stop();
            });
            
            // After collapse, bring in anomaly components
            setTimeout(() => {
                // Move Redis to center and higher position
                gsap.to(components.redis.position, {
                    x: 0,
                    y: -6,
                    duration: 1,
                    ease: "power2.out"
                });
                
                // Animate anomaly components in below Redis
                gsap.to(components.mtc2anomaly.position, {
                    y: -10,
                    x: -4,
                    duration: 2,
                    delay: 0.5,
                    ease: "power2.out"
                });
                
                gsap.to(components.mtc2htm.position, {
                    y: -10,
                    x: 4,
                    duration: 2,
                    delay: 0.7,
                    ease: "power2.out"
                });
                
                // Create connections
                setTimeout(() => {
                    const redisToAnomaly = createConnection(
                        new THREE.Vector3(0, -6, 0),
                        new THREE.Vector3(-4, -10, 0),
                        0xf687b3
                    );
                    
                    const anomalyToHtm = createConnection(
                        new THREE.Vector3(-4, -10, 0),
                        new THREE.Vector3(4, -10, 0),
                        0xc4b5fd
                    );
                    
                    window.anomalyConnections = [redisToAnomaly, anomalyToHtm];
                    
                    gsap.to([redisToAnomaly.material, anomalyToHtm.material], {
                        opacity: 0.5,
                        duration: 1
                    });
                    
                    // Bidirectional particle flow
                    const toAnomalyFlow = new ParticleFlow(
                        new THREE.Vector3(0, -6, 0),
                        new THREE.Vector3(-4, -10, 0),
                        0xf687b3,
                        true
                    );
                    
                    const toHtmFlow = new ParticleFlow(
                        new THREE.Vector3(-4, -10, 0),
                        new THREE.Vector3(4, -10, 0),
                        0xc4b5fd,
                        true
                    );
                    
                    const fromHtmFlow = new ParticleFlow(
                        new THREE.Vector3(4, -10, 0),
                        new THREE.Vector3(-4, -10, 0),
                        0xa78bfa,
                        true
                    );
                    
                    const backToRedisFlow = new ParticleFlow(
                        new THREE.Vector3(-4, -10, 0),
                        new THREE.Vector3(0, -6, 0),
                        0xed64a6,
                        true
                    );
                    
                    window.anomalyParticles = [toAnomalyFlow, toHtmFlow, fromHtmFlow, backToRedisFlow];
                    particles.push(...window.anomalyParticles);
                    
                    toAnomalyFlow.start();
                    setTimeout(() => toHtmFlow.start(), 500);
                    setTimeout(() => fromHtmFlow.start(), 1000);
                    setTimeout(() => backToRedisFlow.start(), 1500);
                }, 1500);
                
                // Show labels
                setTimeout(() => {
                    showLabel('mtc2anomaly', components.mtc2anomaly);
                    showLabel('mtc2htm', components.mtc2htm);
                    
                    // Hide loading indicator (1.5 seconds later)
                    setTimeout(() => {
                        hideAnimationLoading();
                    }, 1500);
                }, 2000);
            }, 2000);
        },
        onLeaveBack: () => {
            // Show loading indicator
            showAnimationLoading();
            
            // Hide anomaly components
            gsap.to([components.mtc2anomaly.position, components.mtc2htm.position], {
                y: -40,
                duration: 2,
                ease: "power2.in"
            });
            
            // Remove connections and particles
            if (window.anomalyConnections) {
                window.anomalyConnections.forEach(conn => scene.remove(conn));
            }
            if (window.anomalyParticles) {
                window.anomalyParticles.forEach(flow => {
                    flow.stop();
                    const index = particles.indexOf(flow);
                    if (index > -1) particles.splice(index, 1);
                });
            }
            
            // Hide labels
            ['label-mtc2anomaly', 'label-mtc2htm'].forEach(id => {
                const label = document.getElementById(id);
                if (label) label.style.display = 'none';
            });
            
            // Restore all previous components
            setTimeout(() => {
                // Make all components visible
                components.mazak.visible = true;
                components.okuma.visible = true;
                components.yourMachine.visible = true;
                components.agent.visible = true;
                components.mqtt.visible = true;
                components.mtc2redis.visible = true;
                
                // Reset scales
                [components.mazak, components.okuma, components.yourMachine,
                 components.agent, components.mqtt, components.mtc2redis].forEach(comp => {
                    gsap.set(comp.scale, { x: 0, y: 0, z: 0 });
                });
                
                // Move Redis back to storage position
                gsap.to(components.redis.position, {
                    x: 3,
                    y: -9,
                    duration: 1,
                    ease: "power2.out"
                });
                
                // Animate all components growing from Redis position
                // First, position them at Redis location
                gsap.set(components.mazak.position, { x: 3, y: -9, z: 0 });
                gsap.set(components.okuma.position, { x: 3, y: -9, z: 0 });
                gsap.set(components.yourMachine.position, { x: 3, y: -9, z: 0 });
                gsap.set(components.agent.position, { x: 3, y: -9, z: 0 });
                gsap.set(components.mqtt.position, { x: 3, y: -9, z: 0 });
                gsap.set(components.mtc2redis.position, { x: 3, y: -9, z: 0 });
                
                // Animate to their original positions
                gsap.to(components.mazak.position, {
                    x: -4, y: 0, z: 0,
                    duration: 2,
                    delay: 0.1,
                    ease: "power2.out"
                });
                
                gsap.to(components.okuma.position, {
                    x: 0, y: 0, z: 0,
                    duration: 2,
                    delay: 0.2,
                    ease: "power2.out"
                });
                
                gsap.to(components.yourMachine.position, {
                    x: 4, y: 0, z: 0,
                    duration: 2,
                    delay: 0.3,
                    ease: "power2.out"
                });
                
                gsap.to(components.agent.position, {
                    x: 0, y: -3, z: 0,
                    duration: 2,
                    delay: 0.4,
                    ease: "power2.out"
                });
                
                gsap.to(components.mqtt.position, {
                    x: 0, y: -6, z: 0,
                    duration: 2,
                    delay: 0.5,
                    ease: "power2.out"
                });
                
                gsap.to(components.mtc2redis.position, {
                    x: -3, y: -9, z: 0,
                    duration: 2,
                    delay: 0.6,
                    ease: "power2.out"
                });
                
                // Animate scales
                [components.mazak, components.okuma, components.yourMachine,
                 components.agent, components.mqtt, components.mtc2redis].forEach((comp, index) => {
                    gsap.to(comp.scale, {
                        x: 1, y: 1, z: 1,
                        duration: 2,
                        delay: index * 0.1,
                        ease: "power2.out"
                    });
                });
                
                // Recreate connections
                setTimeout(() => {
                    // Recreate all connections
                    const mazakConnection = createConnection(
                        components.mazak.position,
                        new THREE.Vector3(0, -3, 0),
                        0x667eea
                    );
                    const okumaConnection = createConnection(
                        components.okuma.position,
                        new THREE.Vector3(0, -3, 0),
                        0x4fd1c5
                    );
                    agentConnections = [mazakConnection, okumaConnection];
                    
                    const agentToMqtt = createConnection(
                        new THREE.Vector3(0, -3, 0),
                        new THREE.Vector3(0, -6, 0),
                        0xfbd38d
                    );
                    mqttConnections = [agentToMqtt];
                    
                    const mqttToMtc2Redis = createConnection(
                        new THREE.Vector3(0, -6, 0),
                        new THREE.Vector3(-3, -9, 0),
                        0x68d391
                    );
                    const mtc2RedisToRedis = createConnection(
                        new THREE.Vector3(-3, -9, 0),
                        new THREE.Vector3(3, -9, 0),
                        0xfeb2b2
                    );
                    storageConnections = [mqttToMtc2Redis, mtc2RedisToRedis];
                    
                    // Fade in all connections
                    [...agentConnections, ...mqttConnections, ...storageConnections].forEach(conn => {
                        gsap.to(conn.material, {
                            opacity: 0.5,
                            duration: 1
                        });
                    });
                    
                    // Recreate particle flows
                    const mazakFlow = new ParticleFlow(
                        components.mazak.position,
                        new THREE.Vector3(0, -3, 0),
                        0x667eea,
                        false
                    );
                    const okumaFlow = new ParticleFlow(
                        components.okuma.position,
                        new THREE.Vector3(0, -3, 0),
                        0x4fd1c5,
                        false
                    );
                    agentParticles = [mazakFlow, okumaFlow];
                    
                    const mqttFlow = new ParticleFlow(
                        new THREE.Vector3(0, -3, 0),
                        new THREE.Vector3(0, -6, 0),
                        0xfbd38d,
                        true
                    );
                    mqttParticles = [mqttFlow];
                    
                    const brokerFlow = new ParticleFlow(
                        new THREE.Vector3(0, -6, 0),
                        new THREE.Vector3(-3, -9, 0),
                        0x68d391,
                        true
                    );
                    const storageFlow = new ParticleFlow(
                        new THREE.Vector3(-3, -9, 0),
                        new THREE.Vector3(3, -9, 0),
                        0xfeb2b2,
                        true
                    );
                    storageParticles = [brokerFlow, storageFlow];
                    
                    // Start all particles
                    [...agentParticles, ...mqttParticles, ...storageParticles].forEach(flow => {
                        particles.push(flow);
                        flow.start();
                    });
                }, 1500);
                
                // Show labels
                setTimeout(() => {
                    showLabel('mtc2redis', components.mtc2redis);
                    showLabel('redis', components.redis);
                    
                    // Hide loading indicator
                    setTimeout(() => {
                        hideAnimationLoading();
                    }, 1000);
                }, 2000);
            }, 500);
        }
    });
    
    // Section 6: UI visualization animation
    let uiConnections = [];
    let uiParticles = [];
    
    createSectionTrigger({
        trigger: "#section-ui .narrative-content",
        start: "top top+=50",
        end: "bottom top",
        onEnter: () => {
            // Show loading indicator
            showAnimationLoading();
            
            // Collapse anomaly components into Redis
            [components.mtc2anomaly, components.mtc2htm].forEach((comp, index) => {
                gsap.to(comp.position, {
                    x: 0,
                    y: -6,
                    z: 0,
                    duration: 1.5,
                    delay: index * 0.2,
                    ease: "power2.in",
                    onComplete: () => {
                        comp.visible = false;
                    }
                });
                
                gsap.to(comp.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1.5,
                    delay: index * 0.2,
                    ease: "power2.in"
                });
            });
            
            // Hide anomaly labels and Redis label
            ['label-mtc2anomaly', 'label-mtc2htm', 'label-redis'].forEach(id => {
                const label = document.getElementById(id);
                if (label) {
                    gsap.to(label, {
                        opacity: 0,
                        duration: 1,
                        onComplete: () => {
                            label.style.display = 'none';
                        }
                    });
                }
            });
            
            // Remove anomaly connections
            if (window.anomalyConnections) {
                window.anomalyConnections.forEach(conn => {
                    if (conn) scene.remove(conn);
                });
            }
            
            // Stop anomaly particles
            if (window.anomalyParticles) {
                window.anomalyParticles.forEach(flow => {
                    flow.stop();
                });
            }
            
            // After collapse, show UI
            setTimeout(() => {
                // Move Redis to optimal position
                gsap.to(components.redis.position, {
                    y: -6,
                    duration: 1,
                    ease: "power2.out"
                });
                
                // Animate UI component in
                gsap.to(components.mtc2ui.position, {
                    y: -10,
                    duration: 2,
                    delay: 0.5,
                    ease: "power2.out"
                });
                
                // Create connection
                setTimeout(() => {
                    const redisToUI = createConnection(
                        new THREE.Vector3(0, -6, 0),
                        new THREE.Vector3(0, -10, 0),
                        0x93c5fd
                    );
                    
                    uiConnections = [redisToUI];
                    
                    gsap.to(redisToUI.material, {
                        opacity: 0.5,
                        duration: 1
                    });
                    
                    // UI data flow
                    const uiFlow = new ParticleFlow(
                        new THREE.Vector3(0, -6, 0),
                        new THREE.Vector3(0, -10, 0),
                        0x93c5fd,
                        true
                    );
                    
                    uiParticles = [uiFlow];
                    particles.push(uiFlow);
                    uiFlow.start();
                }, 1000);
                
                // Show labels
                setTimeout(() => {
                    showLabel('mtc2ui', components.mtc2ui);
                    
                    // Hide loading indicator (500ms later)
                    setTimeout(() => {
                        hideAnimationLoading();
                    }, 500);
                }, 1500);
            }, 2000);
        },
        onLeaveBack: () => {
            // Show loading indicator
            showAnimationLoading();
            
            // Hide UI component
            gsap.to(components.mtc2ui.position, {
                y: -50,
                duration: 2,
                ease: "power2.in"
            });
            
            // Remove connections and particles
            uiConnections.forEach(conn => scene.remove(conn));
            uiParticles.forEach(flow => {
                flow.stop();
                const index = particles.indexOf(flow);
                if (index > -1) particles.splice(index, 1);
            });
            
            // Hide label
            const uiLabel = document.getElementById('label-mtc2ui');
            if (uiLabel) uiLabel.style.display = 'none';
            
            // Restore anomaly components
            setTimeout(() => {
                // Make anomaly components visible again
                components.mtc2anomaly.visible = true;
                components.mtc2htm.visible = true;
                
                // Start with scale 0
                gsap.set(components.mtc2anomaly.scale, { x: 0, y: 0, z: 0 });
                gsap.set(components.mtc2htm.scale, { x: 0, y: 0, z: 0 });
                
                // Move Redis back to anomaly position
                gsap.to(components.redis.position, {
                    y: -6,
                    duration: 1,
                    ease: "power2.out"
                });
                
                // Animate anomaly components back in with position
                gsap.to(components.mtc2anomaly.position, {
                    y: -10,
                    x: -4,
                    duration: 2,
                    ease: "power2.out"
                });
                
                gsap.to(components.mtc2htm.position, {
                    y: -10,
                    x: 4,
                    duration: 2,
                    delay: 0.2,
                    ease: "power2.out"
                });
                
                // Animate scale from 0 to 1
                gsap.to(components.mtc2anomaly.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 2,
                    ease: "power2.out"
                });
                
                gsap.to(components.mtc2htm.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 2,
                    delay: 0.2,
                    ease: "power2.out"
                });
                
                // Recreate connections
                setTimeout(() => {
                    const redisToAnomaly = createConnection(
                        new THREE.Vector3(0, -6, 0),
                        new THREE.Vector3(-4, -10, 0),
                        0xf687b3
                    );
                    
                    const anomalyToHtm = createConnection(
                        new THREE.Vector3(-4, -10, 0),
                        new THREE.Vector3(4, -10, 0),
                        0xc4b5fd
                    );
                    
                    window.anomalyConnections = [redisToAnomaly, anomalyToHtm];
                    
                    gsap.to([redisToAnomaly.material, anomalyToHtm.material], {
                        opacity: 0.5,
                        duration: 1
                    });
                    
                    // Restore particle flows
                    const toAnomalyFlow = new ParticleFlow(
                        new THREE.Vector3(0, -6, 0),
                        new THREE.Vector3(-4, -10, 0),
                        0xf687b3,
                        true
                    );
                    
                    const toHtmFlow = new ParticleFlow(
                        new THREE.Vector3(-4, -10, 0),
                        new THREE.Vector3(4, -10, 0),
                        0xc4b5fd,
                        true
                    );
                    
                    const fromHtmFlow = new ParticleFlow(
                        new THREE.Vector3(4, -10, 0),
                        new THREE.Vector3(-4, -10, 0),
                        0xa78bfa,
                        true
                    );
                    
                    const backToRedisFlow = new ParticleFlow(
                        new THREE.Vector3(-4, -10, 0),
                        new THREE.Vector3(0, -6, 0),
                        0xed64a6,
                        true
                    );
                    
                    window.anomalyParticles = [toAnomalyFlow, toHtmFlow, fromHtmFlow, backToRedisFlow];
                    particles.push(...window.anomalyParticles);
                    
                    toAnomalyFlow.start();
                    setTimeout(() => toHtmFlow.start(), 500);
                    setTimeout(() => fromHtmFlow.start(), 1000);
                    setTimeout(() => backToRedisFlow.start(), 1500);
                }, 800);
                
                // Show labels
                setTimeout(() => {
                    showLabel('mtc2anomaly', components.mtc2anomaly);
                    showLabel('mtc2htm', components.mtc2htm);
                    
                    // Hide loading indicator
                    setTimeout(() => {
                        hideAnimationLoading();
                    }, 1500);
                }, 1000);
            }, 500);
        }
    });
    
    // Show initial labels
    showLabel('mazak', components.mazak);
    showLabel('okuma', components.okuma);
    showLabel('your-machine', components.yourMachine);
}

// Show component label
function showLabel(id, mesh) {
    const label = document.getElementById(`label-${id}`);
    if (!label || !mesh) return;
    
    label.style.display = 'block';
    label.style.opacity = '0.7';
    
    // Update label position
    function updateLabelPosition() {
        const vector = new THREE.Vector3();
        mesh.getWorldPosition(vector);
        
        // Offset the label position below the object
        vector.y -= 1.5;
        vector.project(camera);
        
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
        
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
    }
    
    // Update position on scroll and render
    const updateLoop = () => {
        updateLabelPosition();
        requestAnimationFrame(updateLoop);
    };
    updateLoop();
}


// Initialize everything
window.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on page load/refresh
    window.scrollTo(0, 0);
    
    // Also handle if page was loaded with a hash
    if (window.location.hash) {
        window.location.hash = '';
    }
    
    // Small delay to ensure scroll happens after browser restores position
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);
    
    initThree();
    initScrollAnimations();
    animate();
});