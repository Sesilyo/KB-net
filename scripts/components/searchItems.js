// FILENAME: scripts/components/searchItems.js

export async function initSearchBar(containerId = '#item-grid', gridFunction) {
    const searchBar = document.getElementById('search-bar');
    
    if (!searchBar) return;

    // Populate search bar from URL parameter if present
    const params = new URLSearchParams(window.location.search);
    const searchFromURL = params.get('search');
    if (searchFromURL) {
        searchBar.value = searchFromURL;
    }

    // Debounce function to prevent excessive API calls
    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }

    // Search handler
    const handleSearch = debounce(async () => {
        const searchTerm = searchBar.value.trim();
        
        // Get current filters
        const categories = [...document.querySelectorAll('.filter-category:checked')].map(cb => cb.value);
        const statuses = [...document.querySelectorAll('.filter-availability:checked')].map(cb => cb.value);
        
        // Call grid function with search term
        gridFunction(containerId, categories, statuses, searchTerm);
    }, 300);

    searchBar.addEventListener('input', handleSearch);
}
