document.getElementById('createAccountForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Account Request: ', { firstName, lastName, email, password });

    // You can add further processing here, such as sending this data to your server
    alert('Account request submitted!');
});
