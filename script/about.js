document.addEventListener('DOMContentLoaded', (event) => {
    const userIcon = document.getElementById('userIcon');
    const dropdownContent = document.getElementById('dropdownContent');
    const cartIcon = document.querySelector('.bx-cart');
    const body = document.querySelector('body');

    userIcon.addEventListener('mouseover', () => {
        dropdownContent.style.display = 'block';
    });

    userIcon.addEventListener('mouseout', () => {
        dropdownContent.style.display = 'none';
    });

    cartIcon.addEventListener('click', () => {
        // Toggle the 'showCart' class on the body element
        document.body.classList.toggle('showCart');
    });

    closeCart.addEventListener('click', () => {
        // Toggle the 'showCart' class on the body element
        document.body.classList.toggle('showCart');
    });

});