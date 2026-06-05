'use strict';


const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');


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
//2) determine ehat element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();

  //Matching strategy
  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});




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


*/