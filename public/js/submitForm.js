document.getElementById('subjectForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = {
        college: document.getElementById('college').value,
        subjectname: document.getElementById('subjectname').value,
        subjectabb: document.getElementById('subjectabb').value,
        subjecttakers: document.getElementById('subjecttakers').value,
        subjectyear: document.getElementById('subjectyear').value,
        subjectterm: document.getElementById('subjectterm').value,
        subjectsection: document.getElementById('subjectsection').value
    };

    fetch('/uploadCourse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Subject added successfully!');
        document.getElementById('subjectForm').reset(); // Clear the form fields
    })
    .catch(error => console.error('Error:', error));
});