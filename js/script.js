// Scroll to top button
var backToTopBtn = document.getElementById("backToTopBtn");
var rootElement = document.documentElement;

function scrollToTop() {
    rootElement.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Show button when user scrolls down
window.addEventListener("scroll", function() {
    if (rootElement.scrollTop > 100) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
});

document.addEventListener('DOMContentLoaded', () => {

// Select DOM elements
const loginButton = document.querySelector('#loginButton');
const myProfile = document.querySelector('#myProfile');
const bookConsultationButton = document.querySelector('#bookConsultation');
const appointmentForm = document.querySelector('#appointmentForm');

// Update Navbar based on Login State
function updateNavbar() {
    const token = localStorage.getItem('token');
    const first_name = localStorage.getItem('first_name'); // User's name saved during login

    if (token) {
        // User is logged in
        loginButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        loginButton.removeAttribute('data-bs-toggle');
        loginButton.removeAttribute('data-bs-target');
        loginButton.addEventListener('click', logout);

        myProfile.innerHTML = `<i class="fas fa-user-circle"></i> ${first_name || 'My Profile'}`;
    } else {
        // User is not logged in
        loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        loginButton.setAttribute('data-bs-toggle', 'modal');
        loginButton.setAttribute('data-bs-target', '#loginModal');
        loginButton.removeEventListener('click', logout);

        myProfile.innerHTML = '<i class="fas fa-user-circle"></i> My Profile';
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('first_name');
    alert('You have successfully logged out.');
    location.reload(); // Reload page to reset UI
}

// Handle Login Form Submission
document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;

    try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log('Login Response:', data); // Log the response for debugging

        if (res.ok) {
            // Save token and user's name in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('first_name', data.first_name);

            // Success message and close modal
            alert('Login successful!');
            // Hide the modal
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            loginModal.hide();

            // Update the navbar
            updateNavbar();
        } else {
            alert(data.error || 'Invalid email or password.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Handle Signup Form Submission
document.querySelector('#signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const first_name = document.querySelector('#signupFirstName').value;
    const last_name = document.querySelector('#signupLastName').value;
    const email = document.querySelector('#signupEmail').value;
    const password = document.querySelector('#signupPassword').value;

    try {
        const res = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name, last_name, email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            alert('Signup successful! Please log in to continue.');
            const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
            signupModal.hide();

            // Optionally, show the login modal
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        } else {
            alert(data.error || 'Signup failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// // Handle Book Consultation Button
if (bookConsultationButton) {
    bookConsultationButton.addEventListener('click', () => {
        const token = localStorage.getItem('token'); // Check if user is logged in

        if (!token) {
            // User is not logged in, show login modal
            alert('You need to log in to book a consultation.');
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
            return;
        }

        //automatially show the appointment modal after login
        const appointmentModal = new bootstrap.Modal(document.getElementById('appointmentModal'));
        appointmentModal.show();
    });
}


// Room Booking Form Submission
document.getElementById('roomBookingForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:5000/api/room/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (response.ok) {
            alert(result.message || 'Room booked successfully!');
            event.target.reset();
        } else {
            alert(result.error || 'Failed to book room.');
        }
    } catch (error) {
        alert('Error booking room. Please try again.');
        console.error(error);
    }
});

//Activity Booking
document.getElementById('activityBookingForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);
    const activityType = Array.from(
        document.querySelectorAll('input[name="activityType"]:checked')
    ).map((checkbox) => checkbox.value);

    // Prepare payload
    const data = { 
        ...Object.fromEntries(formData.entries()), 
        activityType 
    };

    try {
        const response = await fetch('http://localhost:5000/api/activity/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        alert(result.message || 'Activity booked successfully!');
        event.target.reset();
    } catch (error) {
        alert('Error booking activity. Please try again.');
    }
});

//Consultancy Bookiing Appointment
document.querySelector('#appointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        consultancy_type: document.querySelector('#consultancyType').value,
        first_name: document.querySelector('#firstName').value,
        last_name: document.querySelector('#lastName').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phone').value,
        date: document.querySelector('#date').value,
        time: document.querySelector('#time').value,
        message: document.querySelector('#message').value,
    };

    try {
        const res = await fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message); // Success message
            const appointmentModal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
            appointmentModal.hide();
            document.querySelector('#appointmentForm').reset();
        } else {
            alert(data.error || 'Failed to book appointment.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while booking your appointment. Please try again.');
    }
});

//Get all users
// document.querySelector('#getUsers').addEventListener('click', async () => {
//     try {
//         const response = await fetch('http://localhost:5000/api/users');
//         const users = await response.json();
//         console.log(users);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// });


 





// Initialize the Navbar on Page Load
document.addEventListener('DOMContentLoaded', updateNavbar);

});
