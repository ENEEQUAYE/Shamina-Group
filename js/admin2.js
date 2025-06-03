// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Sidebar, Logout Button, Active Navigation, and other functionalities
    initSidebar();
    initLogoutButton();
    initActiveNavigation();
    fetchUsers();
    fetchRoomBookings();
    fetchAppointments();
    fetchActivityBookings();
    updateNavbar();
});

// Sidebar Navigation Functionality
function initSidebar() {
    const navLinks = document.querySelectorAll('#sidebar a[data-target]');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('data-target'));

            contentSections.forEach(section => section.classList.add('d-none'));
            if (target) target.classList.remove('d-none');
        });
    });

    document.querySelector('#sidebar a[data-target="#overview"]').click(); // Default click action
}

// Logout Button Functionality
function initLogoutButton() {
    const logoutButton = document.querySelector('#logoutButton');
    logoutButton.addEventListener('click', () => {
        // Clear local storage and redirect to index page
        localStorage.clear();
        window.location.href = 'index.html';
    });
}

// Active Navigation Highlighting
function initActiveNavigation() {
    const navItems = document.querySelectorAll('#sidebar a[data-target]');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(navItem => {
                navItem.style.backgroundColor = '';
            });
            item.style.backgroundColor = '#0079a1'; // Active item color
        });
    });
    document.querySelector('#sidebar a[data-target="#overview"]').style.backgroundColor = '#0079a1';
}

// Navbar Update Based on Login State
function updateNavbar() {
    const token = localStorage.getItem('token');
    const first_name = localStorage.getItem('first_name');
    // const myProfile = document.querySelector('#myProfile');

    if (token) {
        myProfile.innerHTML = `${first_name || 'My Profile'}`;
    } else {
        myProfile.innerHTML = 'My Profile';
    }
}

// Fetch Users and Populate the Table
function fetchUsers() {
    fetch('https://shaminagroupltd.onrender.com/api/users') // Adjust URL if necessary
        .then(response => response.json())
        .then(users => {
            const tableBody = document.getElementById('manageUsersTable');
            tableBody.innerHTML = ''; // Clear existing rows

            users.forEach((user, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.first_name} ${user.last_name}</td>
                    <td>${user.email}</td>
                    <td>${user.position || 'N/A'}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="showEditModal('${user._id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

// Show the Edit User Modal with User Data
function showEditModal(userId) {
    fetch(`https://shaminagroupltd.onrender.com/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('editUserId').value = user._id;
            document.getElementById('editFirstName').value = user.first_name;
            document.getElementById('editLastName').value = user.last_name;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editRole').value = user.role;

            const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editModal.show();
        })
        .catch(error => console.error('Error fetching user data:', error));
}

// Submit the Edit User Form
document.getElementById('editUserForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const userId = document.getElementById('editUserId').value;
    const updatedUser = {
        first_name: document.getElementById('editFirstName').value,
        last_name: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        role: document.getElementById('editRole').value,
    };

    fetch(`https://shaminagroupltd.onrender.com/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
    })
        .then(response => response.json())
        .then(data => {
            console.log('User updated:', data);
            fetchUsers(); // Refresh table
            bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
        })
        .catch(error => console.error('Error updating user:', error));
});

// Delete a User
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`https://shaminagroupltd.onrender.com/api/users/${userId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log('User deleted:', data);
                fetchUsers(); // Refresh table
            })
            .catch(error => console.error('Error deleting user:', error));
    }
}

// Fetch Room Bookings and Populate the Table
function fetchRoomBookings() {
    fetch('https://shaminagroupltd.onrender.com/api/rooms')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('roomBookingsTable');
            tableBody.innerHTML = ''; // Clear existing content

            data.forEach((booking, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${booking.name}</td>
                    <td>${booking.email}</td>
                    <td>${booking.phone}</td>
                    <td>${booking.roomType}</td>
                    <td>${booking.numberOfGuests}</td>
                    <td>${new Date(booking.checkinDate).toLocaleDateString()}</td>
                    <td>${new Date(booking.checkoutDate).toLocaleDateString()}</td>
                    <td>${booking.specialRequests || 'None'}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteRoomBooking('${booking._id}')">
                            Delete
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching room bookings:', error);
        });
}

// Delete a Room Booking
function deleteRoomBooking(bookingId) {
    if (confirm('Are you sure you want to delete this room booking?')) {
        fetch(`https://shaminagroupltd.onrender.com/api/rooms/${bookingId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(() => {
                fetchRoomBookings(); // Refresh the table
                alert('Room booking deleted successfully!');
            })
            .catch(error => {
                console.error('Error deleting room booking:', error);
                alert('Failed to delete the booking.');
            });
    }
}

// Fetch Appointments and Populate the Table
function fetchAppointments() {
    fetch('https://shaminagroupltd.onrender.com/api/appointments')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('appointmentsTable');
            tableBody.innerHTML = ''; // Clear previous content

            data.forEach((appointment, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${appointment.first_name} ${appointment.last_name}</td>
                        <td>${appointment.email}</td>
                        <td>${appointment.phone}</td>
                        <td>${appointment.consultancy_type}</td>
                        <td>${new Date(appointment.date).toLocaleDateString()}</td>
                        <td>${appointment.time}</td>
                        <td>${appointment.message || 'None'}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" data-id="${appointment._id}">Cancel</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error fetching appointments:', error);
        });
}

// Add User Functionality
function addUser() {
    const firstName = document.getElementById('userFirstName').value;
    const lastName = document.getElementById('userLastName').value;
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('role').value;
    const position = document.getElementById('position').value;
    const password = document.getElementById('userPassword').value;

    fetch('https://shaminagroupltd.onrender.com/api/auth/adduser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            role,
            position,
        }),
    })
        .then(response => response.json())
        .then(user => {
            console.log('User added:', user);
            fetchUsers(); // Refresh the users table
        })
        .catch(error => {
            console.error('Error adding user:', error);
        });
}
