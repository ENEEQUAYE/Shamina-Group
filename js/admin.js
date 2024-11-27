document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});

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
    // Implement edit functionality
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

    // Add a new user
    function addUser() {
        const firstName = document.getElementById('userFirstName').value;
        const lastName = document.getElementById('userLastName').value;
        const email = document.getElementById('email').value;
        const role = document.getElementById('role').value;
        const position = document.getElementById('position').value;
        const password = document.getElementById('password').value;
    
        if (!firstName || !lastName || !email || !role || !password) {
            alert('Please fill in all required fields.');
            return;
        }
    
        fetch('http://localhost:5000/api/auth/adduser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email,
                role,
                position,
                password,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert(data.message || 'User added successfully!');
                document.getElementById('addUserForm').reset();
            })
            .catch(error => {
                console.error('Error adding user:', error);
                alert('Failed to add user. Please try again.');
            });
    }
    
    
