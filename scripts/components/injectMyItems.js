// FILENAME: scripts/components/injectMyItems.js

function createMyItemCard(item) {
    const imageSrc = item.image_path
        ? `../${item.image_path}`
        : '../assets/placeholder.png';

    return `
        <div class="item-card" data-id="${item.item_id}">
            <span class="item-status ${item.item_status}">${item.item_status}</span>
            <img src="${imageSrc}" alt="${item.item_name}" onerror="this.style.display='none'">
            <div class="item-info">
                <div class="item-body">
                    <div class="item-labels">
                        <p class="item-name">${item.item_name}</p>
                        <span class="item-category">${item.category_name}</span>
                    </div>
                    <span class="item-price">₱${parseFloat(item.price_pr_hr).toFixed(2)} / hr</span>
                </div>

                <div class="item-footer">
                    <p class="item-desc">${item.item_description}</p>
                    <button class="edit-btn" data-id="${item.item_id}">Edit</button>
                </div>
            </div>
        </div>
    `;
}

export async function injectMyItems(containerId, categories = [], statuses = []) {
    const container = document.querySelector(containerId);
    container.innerHTML = '<p class="loading-msg">Loading items...</p>';

    const params = new URLSearchParams();
    if (categories.length) params.append('categories', categories.join(','));
    if (statuses.length)   params.append('statuses',   statuses.join(','));

    const res = await fetch(`../api/getMyItems.php?${params}`);

    // Unauthorized — redirect to login
    if (res.status === 401) {
        window.location.href = '../pages/login_signup.html';
        return;
    }

    const items = await res.json();

    if (!items.length) {
        container.innerHTML = `
            <div class="empty-state">
                <p><strong>No items found.</strong></p>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(createMyItemCard).join('');
}