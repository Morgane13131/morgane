let releases = [];

const platformIcons = {
    spotify: 'fab fa-spotify',
    deezer: 'fab fa-deezer',
    youtube: 'fab fa-youtube',
    apple: 'fab fa-apple',
    soundcloud: 'fab fa-soundcloud',
    tiktok: 'fab fa-tiktok',
    instagram: 'fab fa-instagram'
};

const platformLabels = {
    spotify: 'Spotify',
    deezer: 'Deezer',
    youtube: 'YouTube',
    apple: 'Apple Music',
    soundcloud: 'SoundCloud',
    tiktok: 'TikTok',
    instagram: 'Instagram'
};

const socialPlatforms = {
    spotify: 'https://open.spotify.com/intl-fr/artist/6a33TynljhV7QMa57EpWaW',
    deezer: 'https://link.deezer.com/s/31AvajAoGuZqBhzoPx6vh',
    youtube: 'https://www.youtube.com/channel/UCY4shSUWwNGPQAl6O5G2D5w',
    apple: 'https://music.apple.com/us/artist/morgane/1851618524',
    soundcloud: 'https://on.soundcloud.com/HSD1lmw4KfbdbvU58m',
    tiktok: 'https://www.tiktok.com/@jade._345',
    instagram: 'https://www.instagram.com/jade._morgane'
};

document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    initParticles();
    initStars();
    
    let path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
    console.log('[ROUTING] Initial path:', window.location.pathname, '-> cleaned:', path);
    
    if (socialPlatforms[path]) {
        console.log('[ROUTING] Redirecting to social platform:', socialPlatforms[path]);
        window.location.href = socialPlatforms[path];
        return;
    }
    
    const isReleaseRoute = path && path !== '';
    if (isReleaseRoute) {
        console.log('[ROUTING] Release route detected:', path);
        sessionStorage.setItem('pendingReleaseSlug', path);
        window.history.replaceState({}, '', '/');
    }
    
    loadReleases();
    const emailWrapper = document.getElementById('email-wrapper');
    const emailText = document.getElementById('email-text');
    const copyFeedback = document.getElementById('copy-feedback');
    
    if (emailWrapper && emailText) {
        emailWrapper.addEventListener('click', function(e) {
            const email = emailText.textContent;
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    showCopyFeedback();
                }).catch(() => {
                    fallbackCopyTextToClipboard(email);
                });
            } else {
                fallbackCopyTextToClipboard(email);
            }
        });
    }

    function showCopyFeedback() {
        if (copyFeedback) {
            copyFeedback.classList.add('show');
            setTimeout(() => {
                copyFeedback.classList.remove('show');
            }, 1500);
        }
    }

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback();
        } catch (err) {
            console.error('Fallback: Could not copy text', err);
        }
        
        document.body.removeChild(textArea);
    }

    const linkCards = document.querySelectorAll('.link-card');
    linkCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const platform = this.getAttribute('data-platform');
            console.log(`Clicked on ${platform}`);
        });
    });

    const cards = document.querySelectorAll('.link-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });

    animateOnLoad('.releases-section', 200);
    animateOnLoad('.section-title', 250);
    animateOnLoad('.email-section', 400);
    animateOnLoad('.footer', 450);
});

