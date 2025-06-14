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
  document.getElementById("filterSelect").value=currentFilter;
  const taskList = document.getElementById("taskList");
  const filter=document.getElementById("filterSelect").value;
  const today=new Date().toISOString().split("T")[0];

  tasks=tasks.filter(task=>task.due>=today);
  saveTasks();

  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if(task.completed) li.classList.add("completed");
    li.className = task.completed ? "completed" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      toggleComplete(index);
    });

    const taskContent=document.createElement("div");
    taskContent.style.display="flex";
    taskContent.style.flexDirection="column";
    taskContent.style.flex="1";
    taskContent.style.marginRight="10px";

    const span = document.createElement("span");
    span.textContent = task.text;
    span.contentEditable = true;
    span.className = "editable";
    span.addEventListener("blur", () => {
      updateTask(index, span.textContent);
    });

    const taskDue=document.createElement("small");
    taskDue.textContent=`${task.due}`;
    taskDue.className="due-date";

    taskContent.appendChild(taskDue);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      deleteTask(index);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(taskContent);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });

  updateCounter();
}

function addTask() {
  const input = document.getElementById("taskInput");
  const dateInput=document.getElementById("dateInput");
  const text = input.value.trim();
  const dueDate=dateInput.value;

  if (text && dueDate) {
    tasks.push({ text: text, completed: false, due: dueDate });
    input.value = "";
    dateInput.value="";
    saveTasks();
    renderTasks();
  }else{
    alert("Please enter both task and date.")
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