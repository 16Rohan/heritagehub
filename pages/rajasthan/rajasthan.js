document.addEventListener('DOMContentLoaded', () => {
    console.log("Rajasthan page is loaded and ready!");

    const mapContainer = document.getElementById('rajasthan-map-container');
    const tooltip = document.getElementById('tooltip');

    // Data for the tooltips. The key MUST match the 'id' of the path in your rajasthan.svg
    const cityCrafts = {
        "Jaipur": "<strong>Jaipur:</strong> Blue Pottery & Meenakari",
        "Jodhpur": "<strong>Jodhpur:</strong> Mojari Footwear & Wooden Furniture",
        "Udaipur": "<strong>Udaipur:</strong> Miniature Paintings & Silver Jewelry",
        "Bikaner": "<strong>Bikaner:</strong> Usta Art (Camel Hide Painting)",
        "Jaisalmer": "<strong>Jaisalmer:</strong> Mirror Work Textiles & Stone Carving",
        // Add more cities as needed
    };

    // Load the SVG map
    fetch('../../assets/map/rajasthan.svg')
        .then(response => response.text())
        .then(svgText => {
            mapContainer.innerHTML = svgText;
            const svgPaths = mapContainer.querySelectorAll('svg path');

            svgPaths.forEach(path => {
                // Show tooltip on hover
                path.addEventListener('mouseover', (event) => {
                    const cityId = path.id;
                    if (cityCrafts[cityId]) {
                        tooltip.innerHTML = cityCrafts[cityId];
                        tooltip.style.opacity = '1';
                    }
                });

                // Move tooltip with mouse
                path.addEventListener('mousemove', (event) => {
                    tooltip.style.left = `${event.pageX + 15}px`;
                    tooltip.style.top = `${event.pageY + 15}px`;
                });

                // Hide tooltip on mouse out
                path.addEventListener('mouseout', () => {
                    tooltip.style.opacity = '0';
                });
            });
        })
        .catch(error => {
            console.error("Error loading Rajasthan map:", error);
            mapContainer.innerHTML = "<p>Could not load map.</p>";
        });
});