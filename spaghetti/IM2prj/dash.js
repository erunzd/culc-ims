document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('dash.php');
        if (!response.ok) {
            throw new Error(`Network response was not ok ${response.statusText}`);
        }
        const data = await response.json();

        if (data.error) {
            console.error('Error from server:', data.error);
            return;
        }

        document.getElementById('to-be-packed-count').innerHTML = data.stats.to_be_packed;
        document.getElementById('to-be-shipped-count').innerHTML = data.stats.to_be_shipped;
        document.getElementById('to-be-delivered-count').innerHTML = data.stats.delivered;

        document.getElementById('quantity-in-hand-count').innerHTML = data.summaries.quantity_in_hand;
        document.getElementById('number-of-customers-count').innerHTML = data.summaries.number_of_customers;
        document.getElementById('number-of-branches-count').innerHTML = data.summaries.number_of_branches;
        document.getElementById('number-of-categories-count').innerHTML = data.summaries.number_of_categories;

        const inventoryTable = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
        data.inventory.forEach((item) => {
            const row = inventoryTable.insertRow();
            row.insertCell(0).innerText = item.product_code;
            row.insertCell(1).innerText = item.wood_type;
            row.insertCell(2).innerText = item.size;
            row.insertCell(3).innerText = item.quantity;
            row.insertCell(4).innerText = item.location;
            row.insertCell(5).innerText = item.price;
        });
    } catch (error) {
        console.error('Error:', error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('session_info.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedin) {
                // User is logged in, no action needed
            } else {
                alert("You are not logged in");
                window.location.href = 'index.html'; // Redirect to login page if not logged in
            }
        })
        .catch(error => console.error('Error fetching session info:', error));
});
