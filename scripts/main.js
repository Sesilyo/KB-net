// FILENAME: main.js
/*
    imports the other JavaScript files so HTML wouldn't be cluttered with multiple lines of <script> tags
*/

// IMPORT FOR COMPONENT LOGICS
import { loadNavbar } from "./components/injectNavBar.js";
import { injectItemGrid } from "./components/injectItemGrid.js";
import { injectFilters } from "./components/injectFilters.js";

const PATH = window.location.pathname;


// FUNCTION CALLS
// globally load navbar for all pages
loadNavbar();

if (PATH.includes('browse.html')) {
    // only loads these JS injections inside browse.html
    injectItemGrid('#item-grid');
    injectFilters('#filter-container');

    document.addEventListener('change', (e) => {
        if ( !e.target.matches('.filter-category, .filter-availability') ) return;

        const categories = [...document.querySelectorAll('.filter-category:checked')]
            .map(cb => cb.value);
        const statuses = [...document.querySelectorAll('.filter-availability:checked')]
            .map(cb => cb.value);

        injectItemGrid('#item-grid', categories, statuses);
    });
}