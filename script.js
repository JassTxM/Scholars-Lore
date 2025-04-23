const contactForm = document.querySelector('.c-form');
if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent form submission

            alert('Your request has been sent. Please wait till our team contacts you!');
        });
 }

 const billForm = document.querySelector('.bill-form');
 if (billForm) {
        billForm.addEventListener('submit', function(k) {
            k.preventDefault(); // Prevent form submission
            alert('Payment processed successfully! Redirecting to confirmation page...');
        });
}

// Login Logic for Login Page

const validUsername = "user";
const validPassword = "pass123";

function validateLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const usernameError = document.getElementById("username-error");
    const passwordError = document.getElementById("password-error");

    let isValid = true;

    // Reset error messages
    usernameError.style.display = "none";
    passwordError.style.display = "none";

    if (username.value !== validUsername) {
        usernameError.textContent = "Invalid Username";
        usernameError.style.display = "block";
        isValid = false;
    }

    if (password.value !== validPassword) {
        passwordError.textContent = "Invalid Password";
        passwordError.style.display = "block";
        isValid = false;
    }

    if (isValid) {
        window.location.href = "./pages/home.html";
    }
}

