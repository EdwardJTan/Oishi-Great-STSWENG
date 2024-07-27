document.addEventListener('DOMContentLoaded', (event) => {
    const userIcon = document.getElementById('userIcon');
    const dropdownContent = document.getElementById('dropdownContent');

    userIcon.addEventListener('mouseover', () => {
        dropdownContent.style.display = 'block';
    });

    userIcon.addEventListener('mouseout', () => {
        dropdownContent.style.display = 'none';
    });
});

window.onload = function() {
    const billingAddress = JSON.parse(localStorage.getItem('billingAddress'));
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));

    if (billingAddress) {
        document.getElementById('billing-address').innerHTML = `
            <p>${billingAddress.firstName} ${billingAddress.lastName}</p>
            <p>${billingAddress.streetAddress}</p>
            <p>${billingAddress.city}</p>
            <p>${billingAddress.province}</p>
            <p>${billingAddress.postalCode}</p>
        `;
    }

    if (shippingAddress) {
        document.getElementById('shipping-address').innerHTML = `
            <p>${shippingAddress.firstName} ${shippingAddress.lastName}</p>
            <p>${shippingAddress.streetAddress}</p>
            <p>${shippingAddress.city}</p>
            <p>${shippingAddress.province}</p>
            <p>${shippingAddress.postalCode}</p>
        `;
    }
}