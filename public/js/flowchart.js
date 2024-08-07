window.addEventListener("DOMContentLoaded", (event) => {

    function loadCollegeCourses() {
        fetch('/api/flowchartdropdown')
            .then(response => response.json())
            .then(data => {
                const dropdown = document.getElementById('course-id');
                dropdown.innerHTML = ''; // Clear existing options
                
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(course => {
                        const option = document.createElement('option');
                        option.value = course.collegecourse;
                        option.text = course.collegecourse;
                        dropdown.appendChild(option);
                    });
                } else {
                    console.error('No courses available');
                }
            })
            .catch(error => console.error('Error loading subjects:', error));
    }
    loadCollegeCourses();

});