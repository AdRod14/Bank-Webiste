'use strict';


const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');


///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


/////////////////////////////////////////////////////////
// Smooth scrolling

btnScrollTo.addEventListener('click', function(e) {
  const s1coords = section1.getBoundingClientRect();

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  console.log('height/width of viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

  //Scrolling options

  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  section1.scrollIntoView({behavior: 'smooth'});

})


/////////////////////////////////////////////////////
// Page navigation

// document.querySelectorAll('.nav__link').forEach(function(el) {         //Not the optimal solution for large amount of elements
//   el.addEventListener('click', function(e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   })
// })

//We can use EVENT DELEGATION
//1) add event listener to a common parent of all elements in interest
//2) determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();

  //Matching strategy
  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});


/////////////////////////////////////////////////
// Tabbed component

//Using event delegation instead of appointing the same function to every element
tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if(!clicked) {
    return;
  }

  //Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Activate content area
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

});


//////////////////////////////////////////////
// Menu fade animation

const handleHover = function(e) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) {
        el.style.opacity = this;
      }
      logo.style.opacity = this;
    })
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));


////////////////////////////////////////////////
// Sticky navigation bar 

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function(e) {           //Using scroll event is unoptimal
//   console.log(window.scrollY);    
//   if(this.window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   }
//   else {
//     nav.classList.remove('sticky')
//   }
// });

/////////Using intersection observer API is better

  // const obsCallback = function(entries, observer) {
  //   entries.forEach(entry => {
  //     console.log(entry);
  //   });
  // };

  // const obsOptions = {
  //   root: null,        //element that target must intersect, in this case null = viewport
  //   threshold: [0,0.2,1],     // 1 doesn't execute in this case, since section 1 is bigger than the viewport 
  // };

  // const observer = new IntersectionObserver(obsCallback, obsOptions);
  // observer.observe(section1);

  const header = document.querySelector('.header');
  const navHeight = nav.getBoundingClientRect().height;

  const stickyNav = function(entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      nav.classList.add('sticky');
    }
    else {
      nav.classList.remove('sticky');
    }
    
  };

  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(header);


//////////////////////////////////////////////////////////
// Reveal section

const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer) {
  entries.forEach(entry => {
    
    if(!entry.isIntersecting){
      return
    }

    entry.target.classList.remove('section--hidden');

    observer.unobserve(entry.target);

  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})


/////////////////////////////////////////////////////////////
// Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function(entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if(!entry.isIntersecting){
    return;
  }

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));



////////////////////////////////////////////////////////////
// Slider component

const slider = function() {

  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currSlide = 0;
  const maxSlide = slides.length;


  const createDots = function() {
    slides.forEach(function(_,i){
      dotContainer.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide="${i}"></button>`);
    });
  };


  const activateDot = function(slide) {
    document.querySelectorAll('.dots__dot').forEach( dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }


  const goToSlide = function(slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${(i - slide) * 100}%)`);
  }


  const nextSlide = function() {
    if(currSlide === (maxSlide - 1)){
      currSlide = 0;
    } else {
      currSlide++;
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  }


  const prevSlide = function() {
    if (currSlide === 0){
      currSlide = maxSlide - 1;
    }else {
      currSlide--;
    }
    goToSlide(currSlide)
    activateDot(currSlide);
  }

  const init = function () {
    createDots();
    goToSlide(0);
    activateDot(0);
  }

  init()

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function(e) {
    if(e.key === 'ArrowLeft') {
      prevSlide();
    }
    if (e.key === 'ArrowRight') {
      nextSlide();
    }
  })

  dotContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('dots__dot')){
      currSlide = Number(e.target.dataset.slide);
      goToSlide(currSlide);
      activateDot(currSlide);
    }
  })
}

slider();




