import { handleNextStep, handlePrevStep, handleSubmit } from './signupHandler.js';

const slidePage = document.querySelector(".slide-page");
const nextBtnFirst = document.querySelector(".firstNext");
const prevBtnSec = document.querySelector(".prev-1");
const nextBtnSec = document.querySelector(".next-1");
const prevBtnThird = document.querySelector(".prev-2");
const nextBtnThird = document.querySelector(".next-2");
const prevBtnFourth = document.querySelector(".prev-3");
const submitBtn = document.querySelector(".submit");
const progressText = document.querySelectorAll(".step p");
const progressCheck = document.querySelectorAll(".step .check");
const bullet = document.querySelectorAll(".step .bullet");
let current = 1;

nextBtnFirst.addEventListener("click", function(event) {
  event.preventDefault();
  current = handleNextStep(slidePage, bullet, progressCheck, progressText, current, 1);
});

nextBtnSec.addEventListener("click", function(event) {
  event.preventDefault();
  current = handleNextStep(slidePage, bullet, progressCheck, progressText, current, 2);
});

nextBtnThird.addEventListener("click", function(event) {
  event.preventDefault();
  current = handleNextStep(slidePage, bullet, progressCheck, progressText, current, 3);
});

submitBtn.addEventListener("click", function(event) {
  event.preventDefault();
  current = handleSubmit(bullet, progressCheck, progressText, current);
});

prevBtnSec.addEventListener("click", function(event) {
  event.preventDefault();
  current = handlePrevStep(slidePage, bullet, progressCheck, progressText, current, 0);
});

prevBtnThird.addEventListener("click", function(event) {
  event.preventDefault();
  current = handlePrevStep(slidePage, bullet, progressCheck, progressText, current, 1);
});

prevBtnFourth.addEventListener("click", function(event) {
  event.preventDefault();
  current = handlePrevStep(slidePage, bullet, progressCheck, progressText, current, 2);
});
