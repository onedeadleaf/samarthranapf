// Import Three.js libraries from reliable CDN
import * as THREE from 'https://esm.sh/three@0.156.0';
import { OrbitControls } from 'https://esm.sh/three@0.156.0/examples/jsm/controls/OrbitControls.js';

/* ------------------------------------------------------------
   1. Dynamic Initialization (Runs when the page is loaded)
------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    setupModalLogic();
    setupTabLogic();
    setupTextAnimation();
    setupScrollReveal();
    setupVideoControl();
    setupMouseTrail();
});

/* ------------------------------------------------------------
   2. Subpage Content (The Project Details)
------------------------------------------------------------ */

// --- A. Fine Arts Gallery Content ---
const getFineArtsContent = () => {
    return `
        <h4 class="text-accent">Hyperrealism and Shading Studies</h4>
        <p>This gallery showcases my mastery of light, shadow, and texture across various mediums, from graphite to digital painting.</p>
        
        <div class="modal-gallery">
            <div class="gallery-item">
                <img src="assets/images/placeholder-fineart-1.jpg" alt="Graphite Portrait Study">
            </div>
            <div class="gallery-item">
                <img src="assets/images/placeholder-fineart-2.jpg" alt="Digital Shading Study">
            </div>
            <div class="gallery-item">
                <img src="assets/images/placeholder-fineart-3.jpg" alt="Hyperrealistic Eye Detail">
            </div>
            <div class="gallery-item">
                <img src="assets/images/placeholder-fineart-4.jpg" alt="Charcoal Figure Drawing">
            </div>
        </div>
        <p style="margin-top: 1rem; color: var(--red-400);">**Note:** Update image paths in assets/images with your actual artwork.</p>
    `;
};

// --- B. Video Editing Projects Content ---
const getVideoEditingContent = () => {
    // Placeholder for your actual Instagram Reel embed code or links
    const instagramEmbedCode = `
        <div class="video-embed-container" style="max-width: 400px; margin: 0 auto;">
            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>
        </div>
        <p class="text-center" style="margin-top: 1rem;">This is a placeholder video. You can embed your **Instagram Reels** directly here using their embed code, or link out to YouTube/Vimeo.</p>
        <p class="text-center"><a href="https://www.instagram.com/your_reel_page" target="_blank" class="btn btn-outline" style="margin-top: 1rem;">Visit My Instagram Reels Page &rarr;</a></p>
    `;

    return `
        <h4 class="text-accent">Dynamic Short-Form Content</h4>
        <p>Showcasing editing, motion tracking, and sound design skills for social and commercial campaigns.</p>
        ${instagramEmbedCode}
    `;
};

// --- C. General Content Resolver ---
const getSubpageContent = (id) => {
    switch (id) {
        case 'fine-arts':
            return getFineArtsContent();
        case 'video-editing':
            return getVideoEditingContent();
        case 'colored-works':
            return '<h4>Vibrant Digital Illustrations</h4><p>Details on color palettes, mood, and digital mediums used for this set of works will go here. You can use the same modal-gallery grid here!</p>';
        case 'product-design':
            return '<h4>Industrial Design Case Study: Project X</h4><p>Detailed breakdown of concept ideation, CAD development, material selection, and DFM principles. Include renderings here.</p>';
        case 'motion-graphics':
            return '<h4>VFX & Animation Breakdown</h4><p>This area will feature embedded YouTube/Vimeo links showing the final motion pieces, along with a text breakdown of the software and effects used.</p>';
        default:
            return '<p>Content not found. Please check the project ID.</p>';
    }
};

/* ------------------------------------------------------------
   3. Modal/Pop-up Logic
------------------------------------------------------------ */
const setupModalLogic = () => {
    const modalContainer = document.getElementById('modal-container');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const viewButtons = document.querySelectorAll('.view-button');
    const closeButton = modalContainer.querySelector('.close-button');

    const openModal = (cardId, title) => {
        modalTitle.textContent = title;
        modalBody.innerHTML = getSubpageContent(cardId); // Load dynamic content here
        
        modalContainer.style.display = 'block';
        setTimeout(() => {
            modalContainer.style.opacity = '1';
            modalContainer.querySelector('.modal-content').style.transform = 'translateY(0)';
        }, 10);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalContainer.style.opacity = '0';
        modalContainer.querySelector('.modal-content').style.transform = 'translateY(-50px)';
        setTimeout(() => {
            modalContainer.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
    };

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.work-card');
            const cardId = card.dataset.cardId;
            const cardTitle = card.dataset.cardTitle;
            openModal(cardId, cardTitle);
        });
    });

    closeButton.addEventListener('click', closeModal);
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
};

/* ------------------------------------------------------------
   4. Tab Switching Logic
------------------------------------------------------------ */
let scene, camera, renderer, controls, model, container;
const ACCENT_COLOR_1 = 0xD8005A; // Vivid Magenta
const ACCENT_COLOR_2 = 0xEF90BE; // Radiant Pink
let is3DInitialized = false;

