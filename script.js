document.addEventListener("DOMContentLoaded", () => {
	// --- Main navigation function ---
	const navigateTo = (viewId) => {
		const currentView = document.querySelector(".view.active");
		const targetView = document.getElementById(viewId);
		if (!targetView || (currentView && currentView.id === viewId)) {
			return;
		}
		if (currentView) {
			currentView.classList.remove("active");
		}
		targetView.classList.add("active");
	};

	// --- Welcome text "wipe" animation ---
	const animateWelcomeText = () => {
		const titleEl = document.querySelector(".welcome-title");
		if (!titleEl) return;

		const text = titleEl.textContent;
		const words = text.split(" ");

		titleEl.innerHTML = "";
		words.forEach((word, index) => {
			const span = document.createElement("span");
			span.textContent = word + " ";
			span.style.transitionDelay = `${index * 0.08}s`;
			titleEl.appendChild(span);
		});

		setTimeout(() => {
			titleEl.classList.add("reveal");
		}, 600);
	};

	// --- Intro Sequence (for first-time visits) ---
	const initialize = () => {
		setTimeout(() => {
			navigateTo("welcome-map");
			animateWelcomeText();
			setTimeout(() => {
				navigateTo("login-page");
			}, 3000);
		}, 2500);
	};

	// --- Get references to key elements ---
	const mapContainer = document.getElementById("interactive-map-container");
	const stateInfoPanel = document.getElementById("state-info-panel");
	const closePanelBtn = stateInfoPanel.querySelector(".close-btn");
	const fabButton = document.getElementById("fab-button");
	const fabOptions = document.querySelector(".fab-options");

	// --- MOCK DATA ---
	const stateData = {
		Rajasthan: {
			description: "Known for its vibrant culture...",
			audio: "assets/audio/rajasthan-art.mp3",
			subtitles: "This is the story...",
		},
		Bihar: {
			description: "Bihar is home to Madhubani painting...",
			audio: "assets/audio/bihar-art.mp3",
			subtitles: "Discover the magic...",
		},
	};

	// --- MAP LOADING LOGIC ---
	const loadMap = async () => {
		try {
			const response = await fetch("assets/map/india.svg");
			if (!response.ok) throw new Error("Map file not found");
			const svgText = await response.text();
			mapContainer.innerHTML = svgText;
			mapContainer.querySelectorAll("svg path").forEach((statePath) => {
				statePath.addEventListener("click", (event) => {
					event.stopPropagation();
					const stateName = statePath.getAttribute("title");
					if (!stateName) {
						return;
					}
					if (stateName === "Rajasthan") {
						window.location.href = "pages/rajasthan/rajasthan.html";
						return;
					}
					if (stateData[stateName]) {
						document.getElementById("panel-state-name").textContent = stateName;
						document.getElementById("panel-state-description").textContent =
							stateData[stateName].description;
						document.getElementById("panel-audio-player").src =
							stateData[stateName].audio;
						document.getElementById("panel-subtitles").textContent =
							stateData[stateName].subtitles;
						stateInfoPanel.classList.add("visible");
					} else {
						alert(`Data for ${stateName} is not available yet.`);
					}
				});
			});
		} catch (error) {
			console.error("Error loading map:", error);
			mapContainer.innerHTML = `<p style="color: red; text-align: center;">Could not load map: ${error.message}</p>`;
		}
	};

	// --- Close the state info panel ---
	closePanelBtn.addEventListener("click", () => {
		stateInfoPanel.classList.remove("visible");
		document.getElementById("panel-audio-player").pause();
	});

	// --- MASTER EVENT LISTENER (Handles non-map clicks) ---
	document.addEventListener("click", (event) => {
		const navTarget = event.target.closest("[data-navigate-to]");
		if (navTarget) {
			event.preventDefault();
			const viewId = navTarget.dataset.navigateTo;

			// THIS IS THE NEW, SMARTER LOGIC
			if (viewId === "community-hub") {
				// If the link is for the community page, redirect the browser
				window.location.href = "pages/dock/community/community.html";
			} else {
				// For all other links (like 'passport-page'), navigate within the SPA
				navigateTo(viewId);
			}
			return;
		}

		if (event.target.closest("#fab-button")) {
			event.stopPropagation(); // Added this back to be safe
			fabButton.classList.toggle("active");
			fabOptions.classList.toggle("active");
			return;
		}
		if (fabButton.classList.contains("active")) {
			fabButton.classList.remove("active");
			fabOptions.classList.remove("active");
		}
	});

	// --- START THE APPLICATION ---
	if (window.location.hash === "#explore") {
		navigateTo("explore-page");
	} else {
		initialize();
	}
	loadMap();
});
