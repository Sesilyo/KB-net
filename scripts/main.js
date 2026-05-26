// FILENAME: scripts/main.js
/*
    imports the other JavaScript files so HTML wouldn't be cluttered with multiple lines of <script> tags
*/

// IMPORT FOR COMPONENT LOGICS
import { loadNavbar }    from "./components/injectNavBar.js";
import { injectItemGrid } from "./components/injectItemGrid.js";
import { injectFilters }  from "./components/injectFilters.js";
import { injectMyItems }  from "./components/injectMyItems.js";

const PATH = window.location.pathname;

// FUNCTION CALLS
// globally load navbar for all pages
loadNavbar();

// ── Browse page ──────────────────────────────────────────────
if (PATH.includes('browse.html')) {
     // only loads these JS injections inside browse.html
    injectItemGrid('#item-grid');
    injectFilters('#filter-container');

    document.addEventListener('change', (e) => {
        if (!e.target.matches('.filter-category, .filter-availability')) return;

        const categories = [...document.querySelectorAll('.filter-category:checked')]
            .map(cb => cb.value);
        const statuses = [...document.querySelectorAll('.filter-availability:checked')]
            .map(cb => cb.value);

        injectItemGrid('#item-grid', categories, statuses);
    });
}

// ── My Items page ────────────────────────────────────────────
if (PATH.includes('my_items.html')) {
    injectMyItems('#item-grid');
    injectFilters('#filter-container');

    // Re-fetch on filter change
    document.addEventListener('change', (e) => {
        if (!e.target.matches('.filter-category, .filter-availability')) return;

        const categories = [...document.querySelectorAll('.filter-category:checked')]
            .map(cb => cb.value);
        const statuses = [...document.querySelectorAll('.filter-availability:checked')]
            .map(cb => cb.value);

        injectMyItems('#item-grid', categories, statuses);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.matches('.edit-btn')) return;
        const itemId = e.target.dataset.id;
        window.location.href = `edit_item.html?item_id=${itemId}`;
    });

    // Add Item button
    const addBtn = document.querySelector('#add-item-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            window.location.href = 'add_item.html';
        });
    }
}