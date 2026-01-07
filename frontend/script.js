/* =========================================================================
   js/script.js
   - Custom cursor (dot + outline) with hover interactions
   - Sticky shrinking header on scroll
   - Hero parallax effect (mouse-based)
   - Smooth anchor scrolling
   - IntersectionObserver scroll reveal
   - Product filters (buttons)
   - Product quick-view modal
   - Gallery lightbox
   - Mobile menu open/close
   - Floating WhatsApp ensured
   - Accessible keyboard support (ESC to close)
   ========================================================================= */

/* -------------------------
   Helpers
   ------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from((root || document).querySelectorAll(sel));
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

/* -------------------------
   Cursor
   ------------------------- */
(function setupCursor(){
  const cursor = $('#cursor');
  const dot = $('#cursor-dot');
  const outline = $('#cursor-outline');
  if(!cursor || !dot || !outline) return;

  let mouseX = -100, mouseY = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    outline.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  const hoverable = ['a','.btn','.product-card','.pc-quick','.nav-link','.gallery-item','button'];
  function setHoverState(add){
    if(add) document.body.classList.add('cursor-hover');
    else document.body.classList.remove('cursor-hover');
  }
  hoverable.forEach(sel => {
    $$(sel).forEach(el => {
      el.addEventListener('mouseenter', ()=> setHoverState(true));
      el.addEventListener('mouseleave', ()=> setHoverState(false));
    });
  });

  if('ontouchstart' in window || navigator.maxTouchPoints > 2) {
    cursor.style.display = 'none';
  }
})();

/* -------------------------
   Header shrink on scroll
   ------------------------- */
(function headerScroll(){
  const header = document.querySelector('.header');
  if(!header) return;
  const threshold = 24;
  window.addEventListener('scroll', () => {
    if(window.scrollY > threshold) header.classList.add('shrink');
    else header.classList.remove('shrink');
  });
})();

/* -------------------------
   Hero parallax by mouse
   ------------------------- */
(function heroParallax(){
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  if(!hero || !heroBg) return;
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width - 0.5;
    const ry = (e.clientY - rect.top) / rect.height - 0.5;
    heroBg.style.transform = `translate3d(${rx * 18}px, ${ry * 10}px, 0) scale(1.03)`;
  });
  hero.addEventListener('mouseleave', () => heroBg.style.transform = '');
})();

/* -------------------------
   Smooth scroll anchors
   ------------------------- */
(function smoothAnchors(){
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(href.length > 1){
        const target = document.querySelector(href);
        if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
      }
    });
  });
})();

/* -------------------------
   Scroll reveal
   ------------------------- */
(function scrollReveal(){
  const items = $$('.reveal');
  const io = new IntersectionObserver((entries, ob) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        ob.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  items.forEach(item => io.observe(item));
})();

/* -------------------------
   Product filters
   ------------------------- */
(function productFilters(){
  const filters = $$('.pf');
  const cards = $$('.product-card');
  if(!filters.length || !cards.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(c => {
        const cat = c.dataset.category || 'all';
        if(filter === 'all' || filter === cat) c.style.display = '';
        else c.style.display = 'none';
      });
    });
  });
})();

/* -------------------------
   Quick product modal (Quick view)
   ------------------------- */
(function quickView(){
  const modal = $('#quickViewModal');
  const closeBtn = $('#quickClose');
  const quickImg = $('#quickImg');
  const quickTitle = $('#quickTitle');
  const quickDesc = $('#quickDesc');
  const quickPrice = $('#quickPrice');
  const quickAdd = $('#quickAdd');
  if(!modal) return;

  $$('.pc-quick').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const imgSrc = card.querySelector('img').getAttribute('data-src') || card.querySelector('img').src;
      quickImg.src = imgSrc.startsWith('http') ? imgSrc : `/images/${imgSrc.split('/').pop()}`;
      quickTitle.textContent = card.querySelector('h3').textContent;
      quickDesc.textContent = card.querySelector('.pc-desc').textContent;
      quickPrice.textContent = card.querySelector('.price').textContent;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  on(closeBtn,'click', closeModal);
  on(modal,'click', e => { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  if(quickAdd){
    quickAdd.addEventListener('click', () => {
      quickAdd.disabled = true;
      quickAdd.textContent = 'Added ✓';
      setTimeout(()=> { quickAdd.disabled = false; quickAdd.textContent = 'Add to cart'; }, 1600);
    });
  }
})();

/* -------------------------
   Gallery lightbox
   ------------------------- */
(function galleryLightbox(){
  const gallery = $('#galleryGrid') || $('.gallery-grid');
  const lb = $('#galleryLightbox');
  const lbImg = $('#lbImage');
  const lbClose = $('#lbClose');
  const lbCaption = $('#lbCaption');
  if(!gallery || !lb) return;

  $$('.gallery-item img', gallery).forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('data-src') || img.src;
      lbImg.src = src.startsWith('http') ? src : `/images/${src.split('/').pop()}`;
      lbCaption.textContent = img.alt || '';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    });
    img.addEventListener('keydown', e => { if(e.key === 'Enter') img.click(); });
  });

  function closeLB(){ 
    lb.classList.remove('open'); 
    lb.setAttribute('aria-hidden','true'); 
    document.body.style.overflow = ''; 
    lbImg.src = ''; 
  }
  on(lbClose, 'click', closeLB);
  on(lb, 'click', e => { if(e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && lb.classList.contains('open')) closeLB(); });
})();

/* -------------------------
   Mobile nav
   ------------------------- */
(function mobileNav(){
  const burger = $('#burger');
  const mobile = $('#mobileNav');
  const mClose = $('#mobileClose');
  if(!burger || !mobile) return;
  burger.addEventListener('click', () => {
    mobile.classList.toggle('open');
    mobile.setAttribute('aria-hidden', mobile.classList.contains('open') ? 'false' : 'true');
    document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
  });
  on(mClose,'click', () => { mobile.classList.remove('open'); mobile.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; });
  $$('.mobile-link', mobile).forEach(a => a.addEventListener('click', ()=> { mobile.classList.remove('open'); mobile.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }));
})();

/* -------------------------
   Contact form simulation
   ------------------------- */
(function contactForm(){
  const form = $('#contactForm');
  const status = $('#cfStatus');
  const submit = $('#cfSubmit');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submit.disabled = true; submit.textContent = 'Sending...';
    fetch('http://localhost:5000/api/contact', { // real backend connection
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: $('#name').value,
        email: $('#email').value,
        message: $('#message').value
      })
    }).then(res => res.json())
      .then(data => {
        submit.textContent = 'Sent ✓';
        status.textContent = 'Thanks! We will contact you soon.';
        form.reset();
        setTimeout(()=> { submit.textContent = 'Send message'; status.textContent=''; submit.disabled=false; }, 2000);
      })
      .catch(err => {
        submit.textContent = 'Send message';
        status.textContent = 'Error sending message. Try again.';
        submit.disabled = false;
        console.error(err);
      });
  });
})();

/* -------------------------
   Hero shimmer
   ------------------------- */
(function heroShimmer(){
  const cta = document.querySelector('.btn-cta');
  if(!cta) return;
  let active = true;
  setInterval(()=> {
    if(!active) return;
    cta.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'}], {duration:700, easing:'ease-out', direction:'alternate'});
  }, 2400);
})();

/* -------------------------
   Accessibility
   ------------------------- */
(function focusOutline(){
  function handleFirstTab(e){
    if(e.key === 'Tab'){
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
})();

// simple backend test
fetch('http://localhost:5000')
  .then(res => res.text())
  .then(data => console.log(data));


