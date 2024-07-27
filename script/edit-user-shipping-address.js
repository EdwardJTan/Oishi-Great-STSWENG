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

function saveShippingAddress() {
    const shippingAddress = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        companyName: document.getElementById('company-name').value,
        countryRegion: document.getElementById('country-region').value,
        streetAddress: document.getElementById('street-address').value,
        apartmentSuite: document.getElementById('apartment-suite').value,
        city: document.getElementById('city').value,
        province: document.getElementById('state').value,
        postalCode: document.getElementById('postal-code').value
    };
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    window.location.href = 'Oishi Great - UserAddress.html'; // Redirect to summary page
}