'use strict';
// modal
const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll(
  '.btn--show-modal-window'
);
// see more
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
// tabs

const tabContainer = document.querySelector('.operations__tab-container');
const tabsBtns = document.querySelectorAll('.operations__tab');
const tabContents = document.querySelectorAll('.operations__content');

// nav highlight
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window
const openModalWindow = function (e) {
  e.preventDefault();
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach(button =>
  button.addEventListener('click', openModalWindow)
);

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});
// cookie
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'Мы используем на этом сайте cookie для улучшения функциональности <button class="btn btn--close-cookie">Ok!</button>';

const body = document.body;
body.prepend(message);

message
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });
// scroll to section-1

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Smooth page navigation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const href = e.target.getAttribute('href');
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  }
});

// animation highlight nav items

const navLinksHoverAnimation = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const linkOver = e.target;

    const siblingLinks = linkOver
      .closest('.nav__links')
      .querySelectorAll('.nav__link');

    const logo = linkOver.closest('.nav').querySelector('img');
    const logoText = linkOver.closest('.nav').querySelector('.nav__text');

    siblingLinks.forEach(navLink => {
      if (navLink !== linkOver) {
        navLink.style.opacity = this;
        navLink.style.transition = 'all 0.2s linear';
      }
    });

    logo.style.opacity = this;
    logo.style.transition = 'all 0.2s linear';
    logoText.style.opacity = this;
    logoText.style.transition = 'all 0.2s linear';
  }
};

nav.addEventListener('mouseover', navLinksHoverAnimation.bind(0.4));

nav.addEventListener('mouseout', navLinksHoverAnimation.bind(1));
// tabs

tabContainer.addEventListener('click', function (e) {
  e.preventDefault();

  const clickedButton = e.target.closest('.operations__tab');
  if (!clickedButton) return;

  // add/remove tabBtn class
  tabsBtns.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickedButton.classList.add('operations__tab--active');

  // add/remove tabContent class
  const dataTabAttribute = clickedButton.getAttribute('data-tab');
  tabContents.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active')
  );

  document
    .querySelector(`.operations__content--${dataTabAttribute}`)
    .classList.add('operations__content--active');
});

// ####################################################
// ######   INTERSECTION OBSERVER -> STICKY HEADER   ##
// ####################################################

const header = document.querySelector('.header');
const headerHeight = nav.getBoundingClientRect().height;

const getStickyNav = function (entries) {
  const entry = entries[0];

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(getStickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${headerHeight}px`,
});

headerObserver.observe(header);

// #############################################################
// ######   INTERSECTION OBSERVER -> SHOW SECTIONS HEADLINES  ##
// #############################################################

const allSections = document.querySelectorAll('.section');

const appearanceSection = function (entries, observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) {
    return;
  }

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(appearanceSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// #############################################################
// ######   INTERSECTION OBSERVER -> IMPLEMENT LAZY LOADING IMAGES  ##
// #############################################################

const loadImages = function (entries, observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const lazyImages = document.querySelectorAll('img[data-src]');
const lazyImagesObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0.7,
});

lazyImages.forEach(image => lazyImagesObserver.observe(image));

// #############################################################
// ######   CREATE CUSTON SLIDER  ##
// #############################################################

const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const slidesNumber = slides.length;

const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach((_, index) => {
    dotContainer.insertAdjacentHTML(
      'beforeEnd',
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};

createDots();

const activateCurrentDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const moveToSlide = function (slide) {
  slides.forEach(
    (s, index) => (s.style.transform = `translateX(${(index - slide) * 100}%)`)
  );
};

moveToSlide(0);
activateCurrentDot(0);

const nextSlide = function () {
  if (currentSlide === slidesNumber - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

const prevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = slidesNumber - 1;
  } else {
    currentSlide--;
  }

  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') {
    nextSlide();
  }

  if (e.key === 'ArrowLeft') {
    prevSlide();
  }
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    moveToSlide(slide);
    activateCurrentDot(slide);
  }
});
