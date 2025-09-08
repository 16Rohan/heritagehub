document.addEventListener("DOMContentLoaded", () => {
	console.log("Checkout page script loaded.");

	const cartItemsContainer = document.getElementById("cart-items-container");
	const subtotalAmountEl = document.getElementById("subtotal-amount");
	const totalAmountEl = document.getElementById("total-amount");
	const checkoutForm = document.getElementById("checkout-form");

	loadCartItems();

	function loadCartItems() {
		const cart = JSON.parse(localStorage.getItem("heritageCart")) || [];
		if (cart.length === 0) {
			cartItemsContainer.innerHTML =
				'<p class="empty-cart-text">Your cart is empty.</p>';
			updateTotals(0);
			return;
		}

		let cartHTML = "";
		let subtotal = 0;
		cart.forEach((item) => {
			cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>ID: ${item.id}</p>
                    </div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
            `;
			subtotal += item.price;
		});

		cartItemsContainer.innerHTML = cartHTML;
		updateTotals(subtotal);
	}

	function updateTotals(subtotal) {
		const shipping = 5.0;
		const total = subtotal + shipping;
		subtotalAmountEl.textContent = `$${subtotal.toFixed(2)}`;
		totalAmountEl.textContent = `$${total.toFixed(2)}`;
	}

	checkoutForm.addEventListener("submit", (event) => {
		event.preventDefault();

		console.log("Order placed! Clearing cart and redirecting...");

		// Clear the cart from localStorage
		localStorage.removeItem("heritageCart");

		// THE FIX: Redirect to your new, dedicated thank-you page.
		// The path is relative to the checkout folder.
		window.location.href = "../thankyou/thankyou.html";
	});
});
