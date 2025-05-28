document.addEventListener('DOMContentLoaded', function() {
    const adminRegisterForm = document.querySelector('#adminRegisterForm');

 
    if (adminRegisterForm) {
        adminRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault();

           
            const email = adminRegisterForm['email'].value;
            const password = adminRegisterForm['password'].value;

        
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    
                    adminRegisterForm.reset();
                   
                    window.location.href = 'admin-login.html';
                })
                .catch((error) => {
                    
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error(`Error: ${errorCode} - ${errorMessage}`);
                   
                });
        });
    } else {
        console.error('Admin register form not found.');
    }
});
