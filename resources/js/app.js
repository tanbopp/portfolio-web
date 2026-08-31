import Lenis from 'lenis';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Smooth scroll (Lenis — bundled locally, no CDN)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Parallax hero
const heroBg = document.getElementById('hero-bg');
function parallax() {
    if (heroBg) {
        const y = window.scrollY;
        heroBg.style.transform = `translate3d(0, ${y * 0.5}px, 0)`;
    }
}
lenis.on('scroll', parallax);
parallax();

// Navbar: transparent at top -> gradient + blur once scrolled
const siteNav = document.getElementById('site-nav');
function updateNav() {
    if (!siteNav) return;
    if (window.scrollY > 24) siteNav.classList.add('is-scrolled');
    else siteNav.classList.remove('is-scrolled');
}
updateNav();
lenis.on('scroll', updateNav);
window.addEventListener('scroll', updateNav, { passive: true });

// Projects carousel (transform-based, smooth)
const projectTrack = document.getElementById('project-track');
const projectViewport = projectTrack ? projectTrack.parentElement : null;
const prevBtn = document.getElementById('project-prev');
const nextBtn = document.getElementById('project-next');
let projectIndex = 0;
let maxProjectIndex = 0;

function cardStep() {
    const card = projectTrack && projectTrack.querySelector('article');
    return card ? card.offsetWidth + 24 : 0; // + gap
}

function updateProjectPosition(animate = true) {
    if (!projectTrack) return;
    projectTrack.style.transition = animate
        ? 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)'
        : 'none';
    projectIndex = Math.max(0, Math.min(projectIndex, maxProjectIndex));
    projectTrack.style.transform = `translateX(-${projectIndex * cardStep()}px)`;
}

function computeMaxIndex() {
    if (!projectTrack || !projectViewport) return;
    const step = cardStep();
    if (!step) return;
    const scrollable = projectTrack.scrollWidth - projectViewport.clientWidth;
    maxProjectIndex = Math.max(0, Math.ceil(scrollable / step));
}

if (prevBtn) prevBtn.addEventListener('click', () => { projectIndex -= 1; updateProjectPosition(); });
if (nextBtn) nextBtn.addEventListener('click', () => { projectIndex += 1; updateProjectPosition(); });

// Smooth wheel scrolling over the carousel
if (projectViewport) {
    let wheelLock = false;
    projectViewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (wheelLock) return;
        const delta = e.deltaX || e.deltaY;
        const dir = Math.sign(delta);
        if (dir === 0) return;
        wheelLock = true;
        setTimeout(() => { wheelLock = false; }, 650);
        projectIndex += dir;
        updateProjectPosition();
    }, { passive: false });
}

window.addEventListener('resize', () => { computeMaxIndex(); updateProjectPosition(false); });
computeMaxIndex();
updateProjectPosition(false);

// WYSIWYG content carousels (project showcase/article)
function initContentCarousels(scope) {
    (scope || document).querySelectorAll('.swiper-carousel .swiper:not(.swiper-initialized)').forEach((el) => {
        new Swiper(el, {
            modules: [Navigation, Pagination],
            loop: el.querySelectorAll('.swiper-slide').length > 1,
            navigation: { nextEl: el.querySelector('.swiper-button-next'), prevEl: el.querySelector('.swiper-button-prev') },
            pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
        });
    });
}
document.addEventListener('DOMContentLoaded', () => initContentCarousels());

