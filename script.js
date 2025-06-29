
   document.getElementById('jsonInput').addEventListener('submit', function(event) {
    event.preventDefault(); // stop the normal form submission

    const formData = new FormData(event.target);
    const payload = {
    className: formData.get("ClassName"),
    Name: formData.get("AssignmentName"),   
    DueDate: formData.get("DueDate"),
    TaskDetails: formData.get("TaskDetails")
  };
    fetch("http://localhost:8080/api/add-assignment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
             "Accept": "application/json" 
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data),
      document.getElementById("result").textContent =
            `Assignment added: ${data.className} - ${data.name} (Due: ${data.dueDate})`;
        // Now fetch all assignments and update display
      // fetchAssignments();
        
        
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("result").textContent = "Failed to submit.";
    });
});


// Fetches values
function fetchAssignments() {
  fetch("http://localhost:8080/api/assignments")
    .then(response => response.json())
    .then(data => {
      const outputDiv = document.getElementById('jsonOutput');
      outputDiv.innerHTML = '';  // Clear previous

      data.forEach(a => {
        const p = document.createElement('p');
        p.textContent = `${a.className}: ${a.name} (Due: ${a.dueDate})`;
        outputDiv.appendChild(p);
      });
    })
    .catch(err => {
      document.getElementById('jsonOutput').textContent = 'Error fetching assignments';
      console.error(err);
    });
}


document.getElementById('generateSprint').addEventListener('click', function(event) {
  fetchAssignments();

});
