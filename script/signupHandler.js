// src/signupHandlers.js
function handleNextStep(slidePage, bullet, progressCheck, progressText, current, step) {
    slidePage.style.marginLeft = `-${step * 25}%`;
    bullet[current - 1].classList.add("active");
    progressCheck[current - 1].classList.add("active");
    progressText[current - 1].classList.add("active");
    return current + 1;
}

function handlePrevStep(slidePage, bullet, progressCheck, progressText, current, step) {
    slidePage.style.marginLeft = `${step * 25}%`;
    bullet[current - 2].classList.remove("active");
    progressCheck[current - 2].classList.remove("active");
    progressText[current - 2].classList.remove("active");
    return current - 1;
}

function handleSubmit(bullet, progressCheck, progressText, current) {
    bullet[current - 1].classList.add("active");
    progressCheck[current - 1].classList.add("active");
    progressText[current - 1].classList.add("active");
    setTimeout(function(){
        alert("Your Form Successfully Signed up");
        location.reload();
    }, 800);
    return current + 1;
}

module.exports = {
    handleNextStep,
    handlePrevStep,
    handleSubmit
};
