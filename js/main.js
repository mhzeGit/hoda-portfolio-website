// Main JavaScript for Portfolio Website

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initPortfolio();
    initModal();
    initScrollEffects();
});

// =============================================
// Navigation
// =============================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =============================================
// Portfolio
// =============================================

function getPortfolioData() {
    // Only use static portfolioData from portfolio-data.js
    if (typeof portfolioData !== 'undefined' && Array.isArray(portfolioData)) {
        return portfolioData;
    }
    return [];
}

function initPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    if (!portfolioGrid) return;
    
    const data = getPortfolioData();
    
    if (data.length === 0) {
        portfolioGrid.innerHTML = `
            <div class="portfolio-empty">
                <i class="fas fa-images"></i>
                <p>Portfolio items coming soon...</p>
            </div>
        `;
        return;
    }

    // Render portfolio cards
    data.forEach(item => {
        const card = createPortfolioCard(item);
        portfolioGrid.appendChild(card);
    });
}

function createPortfolioCard(item) {
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.dataset.id = item.id;
    
    // Check if image exists, otherwise use placeholder
    const hasImage = item.images && item.images.final;
    
    card.innerHTML = `
        <div class="card-image">
            ${hasImage 
                ? `<img src="${item.images.final}" alt="${item.title}" onerror="this.parentElement.innerHTML='<div class=\\'card-image-placeholder\\'><i class=\\'fas fa-cube\\'></i></div>'">`
                : `<div class="card-image-placeholder"><i class="fas fa-cube"></i></div>`
            }
            <div class="card-overlay"></div>
        </div>
        <div class="card-content">
            <p class="card-category">${item.category}</p>
            <h3 class="card-title">${item.title}</h3>
            <p class="card-description">${item.description}</p>
        </div>
    `;

    card.addEventListener('click', () => openModal(item));
    
    return card;
}

// =============================================
// Modal
// =============================================
let currentItem = null;
let currentImageType = 'final';

function initModal() {
    const modal = document.getElementById('portfolioModal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const switchBtns = modal.querySelectorAll('.switch-btn');

    // Close modal events
    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Image switcher
    switchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            switchImage(type);
            
            switchBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function openModal(item) {
    currentItem = item;
    currentImageType = 'final';
    
    const modal = document.getElementById('portfolioModal');
    const mainImage = document.getElementById('modalMainImage');
    const title = document.getElementById('modalTitle');
    const description = document.getElementById('modalDescription');
    const software = document.getElementById('modalSoftware');
    const category = document.getElementById('modalCategory');
    const date = document.getElementById('modalDate');
    const polygons = document.getElementById('modalPolygons');
    const tagsContainer = document.getElementById('modalTags');
    const switchBtns = modal.querySelectorAll('.switch-btn');

    // Reset switch buttons
    switchBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === 'final') btn.classList.add('active');
    });

    // Populate modal content
    title.textContent = item.title;
    description.textContent = item.description;
    software.textContent = item.software;
    category.textContent = item.category;
    date.textContent = item.date;
    polygons.textContent = item.polygons;

    // Set image
    if (item.images && item.images.final) {
        mainImage.src = item.images.final;
        mainImage.alt = item.title;
        mainImage.onerror = function() {
            this.style.display = 'none';
            this.parentElement.innerHTML = '<i class="fas fa-cube placeholder-icon"></i>';
        };
    } else {
        mainImage.src = '';
        mainImage.parentElement.innerHTML = '<i class="fas fa-cube placeholder-icon"></i>';
    }

    // Populate tags
    tagsContainer.innerHTML = '';
    if (item.tags) {
        item.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'modal-tag';
            tagEl.textContent = tag;
            tagsContainer.appendChild(tagEl);
        });
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('portfolioModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentItem = null;
}

function switchImage(type) {
    if (!currentItem || !currentItem.images) return;
    
    const mainImage = document.getElementById('modalMainImage');
    const imageUrl = currentItem.images[type];
    
    if (imageUrl) {
        // Reset the image element if it was replaced with placeholder
        const imageSection = mainImage.parentElement;
        if (!imageSection.querySelector('img')) {
            imageSection.innerHTML = '<img id="modalMainImage" src="" alt="">';
        }
        
        const img = document.getElementById('modalMainImage');
        img.style.display = 'block';
        img.src = imageUrl;
        img.alt = `${currentItem.title} - ${type}`;
        img.onerror = function() {
            this.style.display = 'none';
            this.parentElement.innerHTML = '<i class="fas fa-cube placeholder-icon"></i>';
        };
    }
    
    currentImageType = type;
}

// =============================================
// Scroll Effects
// =============================================
function initScrollEffects() {
    // Animate elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.portfolio-card, .timeline-item, .about-content');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animate-in styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Stagger animation for portfolio cards
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// =============================================
// Utility Functions
// =============================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
