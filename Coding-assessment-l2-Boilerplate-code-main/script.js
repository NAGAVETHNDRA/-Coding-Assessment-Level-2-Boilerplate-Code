console.log('====================================');
console.log("Connected");
console.log('====================================');

const cartItemsContainer = document.querySelector('.cart-item-list');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');

// Fetch the cart data from the API
fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
    .then(response => response.json())
    .then(data => {
        const items = data.items;
        let subtotal = 0;
        cartItemsContainer.innerHTML = ''; // Clear container

        // Loop through the items in the cart
        items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            // Generate the HTML for each item
            const itemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.title}</h3>
                        <p>Price: ₹${(item.price / 100).toFixed(2)}</p>
                        <p>Quantity: <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="item-quantity"></p>
                        <p>Subtotal: ₹${(itemTotal / 100).toFixed(2)}</p>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += itemHTML;
        });

        // Update subtotal and total
        subtotalElement.innerText = `₹${(subtotal / 100).toFixed(2)}`;
        totalElement.innerText = `₹${(subtotal / 100).toFixed(2)}`;

        // Attach event listeners to quantity inputs and remove buttons
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.addEventListener('change', updateQuantity);
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    })
    .catch(error => {
        console.error("Error fetching the cart data: ", error);
    });

// Function to update the quantity of an item
function updateQuantity(event) {
    const input = event.target;
    const newQuantity = input.value;
    const id = input.dataset.id;
    
    // Recalculate subtotal for the item and update totals
    let updatedSubtotal = 0;
    const cartItems = document.querySelectorAll('.cart-item');

    cartItems.forEach(item => {
        const quantityInput = item.querySelector('.item-quantity');
        const price = parseFloat(item.querySelector('p:nth-child(2)').innerText.replace('Price: ₹', ''));
        const itemSubtotalElement = item.querySelector('p:nth-child(4)');
        const itemSubtotal = price * quantityInput.value;
        itemSubtotalElement.innerText = `Subtotal: ₹${itemSubtotal.toFixed(2)}`;
        updatedSubtotal += itemSubtotal;
    });

    // Update the global subtotal and total
    subtotalElement.innerText = `₹${updatedSubtotal.toFixed(2)}`;
    totalElement.innerText = `₹${updatedSubtotal.toFixed(2)}`;
}

// Function to remove an item from the cart
function removeItem(event) {
    const button = event.target;
    const itemId = button.dataset.id;

    // Remove the item from the DOM
    button.closest('.cart-item').remove();

    // Recalculate totals after removing the item
    updateQuantity(event);
}