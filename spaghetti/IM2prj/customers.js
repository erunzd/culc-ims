document.addEventListener('DOMContentLoaded', () => {
    fetch('session_info.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedin) {
                if (!data.isAdmin) {
                    const adminDiv = document.querySelector('.customerstoolbar');
                    if (adminDiv) {
                        adminDiv.style.display = "none";
                    }
                }
            } else {
                alert("You are not logged in");
                window.location.href = 'index.html'; // Redirect to login page if not logged in
            }
        })
        .catch(error => console.error('Error fetching session info:', error));
});

document.getElementById('customerseditRecordBtn').addEventListener('click', function () {
    document.getElementById('customerseditRecordModal').style.display = 'block';
});

document.getElementById('customersaddRecordBtn').addEventListener('click', function () {
    document.getElementById('customersaddRecordModal').style.display = 'block';
});

document.getElementById('customersdeleteRecordBtn').addEventListener('click', function () {
    document.getElementById('customersdeleteRecordModal').style.display = 'block';
});

document.querySelectorAll('.customersclose').forEach(function (closeBtn) {
    closeBtn.addEventListener('click', function () {
        this.parentElement.parentElement.style.display = 'none';
    });
});

function customerscloseModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function customerssearchRecord() {
    const searchInput = document.getElementById('customerssearchInput').value.toLowerCase();
    const tableBody = document.getElementById('customersrecordTableBody');
    const rows = tableBody.getElementsByTagName('tr');
    const searchResultsDiv = document.querySelector('.customerssearch-results');
    let searchResultsHTML = '';

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const id = cells[0].textContent.toLowerCase();
        const name = cells[1].textContent.toLowerCase();

        if (id.includes(searchInput) || name.includes(searchInput)) {
            searchResultsHTML = `
                <div class="customersearch-result-item">
                    <div class="customercolumn-name">
                    <p style="font-size:30px; margin-bottom:0px"><strong> ${capitalize(name)}</strong></p>
                        <p><strong>Contact Number:</strong><br> ${cells[2].textContent}</p>
                    </div>
                    <div class="customercolumn details">
                        <p><strong>Customer ID:</strong><br> ${id}</p>
                        <p><strong>Email:</strong><br> ${cells[3].textContent}</p>
                    </div>
                    <div class="customercolumn status">
                        <p><strong>Credibility:</strong><br> ${cells[4].textContent}</p>
                    </div>
                </div>
                <hr class="divider">`;
            break;
        }
    }

    searchResultsDiv.innerHTML = searchResultsHTML;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function customerssaveEdit() {
    const customerId = document.getElementById('customerseditCustomerId').value;
    const name = document.getElementById('customerseditName').value;
    const contactNumber = document.getElementById('customerseditContactNumber').value;
    const email = document.getElementById('customerseditEmail').value;
    const credibility = document.getElementById('customerseditCredibility').value;

    const data = new FormData();
    data.append('action', 'edit');
    data.append('customer_id', customerId);
    data.append('name', name);
    data.append('contact_number', contactNumber);
    data.append('email', email);
    data.append('credibility_status', credibility);

    fetch('customers.php', {
        method: 'POST',
        body: data
    }).then(response => response.text())
        .then(result => {
            console.log(result);
            loadCustomers();
        });

    customerscloseModal('customerseditRecordModal');
}

function customerssaveAdd() {
    // Remove customerId
    const name = document.getElementById('customersaddName').value;
    const contactNumber = document.getElementById('customersaddContactNumber').value;
    const email = document.getElementById('customersaddEmail').value;
    const credibility = document.getElementById('customersaddCredibility').value;

    const data = new FormData();
    data.append('action', 'add');
    data.append('name', name);
    data.append('contact_number', contactNumber);
    data.append('email', email);
    data.append('credibility_status', credibility);

    fetch('customers.php', {
        method: 'POST',
        body: data
    }).then(response => response.text())
        .then(result => {
            console.log(result);
            loadCustomers();
        });

    customerscloseModal('customersaddRecordModal');
}

function customersconfirmDelete() {
    const customerId = document.getElementById('customersdeleteCustomerId').value;

    const data = new FormData();
    data.append('action', 'delete');
    data.append('customer_id', customerId);

    fetch('customers.php', {
        method: 'POST',
        body: data
    }).then(response => response.text())
        .then(result => {
            console.log(result);
            loadCustomers();
        });

    customerscloseModal('customersdeleteRecordModal');
}

function loadCustomers() {
    fetch('customers.php', {
        method: 'POST',
        body: new URLSearchParams('action=read')
    })
        .then(response => response.json())
        .then(customers => {
            const tableBody = document.getElementById('customersrecordTableBody');
            tableBody.innerHTML = '';

            customers.forEach(customer => {
                const newRow = tableBody.insertRow();
                newRow.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.contact_number}</td>
                <td>${customer.email}</td>
                <td>${customer.credibility_status}</td>`;
            });
        });
}

document.addEventListener('DOMContentLoaded', loadCustomers);
