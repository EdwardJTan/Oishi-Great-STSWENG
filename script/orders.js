document.addEventListener('DOMContentLoaded', (event) => {
    const userIcon = document.getElementById('userIcon');
    const dropdownContent = document.getElementById('dropdownContent');

    userIcon.addEventListener('mouseover', () => {
        dropdownContent.style.display = 'block';
    });

    userIcon.addEventListener('mouseout', () => {
        dropdownContent.style.display = 'none';
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const billingData = [
        { id: '#39201', date: '06/15/2021', amount: '$29.99', status: 'Pending' },
        { id: '#38594', date: '05/15/2021', amount: '$29.99', status: 'Completed' },
        { id: '#38223', date: '04/15/2021', amount: '$29.99', status: 'Cancelled' },
        { id: '#38125', date: '03/15/2021', amount: '$29.99', status: 'Shipped' },
        { id: '#38124', date: '03/15/2021', amount: '$29.99', status: 'Returned' },
        { id: '#38123', date: '03/15/2021', amount: '$29.99', status: 'Processing' },
        { id: '#38122', date: '03/15/2021', amount: '$29.99', status: 'Delivered' },
        { id: '#38122', date: '03/15/2021', amount: '$29.99', status: 'On-Hold' },
        { id: '#38122', date: '03/15/2021', amount: '$29.99', status: 'Refunded' },
        { id: '#38122', date: '03/15/2021', amount: '$29.99', status: 'Delivered' },
        // ... (more rows as needed)
    ];

    const rowsPerPage = 4;
    let currentPage = 1;

    const tableBody = document.querySelector('#billingTable tbody');
    const pageInfo = document.getElementById('pageInfo');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    function renderTable(page) {
        tableBody.innerHTML = '';
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const rows = billingData.slice(start, end);

        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.date}</td>
                <td>${row.amount}</td>
                <td><span class="status ${row.status.toLowerCase()}">${row.status}</span></td>
            `;
            tableBody.appendChild(tr);
        });

        pageInfo.textContent = `Page ${page}`;

        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = end >= billingData.length;
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(currentPage);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage * rowsPerPage < billingData.length) {
            currentPage++;
            renderTable(currentPage);
        }
    });

    renderTable(currentPage);
});
