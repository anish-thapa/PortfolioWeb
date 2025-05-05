// script.js
// Add this to your JavaScript file or in a script tag at the end of your HTML body

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations for elements in viewport on page load
    animateElementsInViewport();
    
    // Add scroll listener for elements that come into view while scrolling
    window.addEventListener('scroll', throttle(animateElementsInViewport, 100));
    
    // Initial animation for above-fold elements
    const header = document.querySelector('header');
    const introElements = document.querySelectorAll('.intro h1, .intro .second');
    
    if (header) header.classList.add('animate');
    introElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animate');
        }, 200 + (index * 200));
    });
});

// Function to animate elements when they enter the viewport
function animateElementsInViewport() {
    const animatableElements = document.querySelectorAll(
        '.section-header, .timeline-item, .project-card, .contact-form, footer'
    );
    
    animatableElements.forEach(element => {
        // Skip already animated elements
        if (element.classList.contains('animate')) return;
        
        const elementTop = element.getBoundingClientRect().top;
        const elementHeight = element.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Check if element is in viewport
        if (elementTop < windowHeight - elementHeight / 4) {
            element.classList.add('animate');
        }
    });
}

// Throttle function to limit how often a function runs
function throttle(func, delay) {
    let lastCall = 0;
    return function() {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func.apply(this, arguments);
    };
}

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const sidebarThemeToggle = document.getElementById('sidebarThemeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Mobile Menu Functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const overlay = document.getElementById('overlay');

// Check for saved theme preference or use the system preference
const currentTheme = localStorage.getItem('theme') || 
                    (prefersDarkScheme.matches ? 'dark' : 'light');

// Set initial theme
if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
    updateThemeIcons(false);
} else {
    updateThemeIcons(true);
}

// Toggle theme when button is clicked
themeToggle?.addEventListener('click', toggleTheme);
sidebarThemeToggle?.addEventListener('click', toggleTheme);

function toggleTheme() {
    const isDark = !document.body.classList.contains('light-mode');
    if (isDark) {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        updateThemeIcons(false);
        document.querySelector('.sidebar-theme-toggle span').textContent = 'Light Mode';
    } else {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        updateThemeIcons(true);
        document.querySelector('.sidebar-theme-toggle span').textContent = 'Dark Mode';
    }
}

// Function to update both theme icons
function updateThemeIcons(isDark) {
    const moonIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    `;
    
    const sunIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    `;
    
    themeToggle.innerHTML = isDark ? moonIcon : sunIcon;
    sidebarThemeToggle.innerHTML = isDark ? moonIcon : sunIcon;
    document.querySelector('.sidebar-theme-toggle span').textContent = isDark ? 'Dark Mode' : 'Light Mode';
}

// Add form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const response = await fetch('https://formspree.io/f/xzzebayb', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        });

        if (response.ok) {
            alert('Message sent successfully!');
            this.reset();
        } else {
            alert('Error sending message. Please try again later.');
        }
    });
}

// Update year dynamically
document.querySelector('footer div').innerHTML = `&copy; Anish Thapa ${new Date().getFullYear()}`;

// Mobile Menu Functionality
mobileMenuBtn?.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
});

sidebarClose?.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

overlay?.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Media query listener to update theme based on system preference changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            document.body.classList.remove('light-mode');
            updateThemeIcons(true);
        } else {
            document.body.classList.add('light-mode');
            updateThemeIcons(false);
        }
    }
});
