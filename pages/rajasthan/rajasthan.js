document.addEventListener("DOMContentLoaded", () => {
	console.log("Rajasthan page is loaded and ready!");

	// --- Interactive Map Logic (No changes here) ---
	const mapContainer = document.getElementById("rajasthan-map-container");
	const tooltip = document.getElementById("tooltip");
	const cityCrafts = {
		Jaipur: "<strong>Jaipur:</strong> Blue Pottery & Meenakari",
		Jodhpur: "<strong>Jodhpur:</strong> Mojari Footwear",
		Udaipur: "<strong>Udaipur:</strong> Miniature Paintings",
		Bikaner: "<strong>Bikaner:</strong> Usta Art",
		Jaisalmer: "<strong>Jaisalmer:</strong> Mirror Work Textiles",
	};
	fetch("../../assets/map/rajasthan.svg")
		.then((response) => response.text())
		.then((svgText) => {
			mapContainer.innerHTML = svgText;
			mapContainer.querySelectorAll("svg path").forEach((path) => {
				path.addEventListener("mouseover", (event) => {
					if (cityCrafts[path.id]) {
						tooltip.innerHTML = cityCrafts[path.id];
						tooltip.style.opacity = "1";
					}
				});
				path.addEventListener("mousemove", (event) => {
					tooltip.style.left = `${event.pageX + 15}px`;
					tooltip.style.top = `${event.pageY + 15}px`;
				});
				path.addEventListener("mouseout", () => {
					tooltip.style.opacity = "0";
				});
			});
		})
		.catch((error) => console.error("Error loading Rajasthan map:", error));

	// =====================================================================
	// NEW "ADD TO CART" LOGIC
	// =====================================================================
	const craftGrid = document.querySelector(".craft-grid");

	craftGrid.addEventListener("click", (event) => {
		// Check if the clicked element is an "Add to Cart" button
		if (event.target.classList.contains("add-to-cart-btn")) {
			const button = event.target;

			// 1. Get product data from the button's data-* attributes
			const product = {
				id: button.dataset.productId,
				name: button.dataset.productName,
				price: parseFloat(button.dataset.productPrice),
				quantity: 1, // Default quantity
			};

			// 2. Add the product to the cart in localStorage
			addToCart(product);

			// 3. Provide visual feedback to the user
			button.textContent = "Added!";
			button.classList.add("added");
			button.disabled = true; // Prevent multiple clicks
		}
	});

	function addToCart(productToAdd) {
		// Get the existing cart from localStorage, or create an empty array if it doesn't exist
		let cart = JSON.parse(localStorage.getItem("heritageCart")) || [];

		// Check if the product is already in the cart
		const existingProduct = cart.find((item) => item.id === productToAdd.id);

		if (existingProduct) {
			// If it exists, you could increase the quantity (future feature)
			console.log(`${productToAdd.name} is already in the cart.`);
		} else {
			// If it's a new product, add it to the array
			cart.push(productToAdd);
		}

		// Save the updated cart back to localStorage
		localStorage.setItem("heritageCart", JSON.stringify(cart));

		console.log("Cart updated!", cart);
	}
});
