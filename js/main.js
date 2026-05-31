// ── Nav scroll shadow
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile menu toggle
const toggle = document.querySelector('.nav__toggle');
let mobileMenu = null;

if (toggle) {
  toggle.addEventListener('click', () => {
    const existing = document.querySelector('.nav__mobile');
    if (existing) {
      existing.remove();
      mobileMenu = null;
      toggle.setAttribute('aria-expanded', 'false');
      return;
    }

    mobileMenu = document.createElement('div');
    mobileMenu.className = 'nav__mobile';

    const links = document.querySelector('.nav__links');
    if (links) {
      links.querySelectorAll('a').forEach(a => {
        const clone = a.cloneNode(true);
        mobileMenu.appendChild(clone);
      });
    }

    const ctaEl = document.querySelector('.nav__cta .btn');
    if (ctaEl) {
      const cta = ctaEl.cloneNode(true);
      mobileMenu.appendChild(cta);
    }

    nav.appendChild(mobileMenu);
    toggle.setAttribute('aria-expanded', 'true');
  });

  document.addEventListener('click', (e) => {
    if (mobileMenu && !nav.contains(e.target)) {
      mobileMenu.remove();
      mobileMenu = null;
    }
  });
}

// ── Active nav link
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ── Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Animate on scroll (fade-in)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.find-card, .step-card, .pricing-card, .industry-card, .matter-point, .team-card, .value-card, .lifecycle-phase')
  .forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });

document.head.insertAdjacentHTML('beforeend', `<style>
  .visible { opacity: 1 !important; transform: none !important; }
</style>`);

// ── Employee slot add/remove (contact form)
function showEmployeeSlot(num) {
  const slot = document.getElementById(`employee-${num}`);
  const addTrigger = document.getElementById(`add-emp${num}-trigger`);
  const nextAddTrigger = document.getElementById(`add-emp${num + 1}-trigger`);

  if (slot) {
    slot.style.display = 'block';
    slot.removeAttribute('aria-hidden');
    const firstInput = slot.querySelector('input');
    if (firstInput) firstInput.focus();
  }
  if (addTrigger) {
    addTrigger.style.display = 'none';
    addTrigger.setAttribute('aria-hidden', 'true');
  }
  // Show next "add" trigger only up to employee 3
  if (nextAddTrigger && num < 3) {
    nextAddTrigger.style.display = 'block';
    nextAddTrigger.removeAttribute('aria-hidden');
  }
}

function hideEmployeeSlot(num) {
  const slot = document.getElementById(`employee-${num}`);
  const addTrigger = document.getElementById(`add-emp${num}-trigger`);

  if (slot) {
    slot.style.display = 'none';
    slot.setAttribute('aria-hidden', 'true');
    slot.querySelectorAll('input').forEach(i => { i.value = ''; });
  }
  if (addTrigger) {
    addTrigger.style.display = 'block';
    addTrigger.removeAttribute('aria-hidden');
  }
  // If removing employee 2, also remove employee 3 and hide its trigger
  if (num === 2) {
    const slot3 = document.getElementById('employee-3');
    const trigger3 = document.getElementById('add-emp3-trigger');
    if (slot3 && slot3.style.display !== 'none') {
      hideEmployeeSlot(3);
    }
    if (trigger3) {
      trigger3.style.display = 'none';
      trigger3.setAttribute('aria-hidden', 'true');
    }
  }
}

// Delegate add/remove clicks
document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('[data-add-employee]');
  if (addBtn) showEmployeeSlot(parseInt(addBtn.dataset.addEmployee));

  const removeBtn = e.target.closest('[data-remove-employee]');
  if (removeBtn) hideEmployeeSlot(parseInt(removeBtn.dataset.removeEmployee));
});

// ── Contact form handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Submitting…';
    btn.disabled = true;

    await new Promise(r => setTimeout(r, 1200));

    btn.textContent = '✓ Audit Request Received';
    btn.style.background = '#27ae60';
    btn.style.borderColor = '#27ae60';

    const note = document.createElement('p');
    note.style.cssText = 'color:#27ae60;font-size:.88rem;margin-top:14px;text-align:center;font-weight:500;line-height:1.5;';
    note.textContent = 'Thank you. We\'ll send your free exposure audit to the email you provided within 24 hours.';
    contactForm.appendChild(note);

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.borderColor = '';
      contactForm.reset();
      // Re-hide optional employee slots after reset
      ['employee-2', 'employee-3'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.display = 'none'; el.setAttribute('aria-hidden', 'true'); }
      });
      ['add-emp2-trigger'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.display = 'block'; el.removeAttribute('aria-hidden'); }
      });
      ['add-emp3-trigger'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.display = 'none'; el.setAttribute('aria-hidden', 'true'); }
      });
      note.remove();
    }, 7000);
  });
}
