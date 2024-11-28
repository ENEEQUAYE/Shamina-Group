document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});


//Function to fetch and populate manageUserTable
function fetchUsers() {
    fetch('http://localhost:5000/api/users') // Adjust the URL if needed
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(users => {
            const tableBody = document.getElementById('manageUsersTable');
            tableBody.innerHTML = ''; // Clear any existing rows

            users.forEach((user, index) => {
                const row = document.createElement('tr');

                // Add table cells
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.first_name} ${user.last_name}</td>
                    <td>${user.email}</td>
                    <td>${user.position || 'N/A'}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editUser('${user._id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
        
}

function editUser(userId) {
    console.log('Edit user:', userId);
    
    //update user details



}

function deleteUser(userId) {
    console.log('Delete user:', userId);
    // Implement delete functionality
}


// Fetch room bookings and populate the table
function fetchRoomBookings() {
    fetch('http://localhost:5000/api/rooms')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('roomBookingsTable');
            tableBody.innerHTML = ''; // Clear any existing content

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

// Call this function on page load
document.addEventListener('DOMContentLoaded', fetchRoomBookings);

// Fetch and populate appointments
fetch('http://localhost:5000/api/appointments')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
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
    

// Add event listener to the table to cancel appointments
    document.getElementById('appointmentsTable').addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const id = event.target.getAttribute('data-id');
            fetch(`http://localhost:5000/api/appointments/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                // Re-fetch and update table
                alert('Appointment canceled successfully!');
                fetchAppointments(); // Create a function to re-fetch the data 
            })
            .catch(error => {
                console.error('Error deleting appointment:', error);
            });
        }
    });

    
    // Add User Functionality
    function addUser() {
        const firstName = document.getElementById('userFirstName').value;
        const lastName = document.getElementById('userLastName').value;
        const email = document.getElementById('userEmail').value;
        const role = document.getElementById('role').value;
        const position = document.getElementById('position').value;
        const password = document.getElementById('userPassword').value;

        fetch('http://localhost:5000/api/auth/adduser', {
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
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(data.message || 'User added successfully!');
                    document.getElementById('addUserForm').reset();
                }
            })
            .catch((error) => {
                console.error('Error adding user:', error);
                alert('Failed to add user. Please try again.');
            });
    }


const myProfile = document.querySelector('#myProfile');

// Update Navbar Based on Login State
function updateNavbar() {
    const token = localStorage.getItem('token');
    const first_name = localStorage.getItem('first_name'); // User's name saved during login
    const role = localStorage.getItem('role'); // User's role saved during login

    if (token) {
        // User is logged in
        myProfile.innerHTML = `${first_name || 'My Profile'}`;
    } else {
        // User is not logged in
        myProfile.innerHTML = 'My Profile';
    }
}

// Initialize the Navbar on Page Load
document.addEventListener('DOMContentLoaded', updateNavbar);


// Fetch and populate activity bookings
document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch activity bookings
    async function fetchActivityBookings() {
        try {
            const response = await fetch('http://localhost:5000/api/activity/bookings');
            const bookings = await response.json();

            if (response.ok) {
                populateActivityBookingsTable(bookings);
            } else {
                console.error('Failed to fetch activity bookings:', bookings.error);
                alert('Failed to load activity bookings.');
            }
        } catch (error) {
            console.error('Error fetching activity bookings:', error);
            alert('An error occurred while fetching activity bookings.');
        }
    }

    // Function to populate the table
    function populateActivityBookingsTable(bookings) {
        const tableBody = document.getElementById('activityBookingsTable');
        tableBody.innerHTML = ''; // Clear existing rows

        bookings.forEach((booking, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${booking.name}</td>
                <td>${booking.email}</td>
                <td>${booking.phone}</td>
                <td>${booking.activityType.join(', ')}</td>
                <td>${new Date(booking.activityDate).toLocaleDateString()}</td>
                <td>${booking.numberOfGuests}</td>
                <td>${booking.specialRequests || 'None'}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteBooking('${booking._id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Attach deleteBooking to the window object
    window.deleteBooking = async function deleteBooking(bookingId) {
        if (confirm('Are you sure you want to delete this booking?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/activity/bookings/${bookingId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Booking deleted successfully!');
                    fetchActivityBookings(); // Refresh the table
                } else {
                    alert('Failed to delete the booking.');
                }
            } catch (error) {
                console.error('Error deleting booking:', error);
                alert('An error occurred while deleting the booking.');
            }
        }
    };


    // Initial fetch of activity bookings
    fetchActivityBookings();
});


