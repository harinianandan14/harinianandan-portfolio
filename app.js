// DOM Elements
let themeToggle;
let body;
let navLinks;
let skillBars;

// Theme Management (without localStorage as per strict instructions)
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupElements();
                this.setTheme(this.currentTheme);
                this.bindEvents();
            });
        } else {
            this.setupElements();
            this.setTheme(this.currentTheme);
            this.bindEvents();
        }
    }

    setupElements() {
        themeToggle = document.getElementById('themeToggle');
        body = document.body;
        
        if (!themeToggle) {
            console.error('Theme toggle button not found');
            return;
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-color-scheme', theme);
        
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'fas fa-sun';
                    themeToggle.setAttribute('aria-label', 'Switch to light mode');
                } else {
                    icon.className = 'fas fa-moon';
                    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
                }
            }
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add smooth transition effect
        document.documentElement.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }

    bindEvents() {
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, texts, typeSpeed = 100, deleteSpeed = 50, delayBetween = 2000) {
        this.element = element;
        this.texts = texts;
        this.typeSpeed = typeSpeed;
        this.deleteSpeed = deleteSpeed;
        this.delayBetween = delayBetween;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (!this.element) return;
        this.element.innerHTML = '<span class="typing-cursor">|</span>';
        setTimeout(() => this.type(), 1000);
    }

    type() {
        if (!this.element) return;
        
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.currentCharIndex--;
        } else {
            this.currentCharIndex++;
        }

        const displayText = currentText.substring(0, this.currentCharIndex);
        this.element.innerHTML = `${displayText}<span class="typing-cursor">|</span>`;

        let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            speed = this.delayBetween;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            speed = 500;
        }

        setTimeout(() => this.type(), speed);
    }
}

// Smooth Scrolling Navigation
class Navigation {
    constructor() {
        this.sections = [];
        this.navLinks = [];
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupElements();
                this.bindEvents();
                this.highlightActiveSection();
            });
        } else {
            this.setupElements();
            this.bindEvents();
            this.highlightActiveSection();
        }
        
        window.addEventListener('scroll', () => this.highlightActiveSection());
    }

    setupElements() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        navLinks = this.navLinks; // Set global reference
    }

    bindEvents() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    const offsetTop = targetSection.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                if (navMenu && navMenu.classList.contains('mobile-menu-open')) {
                    navMenu.classList.remove('mobile-menu-open');
                    if (mobileMenuBtn) {
                        const icon = mobileMenuBtn.querySelector('i');
                        if (icon) {
                            icon.className = 'fas fa-bars';
                        }
                    }
                }
            });
        });
    }

    highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Skill Bar Animation
class SkillBarAnimator {
    constructor() {
        this.skillBars = [];
        this.animated = new Set();
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupElements();
                this.bindScrollEvent();
            });
        } else {
            this.setupElements();
            this.bindScrollEvent();
        }
    }

    setupElements() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        skillBars = this.skillBars; // Set global reference
    }

    bindScrollEvent() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateSkillBar(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });

        this.skillBars.forEach(bar => observer.observe(bar));
    }

    animateSkillBar(skillBar) {
        const progress = skillBar.getAttribute('data-progress');
        let currentProgress = 0;
        const increment = progress / 60;
        
        const animate = () => {
            currentProgress += increment;
            if (currentProgress >= progress) {
                currentProgress = progress;
                skillBar.style.width = `${currentProgress}%`;
                
                // Add percentage text
                const skillName = skillBar.parentElement.previousElementSibling;
                if (skillName) {
                    const existingPercentage = skillName.querySelector('.percentage');
                    if (!existingPercentage) {
                        const percentageSpan = document.createElement('span');
                        percentageSpan.className = 'percentage';
                        percentageSpan.textContent = `${progress}%`;
                        percentageSpan.style.color = 'var(--color-primary)';
                        percentageSpan.style.fontWeight = 'var(--font-weight-semibold)';
                        skillName.appendChild(percentageSpan);
                    }
                }
                return;
            }
            
            skillBar.style.width = `${currentProgress}%`;
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupElements();
                this.addFadeInClass();
                this.bindScrollEvent();
            });
        } else {
            this.setupElements();
            this.addFadeInClass();
            this.bindScrollEvent();
        }
    }

    setupElements() {
        this.elements = document.querySelectorAll('.card, .stat-item');
    }

    addFadeInClass() {
        this.elements.forEach(element => {
            if (!element.classList.contains('fade-in')) {
                element.classList.add('fade-in');
            }
        });
    }

    bindScrollEvent() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add staggered animation for grid items
                    if (entry.target.parentElement.classList.contains('projects-grid') ||
                        entry.target.parentElement.classList.contains('certifications-grid') ||
                        entry.target.parentElement.classList.contains('about-stats')) {
                        const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
                        entry.target.style.transitionDelay = `${delay}ms`;
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(element => observer.observe(element));
    }
}