function animateOnLoad(selector, delay = 0) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
            element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay + (index * 50));
    });
}

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 25 : 50;
    
    class Particle {
        constructor() {
            this.reset();
            const colors = [
                [59, 90, 143],
                [45, 74, 122],
                [212, 212, 106]
            ];
            this.colorIndex = Math.floor(Math.random() * colors.length);
            this.color = colors[this.colorIndex];
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.2 + 0.1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = 0.04 * (1 - distance / 100);
                    ctx.strokeStyle = `rgba(${particles[i].color[0]}, ${particles[i].color[1]}, ${particles[i].color[2]}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles.forEach(p => {
            if (p.x > canvas.width) p.x = canvas.width;
            if (p.y > canvas.height) p.y = canvas.height;
        });
    });
}

function initStars() {
    const container = document.querySelector('.stars-container');
    if (!container) return;
    
    const isMobile = window.innerWidth <= 768;
    const starCount = isMobile ? 50 : 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(star);
    }
}

async function loadReleases() {
    const releasesGrid = document.getElementById('releases-grid');
    if (!releasesGrid) {
        console.error('Releases grid not found');
        return Promise.resolve();
    }
    
    releasesGrid.innerHTML = '';
    
    try {
        const response = await fetch('Melusine/infos.json?t=' + Date.now());
        if (!response.ok) {
            console.error('Failed to load releases:', response.status);
            console.error('Make sure you are running a local server (python -m http.server 8000)');
            return Promise.resolve();
        }
        const melusineData = await response.json();
        
        if (!melusineData.cover || !melusineData.title) {
            console.error('Invalid release data:', melusineData);
            return Promise.resolve();
        }
        
        melusineData.cover = `Melusine/${melusineData.cover}`;
        releases = [melusineData];
        
        console.log('Loaded releases:', releases);
        initReleases();
        
        return Promise.resolve().then(() => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 100);
            });
        });
    } catch (error) {
        console.error('Error loading releases:', error);
        console.error('This might be a CORS issue. Make sure you are running a local server.');
        return Promise.resolve();
    }
}

let openModalFunction = null;

function initReleases() {
    const releasesGrid = document.getElementById('releases-grid');
    const releaseModal = document.getElementById('release-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalCoverImg = document.getElementById('modal-cover-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPlatforms = document.getElementById('modal-platforms');

    if (!releasesGrid) {
        console.error('Releases grid not found');
        return;
    }

    releasesGrid.innerHTML = '';

    if (releases.length === 0) {
        console.warn('No releases to display');
        return;
    }

    releases.forEach((release, index) => {
        if (!release || !release.title || !release.cover) {
            console.warn('Invalid release:', release);
            return;
        }

        const releaseCard = document.createElement('div');
        releaseCard.className = 'release-card';
        releaseCard.style.opacity = '0';
        releaseCard.style.transform = 'translateY(20px)';
        
        const img = document.createElement('img');
        img.src = release.cover;
        img.alt = release.title;
        img.loading = 'lazy';
        img.onerror = function() {
            console.error('Failed to load image:', release.cover);
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: rgba(255, 255, 255, 0.3); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;';
            placeholder.textContent = 'No Image';
            releaseCard.appendChild(placeholder);
        };
        
        img.onload = function() {
            console.log('Image loaded successfully:', release.cover);
        };
        
        releaseCard.appendChild(img);
        releaseCard.addEventListener('click', () => {
            openModal(release);
        });
        
        releasesGrid.appendChild(releaseCard);

        setTimeout(() => {
            releaseCard.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            releaseCard.style.opacity = '1';
            releaseCard.style.transform = 'translateY(0)';
        }, 300 + (index * 50));
    });

    function openModal(release) {
        if (!releaseModal || !modalCoverImg || !modalTitle || !modalPlatforms) return;

        modalCoverImg.src = release.cover;
        modalCoverImg.alt = release.title;
        modalTitle.textContent = release.title;

        modalPlatforms.innerHTML = '';

        Object.keys(release.platforms).forEach(platform => {
            const platformLink = document.createElement('a');
            platformLink.href = release.platforms[platform];
            platformLink.target = '_blank';
            platformLink.rel = 'noopener noreferrer';
            platformLink.className = 'modal-platform-link';
            platformLink.setAttribute('data-platform', platform);
            
            const icon = document.createElement('i');
            icon.className = platformIcons[platform];
            
            const label = document.createElement('span');
            label.textContent = platformLabels[platform] || platform;
            
            platformLink.appendChild(icon);
            platformLink.appendChild(label);
            modalPlatforms.appendChild(platformLink);
        });

        releaseModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!releaseModal) return;
        releaseModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && releaseModal && releaseModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    openModalFunction = openModal;
    
    const pendingReleaseSlug = sessionStorage.getItem('pendingReleaseSlug');
    console.log('[MODAL] Checking for pending release slug:', pendingReleaseSlug);
    console.log('[MODAL] Available releases:', releases.map(r => r.title));
    console.log('[MODAL] openModalFunction defined:', !!openModalFunction);
    
    if (pendingReleaseSlug && openModalFunction) {
        sessionStorage.removeItem('pendingReleaseSlug');
        const release = releases.find(r => {
            const titleLower = r.title.toLowerCase();
            const slugLower = pendingReleaseSlug.toLowerCase();
            const match = titleLower === slugLower || 
                         titleLower.replace(/\s+/g, '-') === slugLower ||
                         titleLower === slugLower.replace(/-/g, ' ');
            if (match) {
                console.log('[MODAL] Found matching release:', r.title);
            }
            return match;
        });
        
        if (release) {
            console.log('[MODAL] Opening modal for release:', release.title);
            setTimeout(() => {
                openModalFunction(release);
            }, 200);
        } else {
            console.error('[MODAL] No matching release found for slug:', pendingReleaseSlug);
        }
    }
}

