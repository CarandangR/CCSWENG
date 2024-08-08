
window.addEventListener("DOMContentLoaded", (event) => {
    function loadSubjects() {
        fetch('/api/getSubjects')
            .then(response => response.json())
            .then(data => {
                const dropdown = document.getElementById('subjectDropdown');
                dropdown.innerHTML = '';

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(subject => {
                        if (subject.subjectabb && subject.subjectsection) {
                            const option = document.createElement('option');
                            option.value = subject._id;
                            option.text = `${subject.subjectabb} - ${subject.subjectsection}`;
                            dropdown.appendChild(option);
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
        let allEntriesValid = true;
    
        const formattedData = inputLines.map(line => {
            const formData = line.split('\t');
            if (formData.length !== 7 || isNaN(parseInt(formData[3])) || isNaN(parseInt(formData[4])) || isNaN(parseInt(formData[5]))) {
                allEntriesValid = false;
                return null;
            }
            return {
                college: formData[0],
                subjectname: formData[1],
                subjectabb: formData[2],
                subjecttakers: parseInt(formData[3]),
                subjectyear: parseInt(formData[4]),
                subjectterm: parseInt(formData[5]),
                subjectsection: formData[6]
            };
        });
    
        if (!allEntriesValid) {
            alert('One or more entries are invalid. Please check your data format.');
            return;
        }
    
        formattedData.forEach(dataObj => {
            if (dataObj) {
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
            }
        });
    
        document.getElementById('subjectForm').reset();
        loadSubjects();
    });

    document.getElementById('deleteButton').addEventListener('click', function() {
        const selectedSubject = document.getElementById('subjectDropdown').value;
        if (selectedSubject) {
            fetch(`/deleteSubject/${selectedSubject}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    alert('Subject deleted successfully!');
                    loadSubjects();
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
      
            this.value = this.value.substring(0, start) +
            "\t" + this.value.substring(end);
      
            this.selectionStart =
            this.selectionEnd = start + 1;
        }
    });

    loadSubjects();
});