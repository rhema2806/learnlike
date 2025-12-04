let taskList = document.getElementById("taskList");
let xpCount = document.getElementById("xpCount");

let tasks = JSON.parse(localStorage.getItem("todoCRUDPro")) || [];
let xp = parseInt(localStorage.getItem("totalXP")) || 0;
let filter = 'all';

// store completed dates for streaks
let completedDates = JSON.parse(localStorage.getItem("completedDates")) || [];

xpCount.innerText = xp;

function displayTasks() {
    let filteredTasks = tasks.filter(task => {
        if(filter === 'all') return true;
        if(filter === 'active') return !task.completed;
        if(filter === 'completed') return task.completed;
    });

    let searchText = document.getElementById("searchInput").value.toLowerCase();
    filteredTasks = filteredTasks.filter(task => task.name.toLowerCase().includes(searchText));

    taskList.innerHTML = "";

    filteredTasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <span class="task-name">${task.name}</span>
            <div class="action-btns">
                <button class="complete-btn" onclick="toggleComplete(${index})">✔</button>
                <button class="edit-btn" onclick="editTask(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${index})">X</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function addTask() {
    let taskInput = document.getElementById("taskInput");
    if(taskInput.value.trim() === "") return alert("Enter a task!");
    tasks.push({name: taskInput.value, completed:false});
    saveTasks();
    displayTasks();
    taskInput.value = "";
}

function editTask(index) {
    let newName = prompt("Edit task:", tasks[index].name);
    if(newName !== null && newName.trim() !== ""){
        tasks[index].name = newName;
        saveTasks();
        displayTasks();
    }
}

function toggleComplete(index){
    if(!tasks[index].completed){
        xp += 10;

        // add today to streak
        let today = new Date().toISOString().split("T")[0];
        if(!completedDates.includes(today)) completedDates.push(today);
        localStorage.setItem("completedDates", JSON.stringify(completedDates));
        displayCalendar();
    } else {
        xp -= 10;
        if(xp < 0) xp = 0;
    }
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("totalXP", xp);
    xpCount.innerText = xp;
    saveTasks();
    displayTasks();
}

function deleteTask(index){
    if(tasks[index].completed){
        xp -= 10;
        if(xp < 0) xp = 0;
        localStorage.setItem("totalXP", xp);
        xpCount.innerText = xp;
    }
    tasks.splice(index,1);
    saveTasks();
    displayTasks();
}

function filterTasks(type){
    filter = type;
    displayTasks();
}

function searchTasks(){
    displayTasks();
}

function toggleTheme(){
    document.body.classList.toggle('light');
    displayCalendar();
}

function saveTasks(){
    localStorage.setItem("todoCRUDPro", JSON.stringify(tasks));
}

displayTasks();

// ---------------- Calendar ----------------
function displayCalendar(){
    let calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();

    let firstDay = new Date(year, month, 1).getDay();
    let lastDate = new Date(year, month + 1, 0).getDate();

    for(let i=0;i<firstDay;i++){
        let empty = document.createElement("div");
        calendar.appendChild(empty);
    }

    for(let date=1; date<=lastDate; date++){
        let dayDiv = document.createElement("div");
        let dateString = new Date(year, month, date).toISOString().split("T")[0];
        dayDiv.innerText = date;

        if(completedDates.includes(dateString)){
            dayDiv.classList.add("streak");
        }

        calendar.appendChild(dayDiv);
    }
}

displayCalendar();
