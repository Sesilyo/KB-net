// FILENAME: injectItemGrid.js

function createItemCard(item) {
        return `
            <div class="item-card" data-id="${item.item_id}">
                <div class="item-info">
                    <span class="item-category">${item.category_name}</span>
                    <p class="item-name">${item.item_name}</p>
                    <p class="item-lender">${item.first_name} ${item.last_name}</p>
                    
                    <div class="item-footer">
                        <span class="item-price">₱${parseFloat(item.price_pr_hr).toFixed(2)} / hr</span>
                        <span class="item-status ${item.item_status}">${item.item_status}</span>
                    </div>
                </div>
            </div>
        `;
}

export async function injectItemGrid(containerId) {
    const res = await fetch('../api/getItems.php');
    const items = await res.json();

    const container = document.querySelector(containerId);
    container.innerHTML = items.map(createItemCard).join('');
}