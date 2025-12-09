document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.querySelector('input[type="checkbox"]');
    const errorMessage = document.getElementById('error-message');

    // Load saved email and password
    if (localStorage.getItem('rememberMe') === 'true') {
        emailInput.value = localStorage.getItem('email');
        passwordInput.value = localStorage.getItem('password');
        rememberMeCheckbox.checked = true;
    }

    // Form submission event
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate form
        if (!email || !password) {
            errorMessage.textContent = 'Please fill in both email and password.';
            errorMessage.style.display = 'block';
            return;
        }

        try {
            const response = await fetch('login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ email, password })
            });

            const result = await response.json();

            if (result.success) {
                // Remember Me functionality
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('email', email);
                    localStorage.setItem('password', password);
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('email');
                    localStorage.removeItem('password');
                    localStorage.removeItem('rememberMe');
                }

                window.location.href = 'dash.html';

            } else {
                errorMessage.textContent = result.message;
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = 'An error occurred. Please try again.';
            errorMessage.style.display = 'block';
        }
    });

    // Forgot Password event
    const forgotPasswordLink = document.querySelector('.options a[href="#"]');
    forgotPasswordLink.addEventListener('click', (event) => {
        event.preventDefault();
        alert('Password recovery instructions have been sent to your email.');
    });
});
