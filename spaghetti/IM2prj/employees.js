document.addEventListener('DOMContentLoaded', () => {
    fetch('session_info.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedin) {
                if (!data.isAdmin) {
                    adminDiv = document.querySelector('.employeestoolbar');

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

document.addEventListener('DOMContentLoaded', function () {
    fetchEmployees();

    document.getElementById('employeeseditRecordBtn').addEventListener('click', function () {
        document.getElementById('employeeseditRecordModal').style.display = 'block';
    });

    document.getElementById('employeesaddRecordBtn').addEventListener('click', function () {
        document.getElementById('employeesaddRecordModal').style.display = 'block';
    });

    document.getElementById('employeesdeleteRecordBtn').addEventListener('click', function () {
        document.getElementById('employeesdeleteRecordModal').style.display = 'block';
    });

    document.querySelectorAll('.employeesclose').forEach(function (el) {
        el.addEventListener('click', function () {
            document.getElementById('employeeseditRecordModal').style.display = 'none';
            document.getElementById('employeesaddRecordModal').style.display = 'none';
            document.getElementById('employeesdeleteRecordModal').style.display = 'none';
        });
    });
});



function fetchEmployees() {
    fetch('employees.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'action': 'fetch'
        })
    })
        .then(response => response.json())
        .then(data => {
            let tableBody = document.getElementById('employeesrecordTableBody');
            tableBody.innerHTML = '';
            data.forEach(employee => {
                let row = `<tr>
                <td>${employee.id}</td>
                <td>${employee.last_name}</td>
                <td>${employee.first_name}</td>
                <td>${employee.contact_number}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${employee.permission}</td>
            </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error('Error:', error));
}

function displayEmployees(employees) {
    const tbody = document.querySelector('#employeesTable tbody');
    tbody.innerHTML = '';

    employees.forEach(function (employee) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.first_name}</td>
            <td>${employee.last_name}</td>
            <td>${employee.contact_number}</td>
            <td>${employee.email}</td>
            <td>${employee.department}</td>
            <td>${employee.permission}</td>
            <td>
                <button onclick="editEmployee(${employee.id})">Edit</button>
                <button onclick="deleteEmployee(${employee.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function employeessearchRecord() {
    const searchInput = document.getElementById('employeessearchInput').value.toLowerCase();
    const tableBody = document.getElementById('employeesrecordTableBody');
    const rows = tableBody.getElementsByTagName('tr');
    const searchResultsDiv = document.querySelector('.employeessearch-results');
    let searchResultsHTML = '';

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const id = cells[0].textContent.toLowerCase();
        const firstName = cells[1].textContent.toLowerCase();
        const lastName = cells[2].textContent.toLowerCase();

        if (id.includes(searchInput) || firstName.includes(searchInput) || lastName.includes(searchInput)) {
            searchResultsHTML = `
                <div class="employeesearch-result-item">
                    <div class="employeecolumn-name">
                        <p style="font-size:30px; margin-bottom:0px"><strong> ${capitalize(firstName)} ${capitalize(lastName)}</strong></p>
                        <p><strong>Contact Number:</strong><br> ${cells[3].textContent}</p>
                    </div>
                    <div class="employeecolumn details">
                        <p><strong>Employee ID:</strong><br> ${id}</p>
                        <p><strong>Email:</strong><br> ${cells[4].textContent}</p>
                    </div>
                    <div class="employeecolumn status">
                        <p><strong>Department:</strong><br> ${cells[5].textContent}</p>
                        <p><strong>Role:</strong><br> ${cells[6].textContent}</p>
                    </div>
                </div>
                <hr class="divider">`;
            break;
        }
    }

    searchResultsDiv.innerHTML = searchResultsHTML;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


function editEmployee(id) {
    const employee = document.getElementById(`employee-${id}`);
    document.getElementById('employeeseditEmployeeId').value = id;
    document.getElementById('employeeseditFirstName').value = employee.querySelector('.first_name').textContent;
    document.getElementById('employeeseditLastName').value = employee.querySelector('.last_name').textContent;
    document.getElementById('employeeseditContactNumber').value = employee.querySelector('.contact_number').textContent;
    document.getElementById('employeeseditEmail').value = employee.querySelector('.email').textContent;
    document.getElementById('employeeseditDepartment').value = employee.querySelector('.department').textContent;
    document.getElementById('employeeseditPermission').value = employee.querySelector('.permission').textContent;
    document.getElementById('employeeseditRecordModal').style.display = 'block';
}

function deleteEmployee(id) {
    document.getElementById('employeesdeleteEmployeeId').value = id;
    document.getElementById('employeesdeleteRecordModal').style.display = 'block';
}

function employeessaveEdit() {
    const id = document.getElementById('employeeseditEmployeeId').value;
    const firstName = document.getElementById('employeeseditFirstName').value;
    const lastName = document.getElementById('employeeseditLastName').value;
    const contactNumber = document.getElementById('employeeseditContactNumber').value;
    const email = document.getElementById('employeeseditEmail').value;
    const department = document.getElementById('employeeseditDepartment').value;
    const permission = document.getElementById('employeeseditPermission').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'employees.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('Record updated successfully');
            fetchEmployees();
            document.getElementById('employeeseditRecordModal').style.display = 'none';
        } else {
            alert('Error updating record');
        }
    };
    xhr.send(`action=edit&id=${id}&first_name=${firstName}&last_name=${lastName}&contact_number=${contactNumber}&email=${email}&department=${department}&permission=${permission}`);
}

function employeessaveAdd() {
    const id = document.getElementById('employeesaddEmployeeId').value;
    const firstName = document.getElementById('employeesaddFirstName').value;
    const lastName = document.getElementById('employeesaddLastName').value;
    const contactNumber = document.getElementById('employeesaddContactNumber').value;
    const email = document.getElementById('employeesaddEmail').value;
    const department = document.getElementById('employeesaddDepartment').value;
    const permission = document.getElementById('employeesaddPermission').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'employees.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('Record added successfully');
            fetchEmployees();
            document.getElementById('employeesaddRecordModal').style.display = 'none';
        } else {
            alert('Error adding record');
        }
    };
    xhr.send(`action=add&id=${id}&first_name=${firstName}&last_name=${lastName}&contact_number=${contactNumber}&email=${email}&department=${department}&permission=${permission}`);
}

function employeesconfirmDelete() {
    const id = document.getElementById('employeesdeleteEmployeeId').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'employees.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('Record deleted successfully');
            fetchEmployees();
            document.getElementById('employeesdeleteRecordModal').style.display = 'none';
        } else {
            alert('Error deleting record');
        }
    };
    xhr.send(`action=delete&id=${id}`);
}
