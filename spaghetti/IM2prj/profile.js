document.addEventListener('DOMContentLoaded', () => {
  fetch('profile.php')
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              const employee = data.employee;
              document.getElementById('employeeName').textContent = `${capitalize(employee.first_name)} ${capitalize(employee.last_name)}`;
              document.getElementById('employeeRole').textContent = employee.department;
              document.getElementById('employeeContactNumber').textContent = employee.contact_number;
              document.getElementById('employeeEmail').textContent = employee.email;
          } else {
              console.error('Failed to fetch employee data');
          }
      })
      .catch(error => console.error('Error:', error));
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const profilePictureUpload = document.getElementById('profile-picture-upload');
const profilePicture = document.getElementById('profile-picture');
const uploadLabel = document.getElementById('upload-label');
const editPictureButton = document.getElementById('edit-picture');
const savePictureButton = document.getElementById('save-picture');

profilePictureUpload.addEventListener('change', (e) => {
  const file = profilePictureUpload.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
      profilePicture.src = event.target.result;
  };
  reader.readAsDataURL(file);
  uploadLabel.style.display = 'none';
  editPictureButton.style.display = 'inline-block';
  savePictureButton.style.display = 'inline-block';
});

editPictureButton.addEventListener('click', () => {
  profilePictureUpload.click();
});

savePictureButton.addEventListener('click', () => {
  // Logic to save the new profile picture
  uploadLabel.style.display = 'inline-block';
  editPictureButton.style.display = 'none';
  savePictureButton.style.display = 'none';
});
