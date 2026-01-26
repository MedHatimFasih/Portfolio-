// Variables globales
let stars, moon, mountains3, mountains4, river, boat;
let lastScrollY = 0;
let ticking = false;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les éléments du parallaxe
    stars = document.getElementById('stars');
    moon = document.getElementById('moon');
    mountains3 = document.getElementById('mountains3');
    mountains4 = document.getElementById('mountains4');
    river = document.getElementById('river');
    boat = document.getElementById('boat');
    
    // Initialiser les composants
    initMobileMenu();
    initParallax();
    initThemeToggle();
    initBackToTop();
    initScrollAnimations();
    initSmoothScroll();
    initDownloadCV();
    initContactForm();
    
    // Mettre à jour l'année dans le footer
    updateFooterYear();
});

// Menu mobile
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
        
        // Fermer le menu en cliquant sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });
    }
}

// Effet parallaxe optimisé
function initParallax() {
    window.addEventListener('scroll', function() {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateParallax(lastScrollY);
                updateHeader();
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateParallax(scrollY) {
    const elements = {
        stars: { element: stars, multiplier: 0.5 },
        moon: { element: moon, multiplier: 1.5 },
        mountains3: { element: mountains3, multiplier: 0.8 },
        mountains4: { element: mountains4, multiplier: 0.6 },
        river: { element: river, multiplier: 0.4 },
        boat: { element: boat, multiplier: 1.2 }
    };
    
    Object.keys(elements).forEach(key => {
        const { element, multiplier } = elements[key];
        if (element) {
            const value = scrollY * multiplier;
            
            switch(key) {
                case 'stars':
                case 'mountains3':
                case 'mountains4':
                    element.style.transform = `translateY(${value * 0.5}px)`;
                    break;
                case 'moon':
                    element.style.transform = `translateY(${value * 0.8}px)`;
                    break;
                case 'river':
                    element.style.transform = `translateY(${value * 0.3}px)`;
                    break;
                case 'boat':
                    element.style.transform = `translateY(${value * 0.2}px) translateX(${value * 3}px)`;
                    break;
            }
        }
    });
    
    // Animation du titre
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const titleSize = Math.max(32, 56 - scrollY * 0.1);
        heroTitle.style.fontSize = `${titleSize}px`;
        heroTitle.style.opacity = Math.max(0, 1 - scrollY * 0.002);
    }
    
    // Animation du sous-titre
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.style.opacity = Math.max(0, 1 - scrollY * 0.002);
    }
}

// Header scroll effect - Amélioré
function updateHeader() {
    const header = document.querySelector('header');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Navigation active au scroll
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    const scrollY = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Toggle theme sombre/clair
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (!themeToggle || !themeIcon) return;
    
    // Vérifier le thème sauvegardé ou la préférence système
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animation au scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animation spécifique pour les barres de compétences
                if (entry.target.classList.contains('skill-item')) {
                    const skillBar = entry.target.querySelector('.skill-bar');
                    if (skillBar) {
                        const width = skillBar.style.width;
                        skillBar.style.width = '0';
                        setTimeout(() => {
                            skillBar.style.width = width;
                        }, 100);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    document.querySelectorAll('.about-card, .project-card, .timeline-item, .skill-item, .education-card, .cert-card, .contact-card').forEach(el => {
        observer.observe(el);
    });
}

// Navigation fluide
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Fermer le menu mobile si ouvert
                const navLinks = document.getElementById('navLinks');
                const menuToggle = document.getElementById('menuToggle');
                
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (menuToggle) {
                        const icon = menuToggle.querySelector('i');
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
                
                // Scroll vers la section
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Mettre à jour la navigation active
                setTimeout(() => {
                    updateActiveNav();
                }, 500);
            }
        });
    });
}

// Téléchargement du CV
function initDownloadCV() {
    const downloadBtn = document.getElementById('downloadCV');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Créer un lien temporaire pour le téléchargement
            const link = document.createElement('a');
            link.href = 'CV_Ahmed_Hatim_Fasih.pdf';
            link.download = 'CV_Ahmed_Hatim_Fasih.pdf';
            document.body.appendChild(link);
            
            try {
                link.click();
            } catch (error) {
                console.error('Erreur lors du téléchargement:', error);
                alert('Le fichier CV n\'a pas pu être téléchargé. Veuillez vérifier que le fichier "CV_Ahmed_Hatim_Fasih.pdf" existe dans le dossier racine.');
            }
            
            document.body.removeChild(link);
        });
    }
}

// Formulaire de contact
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!contactForm || !formMessage) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs du formulaire
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validation simple
        if (!name || !email || !message) {
            showFormMessage('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        // Simuler l'envoi du message
        showFormMessage('Envoi du message en cours...', 'success');
        
        // Simulation d'envoi réussi
        setTimeout(() => {
            // Dans un cas réel, vous enverriez les données à un serveur
            // Pour l'instant, on simule juste un envoi réussi
            
            // Récupérer l'adresse email du portfolio
            const portfolioEmail = 'hatimfasih2005@gmail.com';
            
            // Créer le lien mailto
            const subject = encodeURIComponent(`Message depuis le portfolio - ${name}`);
            const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:${portfolioEmail}?subject=${subject}&body=${body}`;
            
            // Ouvrir le client de messagerie par défaut
            window.location.href = mailtoLink;
            
            showFormMessage('Merci ! Votre message a été envoyé. Vous allez être redirigé vers votre client de messagerie.', 'success');
            
            // Réinitialiser le formulaire
            contactForm.reset();
        }, 1000);
    });
}

function showFormMessage(text, type) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;
    
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Masquer le message après 5 secondes
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mettre à jour l'année dans le footer
function updateFooterYear() {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `&copy; ${currentYear} Ahmed Hatim Fasih. Tous droits réservés.`;
    }
}

// Gestionnaire d'erreurs pour les images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/400x300/200016/ffffff?text=Image+non+disponible';
        this.alt = 'Image non disponible';
    });
});

// Initialiser la navigation active au chargement
updateActiveNav();