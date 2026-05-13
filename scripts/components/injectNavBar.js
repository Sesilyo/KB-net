// FILENAME: injectNavBar.js

export async function loadNavbar() {
    const navbar = `
        <nav id="main-nav-bar">
            <h1>KB-Net</h1>
            <ul>
                <li><a href="../index.html">Home</a></li>
                <li><a href="../pages/map.html">Map</a></li>
                <li><a href="../pages/about.html">About</a></li>
            </ul>
        </nav>
    `;

    document.querySelector("header").innerHTML = navbar;

    const links = document.querySelectorAll("#main-nav-bar a");
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });
}