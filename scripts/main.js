// FILENAME: scripts/main.js

// IMPORT FOR COMPONENT LOGICS
import { loadNavbar }     from "./components/injectNavBar.js";
import { injectItemGrid } from "./components/injectItemGrid.js";
import { injectFilters }  from "./components/injectFilters.js";
import { injectMyItems }  from "./components/injectMyItems.js";
import { initAddItem }    from "./components/addItem.js";
import { initEditItem }   from "./components/edittem.js";
import { initDeleteItem } from "./components/deleteItem.js";
import { initProfilePage } from "./profile.js";

const PATH = window.location.pathname;

// FUNCTION CALLS
// globally load navbar for all pages
loadNavbar();

// helper function for better readbilti
function getFilters() {
    const categories = [...document.querySelectorAll('.filter-category:checked')].map(cb => cb.value);
    const statuses   = [...document.querySelectorAll('.filter-availability:checked')].map(cb => cb.value);
    return { categories, statuses };
}

// ── Browse page ───────────────────────────────────────────────────────────────
if (PATH.includes('browse.html')) {
    injectItemGrid('#item-grid');
    injectFilters('#filter-container');

    document.addEventListener('change', (e) => {
        if (!e.target.matches('.filter-category, .filter-availability')) return;
        const { categories, statuses, sort } = getFilters();
        injectItemGrid('#item-grid', categories, statuses, sort);
    });
}

// ── My Items page ─────────────────────────────────────────────────────────────
if (PATH.includes('my_items.html')) {
    injectMyItems('#item-grid');
    injectFilters('#filter-container');
    initAddItem();
    initEditItem();
    initDeleteItem();

    document.addEventListener('change', (e) => {
        if (!e.target.matches('.filter-category, .filter-availability')) return;
        const { categories, statuses, sort } = getFilters();
        injectMyItems('#item-grid', categories, statuses, sort);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.matches('.edit-btn')) return;
        const itemId = e.target.dataset.id;
        if (!itemId) { console.error('edit-btn is missing data-id attribute'); return; }
        document.dispatchEvent(new CustomEvent('open-edit-modal', { detail: { itemId } }));
    });

    document.addEventListener('click', (e) => {
        if (!e.target.matches('.delete-btn')) return;
        const itemId = e.target.dataset.id;
        if (!itemId) { console.error('delete-btn is missing data-id attribute'); return; }
        document.dispatchEvent(new CustomEvent('open-delete-modal', { detail: { itemId } }));
    });
}

// ── Profile page ──────────────────────────────────────────────────────────────
if (PATH.includes('profile.html')) {
    initProfilePage();
}