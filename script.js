let tasks = JSON.parse(localStorage.getItem("tasks")) || [];      // Load tasks from localStorage or initialize empty array
let currentFilter = 'all';     // Default filter is set to 'all'

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("taskInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTask();      // Add task on Enter key press in input box
  });
  // Change filter (all, active, completed) when dropdown changes
  document.getElementById("filterSelect").addEventListener("change", function () {
    setFilter(this.value);
  });
  renderTasks();
});

// Save tasks array to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks based on current filter
function renderTasks() {
  document.getElementById("filterSelect").value = currentFilter;
  const taskList = document.getElementById("taskList");
  const now = new Date();
  taskList.innerHTML = "";

  // Apply filtering logic without modifying the original array
  const filteredTasks = tasks.filter(task => {
    const isFutureTask = new Date(task.due) >= now;
    if (currentFilter === 'active') return !task.completed && isFutureTask;
    if (currentFilter === 'completed') return task.completed;
    return isFutureTask || task.completed; // Show all future + completed tasks
  });

  // Loop through filtered tasks and add to DOM
  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    // Checkbox to toggle task completion
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      toggleComplete(index);
    });

    // Create task content container
    const taskContent = document.createElement("div");
    taskContent.style.display = "flex";
    taskContent.style.flexDirection = "column";
    taskContent.style.flex = "1";
    taskContent.style.marginRight = "10px";

     // Editable task text
    const span = document.createElement("span");
    span.textContent = task.text;
    span.contentEditable = true;
    span.className = "editable";
    span.addEventListener("blur", () => {
      updateTask(index, span.textContent);
    });

    // Display due date and time
    const taskDue = document.createElement("small");
    const dueDate = new Date(task.due);
    const dateStr = dueDate.toLocaleDateString();
    const timeStr = dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    taskDue.textContent = `${dateStr} at ${timeStr}`;
    taskDue.className = "due-date";

    taskContent.appendChild(span);
    taskContent.appendChild(taskDue);

     // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      deleteTask(index);
    });

     // Append elements to task item
    li.appendChild(checkbox);
    li.appendChild(taskContent);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });

  // Update task counts below list
  updateCounter();
}

// Add a new task with date and time
function addTask() {
  const input = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const timeInput = document.getElementById("timeInput");
  const text = input.value.trim();
  const dueDate = dateInput.value;
  const time = timeInput.value;

  // Ensure all fields are filled
  if (text && dueDate && time) {
    const datetime = `${dueDate}T${time}`;
    tasks.push({ text: text, completed: false, due: datetime });
    input.value = "";
    dateInput.value = "";
    timeInput.value = "";
    saveTasks();
    renderTasks();
  } else {
    alert("Please enter task, date, and time.");
  }
}

// Update task text when edited
function updateTask(index, newText) {
  tasks[index].text = newText.trim();
  saveTasks();
  renderTasks();
}

// Delete task by index
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Toggle completion status of a task
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Set the current filter and re-render tasks
function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

// Remove all completed tasks from the list
function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

// Update the task counter display (total, active, completed)
function updateCounter() {
  const all = tasks.length;
  const active = tasks.filter(task => !task.completed).length;
  const completed = all - active;
  document.getElementById("taskCounter").textContent =
    `${all} total | ${active} active | ${completed} completed`;
}