const init3D = () => {
    if (is3DInitialized) return;
    container = document.getElementById('canvas-container');
    if (!container || !window.WebGLRenderingContext) {
        document.getElementById('canvas-fallback').style.display = 'block';
        return;
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(ACCENT_COLOR_1, 3);
    spotLight.position.set(5, 5, 5);
    scene.add(spotLight);
    
    const rimLight = new THREE.PointLight(ACCENT_COLOR_2, 1.5);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);

    // Placeholder Geometric Shape (Torus Knot)
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x3B1B1B, // Dark Ruby
        roughness: 0.2,
        metalness: 0.9,
    });
    model = new THREE.Mesh(geometry, material);
    scene.add(model);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;

    // Interaction: Click to change material color
    renderer.domElement.addEventListener('click', () => {
        if (model && model.material) {
            const currentColor = model.material.color.getHex();
            const newColor = currentColor === 0x3B1B1B ? ACCENT_COLOR_1 : 0x3B1B1B;
            model.material.color.setHex(newColor);
        }
    });

    const animate = () => {
        requestAnimationFrame(animate);
        if (model) {
            model.rotation.y += 0.005;
        }
        controls.update();
        renderer.render(scene, camera);
    };

    animate();
    is3DInitialized = true;
    window.addEventListener('resize', onWindowResize);
};

const onWindowResize = () => {
    if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
};

const setupTabLogic = () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.dataset.tab;

            // Deactivate all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activate clicked button and target content
            button.classList.add('active');
            document.getElementById(targetTabId).classList.add('active');
            
            // Special handling for the 3D tab: only initialize Three.js when needed
            if (targetTabId === '3d-models' && !is3DInitialized) {
                init3D();
            }
        });
    });
    
    // Initialize 3D on page load if the 3D tab is the active one (default)
    if (document.querySelector('.tab-button.active')?.dataset.tab === '3d-models') {
        init3D();
    }
};

/* ------------------------------------------------------------
   5. Dynamic Text Animation (Word Switching)
------------------------------------------------------------ */
const setupTextAnimation = () => {
    const headline = document.querySelector('.animated-text');
    if (!headline) return;

    const words = headline.dataset.animatedWords.split(',');
    const targetElement = headline.querySelector('.word-switcher:last-child');
    let wordIndex = 0;

    const switchWord = () => {
        if (!targetElement) return;

        wordIndex = (wordIndex + 1) % words.length;
        const nextWord = words[wordIndex].trim();
        
        // Simple text replacement with a timing delay for visual effect
        setTimeout(() => {
            targetElement.textContent = nextWord;
        }, 1500); 
    };

    // The timing ensures the text change happens during the visual float/glow effect
    setInterval(switchWord, 4000); 
};

/* ------------------------------------------------------------
   6. Scroll Reveal (Entrance Animations)
------------------------------------------------------------ */
const setupScrollReveal = () => {
    const setupObserver = (selector, className, delay = 0) => {
        const elements = document.querySelectorAll(selector);
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add(className);
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        elements.forEach(el => {
            el.classList.add('hidden-reveal');
            observer.observe(el);
        });
    };

    // Apply reveal to work cards (staggered entrance)
    setupObserver('.work-card:nth-child(1)', 'visible-reveal', 0);
    setupObserver('.work-card:nth-child(2)', 'visible-reveal', 150);
    setupObserver('.work-card:nth-child(3)', 'visible-reveal', 300);
    setupObserver('.work-card:nth-child(4)', 'visible-reveal', 450);
    setupObserver('.work-card:nth-child(5)', 'visible-reveal', 600);
    
    // Apply reveal to process steps within the new tab structure
    setupObserver('.process-steps li', 'visible-reveal', 100);
};

/* ------------------------------------------------------------
   7. Video Control & Mouse Trail
------------------------------------------------------------ */
const setupVideoControl = () => {
    const video = document.getElementById('hero-video');
    const videoBtn = document.getElementById('video-toggle');

    if (!video || !videoBtn) {
        console.warn('Video or video button not found');
        return;
    }

    // Ensure video starts paused (poster will be visible)
    video.pause();
    
    // Set initial button text
    videoBtn.textContent = "Play Video";
    videoBtn.setAttribute('aria-label', 'Play background video');

    // Update button text based on video state
    const updateButtonText = () => {
        if (video.paused) {
            videoBtn.textContent = "Play Video";
            videoBtn.setAttribute('aria-label', 'Play background video');
        } else {
            videoBtn.textContent = "Pause Video";
            videoBtn.setAttribute('aria-label', 'Pause background video');
        }
    };

    // Handle play/pause toggle
    videoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            if (video.paused) {
                // Play video - this will hide the poster
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Video playing');
                            updateButtonText();
                        })
                        .catch(error => {
                            console.error('Error playing video:', error);
                        });
                }
            } else {
                // Pause video - poster will show again
                video.pause();
                console.log('Video paused');
                updateButtonText();
            }
        } catch (error) {
            console.error('Error toggling video:', error);
        }
    });

    // Update button text when video state changes
    video.addEventListener('play', updateButtonText);
    video.addEventListener('pause', updateButtonText);
    video.addEventListener('ended', () => {
        // Video ended, but loop should restart automatically
        updateButtonText();
    });
};

const setupMouseTrail = () => {
    const container = document.getElementById('mouse-trail-container');
    if (!container || window.innerWidth < 768) return;

    const createDot = (x, y) => {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        container.appendChild(dot);

        setTimeout(() => {
            dot.style.opacity = '0';
            dot.style.transform = 'scale(0.5)';
            setTimeout(() => dot.remove(), 500);
        }, 100);
    };

    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.6) {
            createDot(e.clientX, e.clientY);
        }
    });
};