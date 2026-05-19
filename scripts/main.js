// FILENAME: main.js
/*
    imports the other JavaScript files so HTML wouldn't be cluttered with multiple lines of <script> tags
*/

// IMPORT FOR COMPONENT LOGICS
import { loadNavbar } from "./components/injectNavBar.js";
import { injectItemGrid } from "./components/injectItemGrid.js";

// FUNCTION CALLS
loadNavbar();
injectItemGrid('#item-grid');