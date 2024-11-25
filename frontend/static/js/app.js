const API_URL = "http://127.0.0.1:5000/todos";

// Fetch tasks from the backend and display them
async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks

    tasks.forEach(task => {
        const row = document.createElement("tr");

        // Custom message for toggling task completion
        const customMessage = `You have marked "${task.task}" as ${task.completed ? "completed" : "incomplete"}`;

        row.innerHTML = `
            <td class="task-username">${task.username}</td>
            <td class="task-text">${task.task}</td>

            <td>
                <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleTask(${task.id}, ${!task.completed}, '${customMessage}')">
            </td>
            <td>
                <button onclick="deleteTask(${task.id}, '${task.task}')">Delete</button>
            </td>
        `;

        taskList.appendChild(row);
    });
}

// Add a new task
async function addTask() {
    const usernameInput = document.getElementById("username");
    const taskInput = document.getElementById("task");

    const username = usernameInput.value;
    const task = taskInput.value;

    if (!username || !task) {
        alert("Both fields are required!");
        return;
    }

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, task })
        });

        // Show success notification
        showNotification(`Seekiram velaiya mudida deiii😑!`);

        // Clear the input fields
        usernameInput.value = "";
        taskInput.value = "";

        // Refresh the task list
        fetchTasks();
    } catch (error) {
        console.error("Error adding task:", error);
        showNotification("Failed to add task. Please try again.", "error");
    }
}

// Toggle task completion with a custom message
async function toggleTask(id, completed, customMessage = "") {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ completed })
        });

        // Show the notification with the custom message
        showNotification(customMessage || `Task ${completed ? "completed" : "marked as incomplete"} successfully!`);

        // Refresh the task list to reflect the updated state
        fetchTasks();
    } catch (error) {
        console.error("Error toggling task:", error);
        showNotification("Failed to update task. Please try again.", "error"); // Error notification
    }
}

// Delete a task
async function deleteTask(id, taskName) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });

        // Notify the user that the task was deleted
        showNotification(`Avlo dhan nammala mudichu vittinga ponga😵!`);

        // Refresh the task list
        fetchTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
        showNotification("Failed to delete task. Please try again.", "error"); // Error notification
    }
}

// Show notification
function showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = type;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 3000); // Hide notification after 3 seconds
}

// Event listeners
document.getElementById("addTask").addEventListener("click", addTask);

// Fetch tasks when the page loads
fetchTasks();
