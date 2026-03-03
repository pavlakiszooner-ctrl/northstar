// Northstarwebsolutions Portfolio - script.js
// Handles navigation, hamburger menu, smooth scroll, and contact form

document.addEventListener('DOMContentLoaded', function () {
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
    });

    // Close nav on link click (mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function (e) {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
            // Smooth scroll only for anchor links on index.html
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Sticky header shadow on scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Contact form submission (EmailJS or mailto fallback)
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // --- EmailJS integration (recommended for production) ---
        // Replace with your EmailJS service ID, template ID, and user ID
        // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this, 'YOUR_USER_ID')
        //     .then(() => {
        //         formMessage.textContent = 'Message sent successfully!';
        //         formMessage.style.color = '#0ea5e9';
        //         contactForm.reset();
        //     }, () => {
        //         formMessage.textContent = 'Failed to send message. Please try again.';
        //         formMessage.style.color = 'red';
        //     });
        // --- Simple mailto fallback ---
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();
        if (name && email && message) {
            const mailto = `mailto:northstarwebsolutions@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=Name: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0A%0A${encodeURIComponent(message)}`;
            window.location.href = mailto;
            formMessage.textContent = 'Opening your email client...';
            formMessage.style.color = '#0ea5e9';
            contactForm.reset();
        } else {
            formMessage.textContent = 'Please fill in all fields.';
            formMessage.style.color = 'red';
        }
    });
});
