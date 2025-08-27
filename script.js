// Levenshtein distance function for fuzzy searching
// This calculates the number of edits (insertions, deletions, or substitutions)
// required to change one string into another.
function levenshteinDistance(a, b) {
    const matrix = [];
    // Increment along the first column of the matrix
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    // Increment along the first row of the matrix
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

// Get the search input element
const searchInput = document.getElementById('searchInput');

// Get all the searchable items
const searchableItems = document.querySelectorAll('.searchable-item');

// Set a tolerance for the fuzzy search (e.g., allow up to 2 character differences)
const FUZZY_THRESHOLD = 2;

// Add an event listener for when the user types
searchInput.addEventListener('input', (event) => {
    // Get the user's search term and convert it to lowercase for case-insensitive matching
    const searchTerm = event.target.value.toLowerCase();

    // Loop through each searchable item
    searchableItems.forEach(item => {
        // Get the original content of the item for resetting later
        const originalText = item.textContent;
        
        // Get the item's text content and convert to lowercase for the check
        const itemText = originalText.toLowerCase();

        // Check if the item's text is a fuzzy match or a direct match
        let isMatch = false;

        // Handle both direct and fuzzy matches
        if (searchTerm.length > 0) {
            const distance = levenshteinDistance(itemText, searchTerm);
            // A match is found if the distance is within our threshold
            if (distance <= FUZZY_THRESHOLD) {
                isMatch = true;
            }
        } else {
            // If the search bar is empty, show all items
            isMatch = true;
        }

        if (isMatch) {
            // If it's a match, show the item
            item.style.display = 'block';

            // Re-add the highlight functionality for direct matches
            if (searchTerm.length > 0) {
                const regex = new RegExp(searchTerm, 'gi');
                const highlightedHtml = originalText.replace(regex, (match) => {
                    return `<span class="highlight">${match}</span>`;
                });
                item.innerHTML = highlightedHtml;
            } else {
                // If the search bar is empty, reset the inner HTML
                item.innerHTML = originalText;
            }

        } else {
            // If it's not a match, hide the item
            item.style.display = 'none';
        }
    });
});
// --- 1. Lazy Loading Images with Intersection Observer ---

        // A function to check if an element is in the viewport
        const lazyLoadImages = (entries, observer) => {
            entries.forEach(entry => {
                // Check if the image is intersecting with the viewport
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');

                    // If a data-src exists, set it as the actual source
                    if (src) {
                        img.src = src;
                        img.onload = () => {
                            img.classList.add('visible');
                        };
                    }
                    // Stop observing the image after it has loaded
                    observer.unobserve(img);
                }
            });
        };

        // Check for browser support for IntersectionObserver
        if ('IntersectionObserver' in window) {
            // Create a new Intersection Observer
            const observer = new IntersectionObserver(lazyLoadImages, {
                rootMargin: '0px',
                threshold: 0.1 // Trigger when 10% of the image is visible
            });

            // Get all images with the 'lazy-image' class
            const lazyImages = document.querySelectorAll('.lazy-image');

            // Tell the observer to watch each image
            lazyImages.forEach(image => {
                observer.observe(image);
            });
        } else {
            // Fallback for older browsers
            const lazyImages = document.querySelectorAll('.lazy-image');
            lazyImages.forEach(img => {
                img.src = img.getAttribute('data-src');
                img.classList.add('visible');
            });
        }

        // --- 2. Event Debouncing to Optimize Performance ---

        // A simple debounce function that returns a new function
        const debounce = (func, delay) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        };

        const resizeStatusElement = document.getElementById('resize-status');

        const handleResize = () => {
            resizeStatusElement.textContent = `Window resized! Width: ${window.innerWidth}px`;
        };

        // Create a debounced version of the resize handler, with a 200ms delay
        const debouncedResize = debounce(handleResize, 200);

        // Listen for the window resize event and use the debounced function
        window.addEventListener('resize', debouncedResize);

        // Initial status update
        resizeStatusElement.textContent = `Initial window width: ${window.innerWidth}px`;
