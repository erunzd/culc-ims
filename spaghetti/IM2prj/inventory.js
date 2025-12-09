document.addEventListener('DOMContentLoaded', () => {
    fetch('session_info.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedin) {
                if (!data.isAdmin) {
                    const adminDiv = document.querySelector('.buttons');
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

    // Modal elements
    const updateStockModal = document.getElementById("updateStockModal");
    const addProductModal = document.getElementById("addProductModal");
    const deleteProductModal = document.getElementById("deleteProductModal");

    // Button elements
    const updateStockBtn = document.getElementById("updateStockBtn");
    const addProductBtn = document.getElementById("addProductBtn");
    const deleteProductBtn = document.getElementById("deleteProductBtn");

    // Close button elements
    const updateStockClose = document.getElementById("updateStockClose");
    const addProductClose = document.getElementById("addProductClose");
    const deleteProductClose = document.getElementById("deleteProductClose");

    // Event listeners to open modals
    updateStockBtn.addEventListener("click", () => {
        updateStockModal.style.display = "block";
    });

    addProductBtn.addEventListener("click", () => {
        addProductModal.style.display = "block";
    });

    deleteProductBtn.addEventListener("click", () => {
        deleteProductModal.style.display = "block";
    });

    // Event listeners to close modals
    updateStockClose.addEventListener("click", () => {
        updateStockModal.style.display = "none";
    });

    addProductClose.addEventListener("click", () => {
        addProductModal.style.display = "none";
    });

    deleteProductClose.addEventListener("click", () => {
        deleteProductModal.style.display = "none";
    });

    // Close the modal if the user clicks anywhere outside of it
    window.addEventListener("click", (event) => {
        if (event.target == updateStockModal) {
            updateStockModal.style.display = "none";
        }
        if (event.target == addProductModal) {
            addProductModal.style.display = "none";
        }
        if (event.target == deleteProductModal) {
            deleteProductModal.style.display = "none";
        }
    });

    // Function to fetch and display inventory data
    const fetchInventory = () => {
        fetch("inventory.php?action=get_inventory")
            .then(response => response.json())
            .then(data => {
                console.log('Inventory data:', data); // Log the data for debugging
                const inventoryTable = document.getElementById("inventoryTable").getElementsByTagName("tbody")[0];
                inventoryTable.innerHTML = ''; // Clear existing rows
                data.forEach(item => {
                    const row = inventoryTable.insertRow();
                    row.insertCell(0).innerText = item.product_code;
                    row.insertCell(1).innerText = item.wood_type;
                    row.insertCell(2).innerText = item.size;
                    row.insertCell(3).innerText = item.quantity;
                    row.insertCell(4).innerText = item.location;
                    row.insertCell(5).innerText = item.price;
                });
            })
            .catch(error => console.error('Error fetching inventory:', error)); // Add error handling
    };

    // Function to fetch and display low stock data
    const fetchLowStock = () => {
        fetch("inventory.php?action=get_low_stock")
            .then(response => response.json())
            .then(data => {
                console.log('Low stock data:', data); // Log the data for debugging
                const lowStockTable = document.getElementById("lowStockTable").getElementsByTagName("tbody")[0];
                lowStockTable.innerHTML = ''; // Clear existing rows
                data.forEach(item => {
                    const row = lowStockTable.insertRow();
                    row.insertCell(0).innerText = item.product_code;
                    row.insertCell(1).innerText = item.wood_type;
                    row.insertCell(2).innerText = item.size;
                    row.insertCell(3).innerText = item.quantity;
                    row.insertCell(4).innerText = item.location;
                    row.insertCell(5).innerText = item.price;
                });
            })
            .catch(error => console.error('Error fetching low stock:', error)); // Add error handling
    };

    // Handle form submissions
    document.getElementById("updateStockForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        fetch("inventory.php?action=update", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Update stock response:', data); // Log the response for debugging
                alert(data.message);
                if (data.success) {
                    fetchInventory();
                    fetchLowStock();
                    updateStockModal.style.display = "none";
                }
            })
            .catch(error => console.error('Error updating stock:', error)); // Add error handling
    });

    document.getElementById("addProductForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        fetch("inventory.php?action=add", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Add product response:', data); // Log the response for debugging
                alert(data.message);
                if (data.success) {
                    fetchInventory();
                    fetchLowStock();
                    addProductModal.style.display = "none";
                }
            })
            .catch(error => console.error('Error adding product:', error)); // Add error handling
    });

    document.getElementById("deleteProductForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        fetch("inventory.php?action=delete", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Delete product response:', data); // Log the response for debugging
                alert(data.message);
                if (data.success) {
                    fetchInventory();
                    fetchLowStock();
                    deleteProductModal.style.display = "none";
                }
            })
            .catch(error => console.error('Error deleting product:', error)); // Add error handling
    });

    // Initial fetch of inventory and low stock data
    fetchInventory();
    fetchLowStock();
});
