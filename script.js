let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = 'all';

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("taskInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTask();
  });
  renderTasks();
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      toggleComplete(index);
    });

    const span = document.createElement("span");
    span.textContent = task.text;
    span.contentEditable = true;
    span.className = "editable";
    span.addEventListener("blur", () => {
      updateTask(index, span.textContent);
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      deleteTask(index);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });

  updateCounter();
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (text !== "") {
    tasks.push({ text: text, completed: false });
    input.value = "";
    saveTasks();
    renderTasks();
  }
}

function updateTask(index, newText) {
  tasks[index].text = newText.trim();
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

function updateCounter() {
  const all = tasks.length;
  const active = tasks.filter(task => !task.completed).length;
  const completed = all - active;
  document.getElementById("taskCounter").textContent =
    `${all} total | ${active} active | ${completed} completed`;
}