// Mobile Menu
class MobileMenu {
    constructor() {
        this.mobileMenuBtn = null;
        this.navMenu = null;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createMobileMenu();
                this.setupElements();
                this.bindEvents();
            });
        } else {
            this.createMobileMenu();
            this.setupElements();
            this.bindEvents();
        }
    }

    createMobileMenu() {
        // Check if mobile menu button already exists
        if (document.querySelector('.mobile-menu-btn')) {
            return;
        }

        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.setAttribute('aria-label', 'Toggle mobile menu');

        // Insert mobile menu button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle && themeToggle.parentNode) {
            themeToggle.parentNode.insertBefore(mobileMenuBtn, themeToggle);
        }
    }

    setupElements() {
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
    }

    bindEvents() {
        // Show mobile menu button on small screens
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        this.handleScreenChange(mediaQuery);
        mediaQuery.addEventListener('change', (e) => this.handleScreenChange(e));

        // Toggle mobile menu
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                if (this.navMenu) {
                    this.navMenu.classList.toggle('mobile-menu-open');
                    const icon = this.mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.className = this.navMenu.classList.contains('mobile-menu-open') 
                            ? 'fas fa-times' 
                            : 'fas fa-bars';
                    }
                }
            });
        }
    }

    handleScreenChange(mediaQuery) {
        if (mediaQuery.matches) {
            if (this.mobileMenuBtn) {
                this.mobileMenuBtn.style.display = 'block';
            }
        } else {
            if (this.mobileMenuBtn) {
                this.mobileMenuBtn.style.display = 'none';
            }
            if (this.navMenu) {
                this.navMenu.classList.remove('mobile-menu-open');
            }
        }
    }
}

// Statistics Counter Animation
class StatsCounter {
    constructor() {
        this.stats = [];
        this.animated = new Set();
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupElements();
                this.bindScrollEvent();
            });
        } else {
            this.setupElements();
            this.bindScrollEvent();
        }
    }

    setupElements() {
        this.stats = document.querySelectorAll('.stat-item h3');
    }

    bindScrollEvent() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        this.stats.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const suffix = element.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, stepTime);
    }
}

// Initialize everything
let themeManager;
let navigation;
let skillBarAnimator;
let scrollAnimations;
let mobileMenu;
let statsCounter;

// Initialize when DOM is ready
function initializeApp() {
    console.log('🚀 Initializing Harini Anandan Portfolio...');
    
    // Initialize all components
    themeManager = new ThemeManager();
    navigation = new Navigation();
    skillBarAnimator = new SkillBarAnimator();
    scrollAnimations = new ScrollAnimations();
    mobileMenu = new MobileMenu();
    statsCounter = new StatsCounter();
    
    // Initialize typing animation
    const typingTexts = [
        'Code Whisperer',
        'Prompt Craftsperson',
        'Language Model Enthusiast',
        'Python Explorer',
        'ML Explorer'
    ];
    
    const typingElement = document.getElementById('typingText');
    if (typingElement) {
        new TypingAnimation(typingElement, typingTexts, 120, 60, 2500);
    }
    
    console.log('✅ Portfolio website initialized successfully!');
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Shift + T to toggle theme
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            if (themeManager) {
                themeManager.toggleTheme();
            }
        }
        
        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (navMenu && navMenu.classList.contains('mobile-menu-open')) {
                navMenu.classList.remove('mobile-menu-open');
                if (mobileMenuBtn) {
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-bars';
                    }
                }
            }
        }
    });
}

// Initialize based on document state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
    document.head.appendChild(script);
}

// Add loading complete event
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    console.log('🎉 Portfolio fully loaded and ready!');
});