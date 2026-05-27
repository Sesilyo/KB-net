// FILENAME: injectTransactions.js
// Fetches and rendering of transaction card for both borrower and lender

// helper function to format datetime into something more readable for display
function formatDateTime(dt) {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('en-PH', {
        year:   'numeric',
        month:  'short',
        day:    'numeric',
        hour:   '2-digit',
        minute: '2-digit'
    });
}

function toDateTimeLocal(dt) {
    if(!dt) return '';
    return dt.replace(' ', 'T').slice(0, 16);
}

function borrowerView(tx) {
    return `
    <p class="tx-counterpart">Lender: ${tx.first_name} ${tx.last_name}</p>
    <p>Start:       ${formatDateTime(tx.start_date)}</p>
    <p>End:         ${formatDateTime(tx.end_date)}</p>
    <p>Returned:    ${formatDateTime(tx.returned_date)}</p>
    <p>Notes:       ${tx.notes ?? '-'}</p>
    <p class="tx-status-label">
        ${tx.is_returned ? 'Returned' : 'Active'}
    </p>`;
}

function lenderEditForm(tx) {
    return `
    <p class="tx-counterpart"> Borrower: ${tx.first_name} ${tx.last_name} </p>
    <label> Start Date
        <input class = "tx-start" type = "datetime-local"
            value="${toDateTimeLocal(tx.start_date)}">
    </label>

    <label> End Date
        <input class = "tx-end" type = "datetime-local"
            value="${toDateTimeLocal(tx.end_date)}">
    </label>

    <label class = "tx-returned-label">
        <input class = "tx-returned" type = "checkbox"
            ${tx.is_returned ? 'checked' : ''}>
        Mark as Returned
    </label>

    <label> Notes
        <textarea class = "tx-notes">${tx.notes ?? ''}</textarea>
    </label>

    <label> Penalty Fee
        <input class = "tx-penalty" type = "number" step = "0.01"
            value="${tx.penalty_fee ?? '0.00'}">
        <small> Auto-calculated. Edit only if manual correction is needed.</small>
    </label>

    <button class = "tx-save-btn" data-id = "${tx.transaction_id}">
        Save changes
    </button>`;
}

// transaction cards
function createTransactionCard(tx, role) {
    const isLender = role === 'lender';
    return `
    <div class = "transaction-card" data-id = "${tx.transaction_id}">
        <div class = "tx-img-wrap">
            <img src = "${tx.image_path}" alt = "${tx.item_name}"
                onerror = "this.style.display = 'none'">
        </div>
        <div class = "tx-info">
            <h3> ${tx.item_name} </h3>
            <p class = "tx-category"> ${tx.category_name} </p>
            <p class = "tx-id"> Transaction ID: ${tx.transaction_id} </p>
            <p class = "tx-price"> ₱${tx.price_pr_hr}/hr </p>
            
            ${isLender ? lenderEditForm(tx) : borrowerView(tx)}
        </div>
    </div>`;
}

// save transaction when btn is clicked
async function saveTransaction(card) {
    const payload = {
        transaction_id: card.dataset.id,
        start_date:     card.querySelector('.tx-start').value.replace('T', ' '),
        end_date:       card.querySelector('.tx-end').value.replace('T', ' '),
        is_returned:    card.querySelector('.tx-returned').checked ? 1 : 0,
        notes:          card.querySelector('.tx-notes').value,
        penalty_fee:    card.querySelector('.tx-penalty').value,
    }

    // POST request
    const res = await fetch('/api/updateTransaction.php', {
        method:     'POST',
        headers:    { 'Content-Type': 'application/json' },
        body:       JSON.stringify(payload)     // JS object to JSON string
    });

    const data = await res.json();

    if (data.success) {
        alert('Transaction updated!');
    } else {
        alert('Something went wrong. Please try again.');
    }
};

// main inject function
async function injectTransactions(containerId, role, userId, is_returned = '') {
    const container = document.getElementById(containerId);

    container.innerHTML = '<p> Loading transactions. . . </p>'

    const params = new URLSearchParams({role, id: userId});
    if(is_returned !== '') params.append('is_returned', is_returned);

    const res   = await fetch(`../api/getTransactions.php?${params}`);
    const data  = await res.json();

    // handles error response from PHP
    if (data.error) {
        container.innerHTML = `<p class = "tx-error"> ${data.error}</p>`;
        return;
    }

    container.innerHTML = data.length
        ? data.map(tx => createTransactionCard(tx, role)).join('')
        : '<p class = "tx-empty"> No transactions found. </p>';

    container.querySelectorAll('.tx-save-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.transaction-card');
            saveTransaction(card);
        });
    });
}

export { injectTransactions };