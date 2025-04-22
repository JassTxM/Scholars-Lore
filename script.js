const contactForm = document.querySelector('.c-form');
if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent form submission

            alert('Your request has been sent. Please wait till our team contacts you!');
        });
 }