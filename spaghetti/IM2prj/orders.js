document.addEventListener('DOMContentLoaded', () => {
    fetch('session_info.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedin) {
                if (!data.isAdmin) {}
            } else {
                alert("You are not logged in");
                window.location.href = 'index.html'; // Redirect to login page if not logged in
            }
        })
        .catch(error => console.error('Error fetching session info:', error));
});

document.addEventListener("DOMContentLoaded", function () {
    // Send AJAX request to orders.php
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'orders.php', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                var orders = JSON.parse(xhr.responseText);
                var ordersTable = document.getElementById('ordersTable');
                var tbody = ordersTable.getElementsByTagName('tbody')[0];

                // Loop through each order and add a table row
                orders.forEach(function (order) {
                    var row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${order.order_id}</td>
                        <td>${order.customer_id}</td>
                        <td>${order.employee_id}</td>
                        <td>${order.order_date_created}</td>
                        <td>${order.order_date_completed}</td>
                        <td>${order.delivery_address}</td>
                        <td>${order.total_cost}</td>
                        <td>${order.date_paid}</td>
                        <td>${order.status}</td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (e) {
                console.error('Error parsing JSON:', e);
            }
        } else {
            console.error('Error retrieving orders:', xhr.statusText);
        }
    };
    xhr.send();
});
