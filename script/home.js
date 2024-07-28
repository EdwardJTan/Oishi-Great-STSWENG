document.addEventListener('DOMContentLoaded', (event) => {
    const userIcon = document.getElementById('userIcon');
    const dropdownContent = document.getElementById('dropdownContent');
    const body = document.querySelector('body');
    const closeCart = document.querySelector('.close');
    const checkOut = document.querySelector('.checkOut');
    const cartIcon = document.querySelector('.bx-cart');
    let listProductHTML = document.querySelector('.secondBoxImages');
    let listCartHTML = document.querySelector('.cartList');
    let iconCartSpan = document.querySelector('.numItems');

    let listProducts = [];
    let carts = [];

    // Add click event listener to the cart icon
    cartIcon.addEventListener('click', () => {
        // Toggle the 'showCart' class on the body element
        document.body.classList.toggle('showCart');
    });

    closeCart.addEventListener('click', () => {
        // Toggle the 'showCart' class on the body element
        document.body.classList.toggle('showCart');
    });

    checkOut.addEventListener('click', () => {
        carts = [];
        listCartHTML.innerHTML = '';
        totalCost = 0;
        document.querySelector('.numItems').textContent = '0';
    });

    userIcon.addEventListener('mouseover', () => {
        dropdownContent.style.display = 'block';
    });

    userIcon.addEventListener('mouseout', () => {
        dropdownContent.style.display = 'none';
    });

    const addDataToHTML = () => {
        listProductHTML.innerHTML = '';
        if(listProducts.length > 0){
            listProducts.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.classList.add('image-container');
                newProduct.dataset.id = product.id;
                newProduct.innerHTML = `
                    <div class="imageBox">
                        <img src="${product.image}">
                        <p class="image-text">${product.name}</p>
                        <p class="image-text">₱${product.price}</p>
                        <button class="button-30" role="button">Add to Cart</button>
                    </div>
                    `;
                listProductHTML.appendChild(newProduct);
            })
        }
    }

    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('button-30')){
            let productContainer = positionClick.closest('.image-container')
            let product_id = productContainer.dataset.id;
            addToCart(product_id);
        }
    })

    const addToCart = (product_id) => {
        let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
        if(carts.length <= 0){
            carts = [{
                product_id: product_id,
                quantity: 1
            }]
        }else if (positionThisProductInCart < 0){
            carts.push({
                product_id: product_id,
                quantity: 1
            })
        }else{
            carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
        }
        addCartToHTML();
        addCartToMemory();
    }

    const addCartToMemory = () => {
        localStorage.setItem('cart', carts);
    }

    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        if(carts.length > 0){
            carts.forEach(cart => {
                totalQuantity = totalQuantity + cart.quantity;
                let newCart = document.createElement('div');
                newCart.classList.add('itemBox');
                newCart.dataset.id = cart.product_id;
                let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
                let info = listProducts[positionProduct];
                newCart.innerHTML = `
                    <img src="${info.image}">
                        <p class="image-text">${info.name}</p>
                        <p class="image-text">₱${info.price * cart.quantity} ₱</p>
                        <div class="quantity">
                            <span class="minus">-</span>
                            <span>${cart.quantity}</span>
                            <span class="plus">+</span>
                        </div>
                `;
            listCartHTML.appendChild(newCart);
            })
        }
        iconCartSpan.innerText = totalQuantity;
    }

    listCartHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
            let product_id = positionClick.parentElement.parentElement.dataset.id;
            let type = 'minus';
            if (positionClick.classList.contains('plus')){
                type = 'plus';
            }
            changeQuantity(product_id, type);
        }
    })

    const changeQuantity = (product_id, type) => {
        let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
        if(positionItemInCart >= 0){
            switch (type) {
                case 'plus':
                    carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                    break;
                default:
                    let valueChange = carts[positionItemInCart].quantity - 1;
                    if(valueChange > 0){
                        carts[positionItemInCart].quantity = valueChange;
                    }else{
                        carts.splice(positionItemInCart, 1);
                    }
                    break;
            }
        } 
        addCartToMemory();
        addCartToHTML();
    }

    const initApp = () => {
        //get data from json
        fetch('./json/products.json')
        .then(response => response.json())
        .then(data => {
            listProducts = data;
            console.log(listProducts);
            addDataToHTML();
        })
    }
    initApp()
});