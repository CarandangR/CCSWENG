
window.addEventListener("DOMContentLoaded", (event) => {
    function loadSubjects() {
        fetch('/api/subjects')
            .then(response => response.json())
            .then(data => {
                const dropdown = document.getElementById('subjectDropdown');
                dropdown.innerHTML = ''; // Clear existing options
                
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(subject => {
                        // Ensure subjectabb and subjectsection are defined
                        if (subject.subjectabb && subject.subjectsection) {
                            subject.subjectsection.forEach(section => {
                                const option = document.createElement('option');
                                option.value = subject.ids; // Use unique identifier
                                option.text = `${subject.subjectabb} - ${section}`;
                                dropdown.appendChild(option);
                            });
                        }
                    });
                } else {
                    console.error('No subjects available or incorrect data format.');
                }
            })
            .catch(error => console.error('Error loading subjects:', error));
    }
    document.getElementById('subjectForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const inputLines = document.getElementById('subjectInput').value.trim().split('\n');
        inputLines.forEach(line => {
            const formData = line.split('\t'); // Split each line into parts
            const dataObj = {
                college: formData[0],
                subjectname: formData[1],
                subjectabb: formData[2],
                subjecttakers: parseInt(formData[3]),
                subjectyear: parseInt(formData[4]),
                subjectterm: parseInt(formData[5]),
                subjectsection: formData[6]
            };
            fetch('/uploadCourse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataObj)
            })
            .then(response => response.json())
            .then(data => {
                alert('Subject added successfully!');
            })
            .catch(error => console.error('Error:', error));
        });

        document.getElementById('subjectForm').reset(); // Clear the form fields after processing all lines
        loadSubjects();
    });

    document.getElementById('deleteButton').addEventListener('click', function() {
        const selectedSubject = document.getElementById('subjectDropdown').value;
        if (selectedSubject) {
            fetch(`/deleteSubject/${selectedSubject}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    alert('Subject deleted successfully!');
                    loadSubjects(); // Reload the dropdown
                })
                .catch(error => console.error('Error deleting subject:', error));
        } else {
            alert('Please select a subject to delete.');
        }
    });
    
    loadSubjects();

    document.getElementById('subjectInput').addEventListener('keydown', function(e) {
        if (e.key == 'Tab') {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;
      
          // set textarea value to: text before caret + tab + text after caret
            this.value = this.value.substring(0, start) +
            "\t" + this.value.substring(end);
      
          // put caret at right position again
            this.selectionStart =
            this.selectionEnd = start + 1;
        }
    });
});