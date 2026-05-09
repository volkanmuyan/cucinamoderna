'use strict';

/* --------------------------------------------------------------------------
   Header — scroll state
   -------------------------------------------------------------------------- */
const header = document.getElementById('header');

const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
};

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* --------------------------------------------------------------------------
   Mobile menu — hamburger toggle
   -------------------------------------------------------------------------- */
const menuBtn  = document.getElementById('menuBtn');
const mainNav  = document.getElementById('mainNav');

menuBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuBtn.classList.toggle('is-open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('is-open') && !header.contains(e.target)) {
        mainNav.classList.remove('is-open');
        menuBtn.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// Mobile accordion for dropdowns
document.querySelectorAll('.nav__item--dropdown .nav__link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;
        e.preventDefault();
        const item = link.closest('.nav__item');
        item.classList.toggle('is-open');
    });
});

/* --------------------------------------------------------------------------
   Scroll reveal — IntersectionObserver
   -------------------------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* --------------------------------------------------------------------------
   Smooth scroll for in-page anchor links
   -------------------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* --------------------------------------------------------------------------
   Newsletter form
   -------------------------------------------------------------------------- */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input[type="email"]');
        const btn   = newsletterForm.querySelector('button[type="submit"]');

        if (!input.value || !input.checkValidity()) {
            input.focus();
            return;
        }

        const originalText = btn.textContent;
        btn.textContent    = document.documentElement.lang === 'nl' ? 'Dankuwel!' : 'Merci !';
        btn.style.background = '#4A7A45';
        btn.disabled = true;
        input.value  = '';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 4000);
    });
}
