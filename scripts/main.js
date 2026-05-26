// FILENAME: scripts/main.js


// IMPORT FOR COMPONENT LOGICS
import { loadNavbar }     from "./components/injectNavBar.js";
import { injectItemGrid } from "./components/injectItemGrid.js";
import { injectFilters }  from "./components/injectFilters.js";
import { injectMyItems }  from "./components/injectMyItems.js";
import { initAddItem }    from "./components/addItem.js";
import { initEditItem }   from "./components/edittem.js";

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

        const categories = [...document.querySelectorAll('.filter-category:checked')].map(cb => cb.value);
        const statuses   = [...document.querySelectorAll('.filter-availability:checked')].map(cb => cb.value);

        injectItemGrid('#item-grid', categories, statuses);
    });
}

// ── My Items page ────────────────────────────────────────────
if (PATH.includes('my_items.html')) {
    injectMyItems('#item-grid');
    injectFilters('#filter-container');
    initAddItem();
    initEditItem();

    document.addEventListener('change', (e) => {
        if (!e.target.matches('.filter-category, .filter-availability')) return;

        const categories = [...document.querySelectorAll('.filter-category:checked')].map(cb => cb.value);
        const statuses   = [...document.querySelectorAll('.filter-availability:checked')].map(cb => cb.value);

        injectMyItems('#item-grid', categories, statuses);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.matches('.edit-btn')) return;
        const itemId = e.target.dataset.id;
        if (!itemId) { console.error('edit-btn is missing data-id attribute'); return; }
        document.dispatchEvent(new CustomEvent('open-edit-modal', { detail: { itemId } }));
    });
}