/*
//////////////////// SELECTING, CREATING AND DELETING ELEMENTS ////////////////////

//SELECTING
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);   //prints a node list

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');   //Returns an html collection instead of node list, it updates automatically to changes.
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));    //Returns live html collection


//CREATING AND INSERTING ELEMENTS

const logo = document.getElementById('logo');
logo.insertAdjacentHTML("afterend",'<p>holakase</p>');


const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics.';
message.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;
const header = document.querySelector('.header');
header.prepend(message);
header.append(message);   //message can't be at two places simultaneously, DOM elements are unique

//for multiple copies
// header.prepend(message.cloneNode(true));

//Outside, as sibling of the header elements
header.before(message);
header.after(message);


//DELETE ELEMENTS
document.querySelector('.btn--close-cookie').addEventListener('click', function() {
  message.remove();
  // message.parentElement.removeChild(message);
})



///////////////// STYLES, ATTRIBUTES AND CLASSES /////////////////////

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;
const header = document.querySelector('.header');

header.append(message);

document.querySelector('.btn--close-cookie').addEventListener('click', function() {
  message.remove();
});

//Styles
message.style.backgroundColor = '#37383d';      //Inline styles
message.style.width = '120%';

console.log(message.style.backgroundColor);    //This only works for inline styles
console.log(message.style.color);

console.log(getComputedStyle(message));
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

//Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);
console.log(logo.designer);   //Doesn't work for created (not normal) attributes

console.log(logo.getAttribute('designer'));

logo.alt = 'Beautiful minimalist logo';   //We can set the value of attributes
console.log(logo.setAttribute('company', 'Bankist'));   //Creating and setting value of attribute

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

//Data attributes
console.log(logo.dataset.versionNumber);

//Classes
logo.classList.add('c')
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

logo.className = 'jonas';   //Don't use



////////////////////// TYPES OF EVENTS AND EVENT HANDLERS ////////////////

const h1 = document.querySelector('h1');

const alertH1 = function(e) {    
  alert('addEventListener: Great! You are reading the heading :D');

  h1.removeEventListener('mouseenter', alertH1);
}

h1.addEventListener('mouseenter', alertH1 ) //like hover

// h1.onmouseenter = function(e) {
//   alert('addEventListener: Great! You are reading the heading :D');     //Should generally use addEventListener
// }



////////////////////  EVENT PROPAGATION: BUBBLING AND CAPTURING ///////////////////

// Event propagation is compromised of three stages:
//   1) capturing phase
//   2) target phase
//   3) bubbling phase

// Events start at the root of the dom and travel downward until the target element is reached,
// afterwards, the same event returns up the tree to the root of the dom.

//However, there are few events that don't follow this order.



/////////////////////// EVENT PROPAGATION PRACTICE ////////////////

const randomInt = (min,max) => Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () => `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);    //target means where the event happened, where the click was
  console.log(this === e.currentTarget);

  // Stopping event propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);  //currentTarget means the element where the event handler is attached
});

document.querySelector('.nav').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
}, true);   //Listen to capture events, but no longer executes bubbling events, rarely used this days.


/////////////////////// DOM TRAVERSING /////////////////////////////////

const h1 = document.querySelector('h1');

//Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);   //For direct children (nodelist)
console.log(h1.children);     //For direct children (htmlCollection)
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//Going upwards
console.log(h1.parentNode);     //Direct parent
console.log(h1.parentElement);  //Direct parent

h1.closest('.header').style.background = 'var(--gradient-secondary)';   //Nearest parent of a certain element
h1.closest('h1').style.background = 'var(--gradient-primary)';

//Going sideways (siblings)
// We can only access direct siblings 
console.log(h1.previousElementSibling);       //These are for elements
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);            //These are for nodes
console.log(h1.nextSibling);

console.log(h1.parentElement.children);     //Trick to get all siblings, including itself

[...h1.parentElement.children].forEach(function(el) {
  if (el !== h1){
    el.style.transform = 'scale(0.5)';
  }
})
*/