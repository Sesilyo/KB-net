// FILENAME: injectNavBar.js

export async function loadNavbar() {
    // Check if user is logged in
    try {
        const response = await fetch('../api/getSession.php');
        const sessionData = await response.json();
        
        if (sessionData.success) {
            // User is logged in
            const navbar = `
                <nav id="main-nav-bar">
                    <h1>KB-Net</h1>
                    
                    <div class="nav-search-container">
                        <input 
                            type="text" 
                            id="navbar-search-bar" 
                            class="navbar-search-input" 
                            placeholder="Search for..."
                        />
                        <button id="navbar-search-btn" class="navbar-search-btn">
                            <span class="search-icon">🔍</span>
                        </button>
                    </div>
                    
                    <div class="nav-content">
                        <ul class="nav-links">
                            <li><a href="../pages/browse.html" class="nav-link">Browse</a></li>
                            <li><a href="../pages/transaction.html" class="nav-link">My Transactions</a></li>
                            <li><a href="../pages/my_items.html" class="nav-link">My Items</a></li>
                            <li><a href="../pages/profile.html" class="nav-link">Profile</a></li>
                        </ul>
                        <div class="nav-user">
                            <span class="welcome-text">${sessionData.first_name} ${sessionData.last_name}<br/><small>${sessionData.student_id}</small></span>
                            <button id="nav-logout-btn" class="btn-logout">Logout</button>
                        </div>
                    </div>
                </nav>
            `;
            
            document.querySelector("header").innerHTML = navbar;
            
            // Handle logout button
            const logoutBtn = document.getElementById('nav-logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (confirm('Are you sure you want to logout?')) {
                        try {
                            const response = await fetch('../api/logout.php');
                            const data = await response.json();
                            if (data.success) {
                                window.location.href = '../index.html';
                            }
                        } catch (error) {
                            console.error('Logout error:', error);
                        }
                    }
                });
            }

            // Handle search functionality
            const searchBar = document.getElementById('navbar-search-bar');
            const searchBtn = document.getElementById('navbar-search-btn');
            
            if (searchBar && searchBtn) {
                const handleSearch = () => {
                    const searchTerm = searchBar.value.trim();
                    // Navigate to browse page with search parameter
                    if (searchTerm) {
                        window.location.href = `../pages/browse.html?search=${encodeURIComponent(searchTerm)}`;
                    }
                };
                
                searchBtn.addEventListener('click', handleSearch);
                searchBar.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') handleSearch();
                });
            }
        } else {
            // User is not logged in - show minimal navbar
            const navbar = `
                <nav id="main-nav-bar">
                    <h1>KB-Net</h1>
                    <ul class="nav-links">
                        <li><a href="../index.html" class="nav-link">Home</a></li>
                    </ul>
                </nav>
            `;
            document.querySelector("header").innerHTML = navbar;
        }
    } catch (error) {
        console.error('Error loading navbar:', error);
        // Fallback navbar
        const navbar = `
            <nav id="main-nav-bar">
                <h1>KB-Net</h1>
                <ul class="nav-links">
                    <li><a href="../index.html" class="nav-link">Home</a></li>
                </ul>
            </nav>
        `;
        document.querySelector("header").innerHTML = navbar;
    }

    // Highlight active link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll("#main-nav-bar .nav-link");
    links.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href.split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
}