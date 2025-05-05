document.addEventListener('DOMContentLoaded', () => {

    // --- AOS Initialization ---
    AOS.init({
        duration: 700, // Slightly faster base duration
        offset: 80,   // Trigger a bit sooner
        once: true,
        easing: 'ease-out-cubic', // Smoother easing
    });

    // --- Mobile Navigation Toggle ---
    const burger = document.getElementById('burger-menu');
    const nav = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('#nav-menu li a'); // Target links directly for closing
    const header = document.getElementById('main-header');

    burger.addEventListener('click', () => {
        const isExpanded = burger.getAttribute('aria-expanded') === 'true';

        // Toggle Nav Class
        nav.classList.toggle('nav-active');
        // Toggle Burger Animation Class
        burger.classList.toggle('toggle');
        // Toggle ARIA attribute
        burger.setAttribute('aria-expanded', !isExpanded);
        // Lock/unlock body scroll
        document.body.style.overflow = nav.classList.contains('nav-active') ? 'hidden' : '';

    });

    // Close nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = ''; // Restore scroll
            }
        });
    });

    // Close nav if user clicks outside of it (optional but good UX)
    document.addEventListener('click', (event) => {
         const isClickInsideNav = nav.contains(event.target);
         const isClickOnBurger = burger.contains(event.target);

         if (!isClickInsideNav && !isClickOnBurger && nav.classList.contains('nav-active')) {
             nav.classList.remove('nav-active');
             burger.classList.remove('toggle');
             burger.setAttribute('aria-expanded', 'false');
             document.body.style.overflow = '';
         }
     });


    // --- Navbar Hide/Show on Scroll ---
    let lastScrollTop = 0;
    const delta = 5; // Trigger sensitivity
    let navbarHeight = header.offsetHeight;

    // Recalculate height on resize
    window.addEventListener('resize', () => {
        navbarHeight = header.offsetHeight;
    });

    window.addEventListener('scroll', function() {
        // Prevent hide/show logic if mobile menu is open
        if (nav.classList.contains('nav-active')) {
            return;
        }

        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - currentScroll) <= delta) return;

        // Scroll Down and past the navbar
        if (currentScroll > lastScrollTop && currentScroll > navbarHeight){
            if (!header.classList.contains('nav-hidden')) {
                 header.classList.add('nav-hidden');
            }
        } else {
            // Scroll Up or near top
            if (header.classList.contains('nav-hidden')) {
                 header.classList.remove('nav-hidden');
            }
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, false);


    // --- Mouse Sprinkle Effect ---
    const canvas = document.getElementById('sprinkles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];
    const particleColors = ['#ba181b', '#ffffff']; // Red, White

    class Particle {
        constructor(x, y) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 8;
            this.x = x + Math.cos(angle) * radius;
            this.y = y + Math.sin(angle) * radius;
            this.size = Math.random() * 3.5 + 1;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5;
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            this.life = 1;
            this.decay = Math.random() * 0.015 + 0.005;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            if (this.size > 0.2) this.size -= 0.04;
        }
        draw() {
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life > 0 ? Math.max(0, this.life) : 0;
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    function handleParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].life <= 0 || particles[i].size <= 0.2) {
                particles.splice(i, 1);
            }
        }
    }
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        requestAnimationFrame(animateParticles);
    }
    let canCreateParticle = true;
    window.addEventListener('mousemove', (e) => {
        if (canCreateParticle) {
             for (let i = 0; i < 1; i++) { particles.push(new Particle(e.clientX, e.clientY)); }
             canCreateParticle = false;
             setTimeout(() => { canCreateParticle = true; }, 35);
        }
        if (particles.length > 70) { particles.splice(0, particles.length - 70); }
    });
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        navbarHeight = header.offsetHeight; // Also update navbar height here
    });
    animateParticles();


     // --- Update Footer Year ---
     const yearSpan = document.getElementById('year');
     if (yearSpan) {
         yearSpan.textContent = new Date().getFullYear();
     }

    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('main section[id]');
    const navLiAnchors = document.querySelectorAll('header nav ul li a');

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -60% 0px', // Adjust margin to activate link slightly before center
      threshold: 0
    };

    const activateNavLink = (id) => {
      navLiAnchors.forEach(a => {
        a.classList.remove('active');
        const linkHref = a.getAttribute('href');
        if (linkHref === `#${id}`) {
          a.classList.add('active');
        }
      });
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activateNavLink(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      sectionObserver.observe(section);
    });

     // Handle top of page activation separately
     window.addEventListener('scroll', () => {
         if (window.pageYOffset < sections[0].offsetTop * 0.5) { // Check if very near the top
            activateNavLink('hero');
         }
     }, { passive: true }); // Use passive listener for scroll performance


}); // End DOMContentLoaded
