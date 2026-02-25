// script.js - Version Anniversaire

document.addEventListener('DOMContentLoaded', () => {
    initConfettiCanvas();
    initMessageReveal();
    initCarousel();
    initWishesAnimation();
    initBirthdayTimer();
    initScrollAnimations();
});

// ===== CONFETTIS CANVAS =====
function initConfettiCanvas() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let confetti = [];
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initConfetti();
    }
    
    function initConfetti() {
        confetti = [];
        const count = Math.floor((width * height) / 5000);
        
        for (let i = 0; i < count; i++) {
            confetti.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 5 + 2,
                speedY: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                rotation: Math.random() * 360,
                color: `hsl(${Math.random() * 30 + 340}, 70%, 70%)` // Roses et dorés
            });
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        confetti.forEach(c => {
            c.y += c.speedY * 0.5;
            c.x += c.speedX;
            c.rotation += 0.5;
            
            if (c.y > height) {
                c.y = -c.size;
                c.x = Math.random() * width;
            }
            
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation * Math.PI / 180);
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.size/2, -c.size/2, c.size, c.size/2);
            ctx.restore();
        });
        
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', resize);
    resize();
    animate();
}

// ===== MESSAGE RÉVÉLATION =====
function initMessageReveal() {
    const revealBtn = document.getElementById('revealBtn');
    const secretMessage = document.getElementById('secretMessage');
    
    if (!revealBtn || !secretMessage) return;
    
    revealBtn.addEventListener('click', () => {
        secretMessage.classList.toggle('show');
        
        if (secretMessage.classList.contains('show')) {
            revealBtn.querySelector('.btn-text').textContent = 'Cacher';
        } else {
            revealBtn.querySelector('.btn-text').textContent = 'Un mot pour toi';
        }
    });
}

// ===== CARROUSEL D'IMAGES =====
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    const captionElement = document.getElementById('carouselCaption');
    
    if (!track) return;
    
    // Configuration des images
    const images = [
        { src: 'image/1.jpg', caption: '' },
        { src: 'image/2.jpg', caption: '' },
        { src: 'image/3.jpg', caption: '' },
        { src: 'image/4.jpg', caption: '' },
        { src: 'image/5.jpg', caption: '' }
    ];
    
    let currentIndex = 0;
    let autoPlayInterval;
    
    // Créer les slides
    images.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.dataset.index = index;
        slide.dataset.caption = img.caption;
        
        const imgElement = document.createElement('img');
        imgElement.src = img.src;
        imgElement.alt = `Souvenir ${index + 1}`;
        imgElement.onerror = () => {
            // Image de remplacement si le fichier n'existe pas
            imgElement.src = 'https://via.placeholder.com/800x600/d4a5a5/ffffff?text=Souvenir+' + (index + 1);
        };
        
        slide.appendChild(imgElement);
        track.appendChild(slide);
    });
    
    // Créer les dots
    images.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Mise à jour de l'affichage
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Mettre à jour les dots
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Mettre à jour la légende
        if (captionElement) {
            captionElement.textContent = images[currentIndex].caption;
            captionElement.style.opacity = '0';
            setTimeout(() => {
                captionElement.style.opacity = '1';
            }, 50);
        }
    }
    
    // Navigation
    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetAutoPlay();
    }
    
    // Auto-play toutes les 2.5 secondes
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 2500);
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    // Événements
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }
    
    // Pause auto-play au survol
    track.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    track.addEventListener('mouseleave', () => {
        startAutoPlay();
    });
    
    // Initialisation
    updateCarousel();
    startAutoPlay();
}

// ===== ANIMATION DES VŒUX =====
function initWishesAnimation() {
    const wishCards = document.querySelectorAll('.wish-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s forwards';
            }
        });
    }, { threshold: 0.3 });
    
    wishCards.forEach(card => {
        observer.observe(card);
    });
}

// ===== COMPTEUR ANNIVERSAIRE =====
function initBirthdayTimer() {
    const timerElement = document.getElementById('birthdayTimer');
    if (!timerElement) return;
    
    function updateTimer() {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        
        const diff = now - startOfDay;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        timerElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// ===== ANIMATIONS AU SCROLL =====
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s, transform 0.6s';
        observer.observe(section);
    });
}

// ===== NAVIGATION ACTIVE =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== SCROLL DOUX =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});