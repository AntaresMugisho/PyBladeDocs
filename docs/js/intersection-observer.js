// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            if (entry.target.classList.contains('observe-once')) {
                observer.unobserve(entry.target);
            }
        } else if (!entry.target.classList.contains('observe-once')) {
            entry.target.classList.remove('show');
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe all elements with the 'scroll-animate' class
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => observer.observe(el));
});
