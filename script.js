// ==================== VARIABLES GLOBALES ====================
let currentImages = [];
let currentIndex = 0;
let currentProjectTitle = '';

// ==================== DOM ELEMENTS ====================
const navbar = document.getElementById('navbar');
const projectModal = document.getElementById('projectModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const mainImage = document.getElementById('mainImage');
const galleryThumbs = document.getElementById('galleryThumbs');
const galleryCounter = document.getElementById('galleryCounter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const projectCategory = document.getElementById('projectCategory');
const projectName = document.getElementById('projectName');
const projectDesc = document.getElementById('projectDesc');
const whatsappCTA = document.getElementById('whatsappCTA');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initProjects();
    initAOS();
    initNavbar();
    initModal();
    initMobileMenu();
    initPlanButtons();
});

// ==================== NAVBAR ====================
function initNavbar() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll para los links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            // Si el href es solo "#", scroll al top
            if (href === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (navMenu) navMenu.classList.remove('active');
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Cerrar menu mobile si está abierto
                if (navMenu) navMenu.classList.remove('active');
            }
        });
    });
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
}

// ==================== PLAN BUTTONS (WhatsApp) ====================
function initPlanButtons() {
    var messages = {
        base: 'Hola, Diapositive! Estuve viendo su pagina y me interesa mucho el *Plan Base Solida*. Estoy listo/a para construir mi presencia digital desde cero y empezar a crecer de forma profesional. Podemos coordinar?',
        full: 'Hola, Diapositive! Vi su pagina y quiero contratar el *Plan Visibilidad Full*. Mi marca necesita mas alcance y quiero que todos me vean. Estoy listo/a para dar el siguiente paso. Cuando hablamos?',
        total: 'Hola, Diapositive! Vi su pagina y estoy decidido/a a contratar el *Plan Impacto Total*. Quiero convertir mi visibilidad en ventas reales y posicionarme fuerte en el mercado. Hablemos cuanto antes!'
    };

    document.querySelectorAll('[data-waplan]').forEach(function(btn) {
        var plan = btn.getAttribute('data-waplan');
        if (messages[plan]) {
            btn.href = 'https://wa.me/18297910390?text=' + encodeURIComponent(messages[plan]);
        }
    });
}

// ==================== PROYECTOS ====================
function initProjects() {
    // Los proyectos están en el HTML con estructura limpia
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            // Leer datos desde los elementos HTML dentro del proyecto
            const infoDiv = item.querySelector('.project-info');
            const title = infoDiv.querySelector('.info-title').textContent;
            const category = infoDiv.querySelector('.info-category').textContent;
            const description = infoDiv.querySelector('.info-description').textContent;
            
            // Obtener todas las imágenes de la galería
            const galleryImages = infoDiv.querySelectorAll('.info-gallery img');
            const images = Array.from(galleryImages).map(img => img.src);
            
            openModal({
                title: title,
                category: category,
                description: description,
                images: images
            });
        });
    });
}

// ==================== MODAL ====================
function initModal() {
    // Cerrar modal
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Navegación
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    // Click en imagen principal abre Fancybox
    mainImage.style.cursor = 'zoom-in';
    mainImage.addEventListener('click', function() {
        var gallery = currentImages.map(function(src, i) {
            return { src: src, type: 'image', caption: currentProjectTitle + ' (' + (i + 1) + '/' + currentImages.length + ')' };
        });
        if (typeof Fancybox !== 'undefined') {
            Fancybox.show(gallery, {
                startIndex: currentIndex,
                animated: true,
                showClass: 'f-zoomInUp',
                hideClass: 'f-fadeOut',
                Toolbar: {
                    display: {
                        left: [],
                        middle: [],
                        right: ['close']
                    }
                },
                Images: {
                    zoom: true
                }
            });
        }
    });
    
    // Teclado
    document.addEventListener('keydown', (e) => {
        if (!projectModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
}

function openModal(project) {
    currentImages = project.images;
    currentIndex = 0;
    currentProjectTitle = project.title;
    
    // Actualizar info
    projectCategory.textContent = project.category;
    projectName.textContent = project.title;
    projectDesc.textContent = project.description;
    
    // Actualizar WhatsApp
    whatsappCTA.href = `https://wa.me/18095550123?text=Hola, me interesa un proyecto como: ${encodeURIComponent(project.title)}`;
    
    // Mostrar imagen
    updateMainImage();
    
    // Crear thumbnails
    createThumbnails();
    
    // Mostrar modal
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
}

function updateMainImage() {
    mainImage.src = currentImages[currentIndex];
    galleryCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    updateActiveThumbnail();
}

function createThumbnails() {
    galleryThumbs.innerHTML = '';
    
    currentImages.forEach((imgSrc, index) => {
        const thumb = document.createElement('div');
        thumb.className = `thumb-item ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${imgSrc}" alt="Thumb ${index + 1}">`;
        thumb.addEventListener('click', () => {
            currentIndex = index;
            updateMainImage();
        });
        galleryThumbs.appendChild(thumb);
    });
}

function updateActiveThumbnail() {
    const thumbs = galleryThumbs.querySelectorAll('.thumb-item');
    thumbs.forEach((thumb, index) => {
        if (index === currentIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

function showPrevImage() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = currentImages.length - 1;
    }
    updateMainImage();
}

function showNextImage() {
    currentIndex++;
    if (currentIndex >= currentImages.length) {
        currentIndex = 0;
    }
    updateMainImage();
}

// ==================== AOS (ANIMACIONES) ====================
function initAOS() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}
