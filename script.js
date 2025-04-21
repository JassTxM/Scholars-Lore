const billForm = document.querySelector('.bill-form');
 if (billForm) {
        billForm.addEventListener('submit', function(k) {
            k.preventDefault(); // Prevent form submission
            alert('Payment processed successfully! Redirecting to confirmation page...');
        });
}
