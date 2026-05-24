// FILENAME: injectItemGrid.js

function createItemCard(item) {
        return `
            <div class="item-card" data-id="${item.item_id}">
                <span class="item-status ${item.item_status}">${item.item_status}</span>
                <img alt="item img here">
                <div class="item-info">
                    <div class="item-body">
                        <div class="item-labels">
                            <p class="item-name">${item.item_name}</p>
                            <span class="item-category">${item.category_name}</span>
                        </div>

                        <span class="item-price">₱${parseFloat(item.price_pr_hr).toFixed(2)} / hr</span>
                    </div>
                    
                    <div class="item-footer">
                        <p class="item-lender">${item.first_name} ${item.last_name}</p>
                        <button class="borrow-btn">Borrow</button>
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