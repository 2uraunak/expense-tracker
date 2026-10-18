let transactions = JSON.parse(localStorage.getItem('transactions')) || [
    { id: 1, desc: 'Monthly Scholarship Stipend', amount: 8000, type: 'income', category: 'Income / Stipend' },
    { id: 2, desc: 'Engineering Textbooks', amount: 1450, type: 'expense', category: 'Education & Books' },
    { id: 3, desc: 'Cafeteria & Lunch', amount: 650, type: 'expense', category: 'Food & Dining' },
    { id: 4, desc: 'Metro Transit Card', amount: 800, type: 'expense', category: 'Travel & Commute' }
];

let chartInstance = null;

function updateUI() {
    const list = document.getElementById('txList');
    list.innerHTML = '';
    let totalIncome = 0;
    let totalExpense = 0;
    const catMap = {};

    transactions.forEach(tx => {
        if (tx.type === 'income') totalIncome += tx.amount;
        else {
            totalExpense += tx.amount;
            catMap[tx.category] = (catMap[tx.category] || 0) + tx.amount;
        }

        const li = document.createElement('li');
        li.className = `tx-item ${tx.type}`;
        li.innerHTML = `
            <div class="tx-info">
                <span class="tx-title">${tx.desc}</span>
                <span class="tx-cat">${tx.category}</span>
            </div>
            <div style="display:flex; align-items:center;">
                <span class="tx-amount" style="color: ${tx.type === 'income' ? '#10b981' : '#ef4444'}">
                    ${tx.type === 'income' ? '+' : '-'}₹${tx.amount.toFixed(2)}
                </span>
                <button class="tx-del" onclick="deleteTx(${tx.id})">×</button>
            </div>
        `;
        list.appendChild(li);
    });

    const balance = totalIncome - totalExpense;
    document.getElementById('totalBalance').innerText = `₹${balance.toFixed(2)}`;
    document.getElementById('totalIncome').innerText = `₹${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpense').innerText = `₹${totalExpense.toFixed(2)}`;

    updateChart(catMap);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateChart(catMap) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const labels = Object.keys(catMap);
    const data = Object.values(catMap);

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length ? labels : ['No Expenses Yet'],
            datasets: [{
                data: data.length ? data : [1],
                backgroundColor: ['#6366f1', '#ec4899', '#f59e0b', '#38bdf8', '#10b981', '#a855f7'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } }
            }
        }
    });
}

function deleteTx(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
}

document.getElementById('txForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = document.getElementById('desc').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;

    if (!desc || isNaN(amount) || amount <= 0) return;

    transactions.push({ id: Date.now(), desc, amount, type, category });
    document.getElementById('desc').value = '';
    document.getElementById('amount').value = '';
    updateUI();
});

document.getElementById('clearAll').addEventListener('click', () => {
    if (confirm('Clear all recorded transactions?')) {
        transactions = [];
        updateUI();
    }
});

updateUI();
