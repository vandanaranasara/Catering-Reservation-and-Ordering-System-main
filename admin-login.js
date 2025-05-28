

document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.querySelector('#adminLoginForm');

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = adminLoginForm['email'].value;
            const password = adminLoginForm['password'].value;

        
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                 
                    adminLoginForm.reset();
                  
                    window.location.href = 'admin-dashboard.html';
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error(`Error: ${errorCode} - ${errorMessage}`);
                    
                });
        });
    } else {
        console.error('Admin login form not found.');
    }
});
