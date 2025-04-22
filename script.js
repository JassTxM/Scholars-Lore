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
