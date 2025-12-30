// Small helpers: set current year and improve skip-link focus behavior
document.addEventListener('DOMContentLoaded', function () {
  try {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    var skip = document.querySelector('.skip-link');
    if (skip) {
      skip.addEventListener('click', function (e) {
        var target = document.querySelector(skip.getAttribute('href'));
        if (target) {
          // Ensure the target can be focused programmatically
          target.setAttribute('tabindex', '-1');
          target.focus({preventScroll:false});
        }
      });
    }
  } catch (e) {
    // fail silently in older browsers
    console.warn('script.js error', e);
  }
});
/* script.js — form validation and small UI behaviors */
(function(){
  'use strict';

  // Cached DOM nodes
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('form-status');
  const yearEl = document.getElementById('year');
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('primary-navigation');

  // CONFIG: Set this to your form endpoint (Formspree endpoint or your serverless URL).
  // Example (Formspree): 'https://formspree.io/f/yourFormId'
  // Leave as an empty string '' to keep the local simulated submission used for development.
  const FORM_POST_URL = 'https://formspree.io/f/mkonkbre';

  // Utilities
  function isValidEmail(email){
    // simple but practical regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, message){
    const errEl = document.getElementById('error-' + input.id);
    input.setAttribute('aria-invalid', 'true');
    if(errEl){ errEl.textContent = message; }
  }

  function clearError(input){
    const errEl = document.getElementById('error-' + input.id);
    input.removeAttribute('aria-invalid');
    if(errEl){ errEl.textContent = ''; }
  }

  function clearAllErrors(){
    ['name','email','message'].forEach(id => {
      const el = document.getElementById(id);
      if(el) clearError(el);
    });
  }

  // Prevent double submissions and simulate a network request
  function setSubmitting(isSubmitting){
    submitBtn.disabled = isSubmitting;
    if(isSubmitting){ submitBtn.textContent = 'Sending...'; }
    else { submitBtn.textContent = 'Send message'; }
  }

  function validateForm(){
    clearAllErrors();
    let valid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    if(!name.value.trim()){
      showError(name, 'Name is required');
      valid = false;
    }

    if(!email.value.trim()){
      showError(email, 'Email is required');
      valid = false;
    } else if(!isValidEmail(email.value.trim())){
      showError(email, 'Please enter a valid email');
      valid = false;
    }

    // Message optional but trimmed length should be reasonable
    if(message.value && message.value.length > 2000){
      showError(message, 'Message too long');
      valid = false;
    }

    return valid;
  }

  // Form submission handler
  async function handleSubmit(evt){
    evt.preventDefault();

    if(!validateForm()){
      statusEl.textContent = 'Please fix the errors above and try again.';
      statusEl.style.color = '';
      return;
    }

    // Prevent double submissions
    setSubmitting(true);
    statusEl.textContent = '';

    // Prepare form data
    const fd = new FormData(form);

    // If a FORM_POST_URL is configured, POST to it. Expected to accept FormData and forward an email (e.g., Formspree, Netlify, or your serverless function).
    if(FORM_POST_URL && FORM_POST_URL.trim() !== ''){
      try {
        const res = await fetch(FORM_POST_URL, {
          method: 'POST',
          body: fd,
          headers: { 'Accept': 'application/json' }
        });
        if(res.ok){
          statusEl.textContent = 'Thank you! We will be in touch soon.';
          statusEl.style.color = 'var(--success)';
          form.reset();
        } else {
          const data = await res.json().catch(()=>({}));
          throw new Error(data.error || 'Submission failed');
        }
      } catch (err){
        console.error('Form submit error:', err);
        statusEl.textContent = 'Sending failed. Please try again later.';
        statusEl.style.color = 'var(--danger)';
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Fallback: local simulation for development when no endpoint is configured
    window.setTimeout(() => {
      statusEl.textContent = 'Thank you! We will be in touch soon.';
      statusEl.style.color = 'var(--success)';
      form.reset();
      setSubmitting(false);
    }, 900);
  }

  // Smooth anchor links
  function initSmoothScroll(){
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e){
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        const target = document.querySelector(targetId);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth',block:'start'});
          // Update focus for accessibility
          target.setAttribute('tabindex','-1');
          target.focus({preventScroll:true});
        }
      });
    });
  }

  // Simple nav toggle for small screens
  function initNavToggle(){
    if(!navToggle) return;
    navToggle.addEventListener('click', function(){
      const open = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!open));
      navList.style.display = open ? '' : 'flex';
    });
  }

  // Hook form-select package buttons to prefill message
  function initPackageButtons(){
    document.querySelectorAll('[data-package]').forEach(btn => {
      btn.addEventListener('click', function(e){
        e.preventDefault();
        const pkg = btn.getAttribute('data-package');
        const message = document.getElementById('message');
        message.value = `Hi — I'm interested in the ${pkg} package. Please contact me with next steps.`;
        document.querySelector('a[href="#contact"]').click();
      });
    });
  }

  // Set current year
  function setYear(){
    if(yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // Initialize app
  function init(){
    setYear();
    form.addEventListener('submit', handleSubmit);
    initSmoothScroll();
    initNavToggle();
    initPackageButtons();
    initDecorativeLogos();
  }



  // Toggle decorative logos for small screens / reduced motion
  function initDecorativeLogos(){
    const els = document.querySelectorAll('.logo-strip, .project-badge, .footer-watermark');
    function update(){
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const small = window.innerWidth < 480;
      if(reduced || small){
        els.forEach(el => { if(el) el.style.display = 'none'; });
      } else {
        els.forEach(el => { if(el) el.style.display = ''; });
      }
    }
    update();
    window.addEventListener('resize', update);
  }

  // Run init when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
})();