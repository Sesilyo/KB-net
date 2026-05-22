// FILENAME: injectFilters.js

export async function injectFilters() {
    const res = await fetch('../api/getCategories.php');
    const categories = await res.json();

    const filterContainer = document.querySelector('#filter-container');
    filterContainer.innerHTML = categories.map( cat => `
            <label>
                <input type="checkbox" value="${cat.category_id}" class="filter-category">
                ${cat.category_name}
            </label>
        `).join('');
}