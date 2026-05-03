const ui = {
  sideBarElements: {
    sideBarPanel: document.getElementById("sideBarParent"),
    sideBar: document.getElementById("sideBar"),
    sideBarOverlay: document.getElementById("sideBarOverlay"),
    showSideBarBtns: document.querySelectorAll(".showSideBar"),
    hideSideBarBtn: document.getElementById("hideSideBar"),
  },

  lists: {
    items: document.querySelectorAll(".list"),
    sections: document.querySelectorAll(".todoSection"),
  },

  today: {
    todayTasks: document.getElementById("todayTasks"),
    section: document.getElementById("todaySection"),
    showBtn: document.getElementById("addNewTaskBtn"),
    card: document.getElementById("addNewTaskCard"),
    input: document.getElementById("taskInput"),
    textarea: document.getElementById("description"),
    submitBtn: document.getElementById("addTaskBtn"),
    numberOfTodayTasks: document.querySelectorAll(".numberOfTodayTasks"),
    emptyMessages: document.querySelectorAll(".todayEmptyMessage"),
  },

  completed: {
    container: document.getElementById("completedTasks"),
    emptyMessage: document.querySelector("[data-sentence]"),
    numberOfCompletedTasks: document.querySelectorAll(
      ".numberOfCompletedTasks",
    ),
  },

  editForm: {
    modal: document.getElementById("editTaskFormParent"),
    form: document.getElementById("editTaskForm"),
    input: document.getElementById("taskInput_E"),
    textarea: document.getElementById("taskTextarea_E"),
    saveBtn: document.querySelector(".saveBtn"),
    cancelBtn: document.querySelector(".cancelBtn"),
  },

  upcoming: {
    section: document.getElementById("upcommingSection"),
    showBtn: document.getElementById("addNewTaskBtn_U"),
    card: document.getElementById("addNewTaskCard_U"),
    input: document.getElementById("taskInput_U"),
    textarea: document.getElementById("description_U"),
    dateInput: document.getElementById("dateInput_U"),
    submitBtn: document.getElementById("addTaskBtn_U"),
    upcomingTodayTasks: document.getElementById("upcomingTodayTasks"),
    upcomingTasks: document.getElementById("upcomingTasks"),
    upcomingEmptyMessage: document.getElementById("upcomingEmptyMessage"),
    numberOfUpcomingTasks: document.querySelectorAll(".numberOfUpcomingTasks"),
  },

  taskLists: {
    containers: document.querySelectorAll(".todosContainer"),
  },
};

document.addEventListener("DOMContentLoaded", () => {
  refreshTodos();
  renderUpcomingTodos();
  todayEmptyMessage(ui.today.emptyMessages, [
    ui.upcoming.upcomingTodayTasks,
    ui.today.todayTasks,
  ]);
  completedEmptyMessage(ui.completed.emptyMessage, ui.completed.container);
  upcomingEmptyMessage(
    ui.upcoming.upcomingEmptyMessage,
    ui.upcoming.upcomingTasks,
  );
});

document.addEventListener("click", handleTaskClick);

const defaultClasses = [
  "text-black/70",
  "dark:text-white/70",
  "hover:text-black",
  "hover:dark:text-white",
  "hover:bg-gray-200",
  "hover:dark:bg-[#0B192C]",
];

const activeClasses = [
  "text-black",
  "dark:text-white",
  "bg-gray-200",
  "dark:bg-[#0B192C]",
];

function bindListItemsClick(items) {
  items.forEach((item) => {
    item.addEventListener("click", () => {
      ui.lists.items.forEach((i) => {
        i.classList.remove(...activeClasses);
        i.classList.add(...defaultClasses);
      });

      item.classList.remove(...defaultClasses);

      item.classList.add(...activeClasses);

      ui.lists.sections.forEach((s) => {
        s.classList.add("hidden");
        if (s.dataset.section === item.dataset.list) {
          s.classList.remove("hidden");
        }
      });
    });
  });
}

bindListItemsClick(ui.lists.items);

function bindSidebarOpen(btns, delay = 100) {
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      ui.sideBarElements.sideBarPanel.classList.remove("hidden");

      setTimeout(() => {
        ui.sideBarElements.sideBar.classList.remove("-translate-x-full");
      }, delay);
    });
  });
}

bindSidebarOpen(ui.sideBarElements.showSideBarBtns, 100);

function hideSideBar() {
  setTimeout(() => {
    ui.sideBarElements.sideBarPanel.classList.add("hidden");
  }, 300);

  ui.sideBarElements.sideBar.classList.add("-translate-x-full");
}

function bindHide(elements) {
  elements.forEach((el) => el.addEventListener("click", hideSideBar));
}

bindHide([
  ui.sideBarElements.hideSideBarBtn,
  ui.sideBarElements.sideBarOverlay,
]);

function scrollHeight(element, maxHeight) {
  element.style.height = "auto";
  if (element.scrollHeight > maxHeight) {
    element.style.height = maxHeight + "px";
    element.style.overflowY = "scroll";
  } else {
    element.style.height = element.scrollHeight + "px";
    element.style.overflowY = "hidden";
  }
}

function resetScrollHeight(element) {
  element.input.style.height = "";
  element.textarea.style.height = "";
}

ui.editForm.input.addEventListener("input", () => {
  scrollHeight(ui.editForm.input, 100);
});

ui.editForm.textarea.addEventListener("input", () => {
  scrollHeight(ui.editForm.textarea, 200);
});

function bindAutoResize(elements) {
  elements.forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => scrollHeight(el));
  });
}

bindAutoResize([
  ui.today.input,
  ui.today.textarea,
  ui.upcoming.input,
  ui.upcoming.textarea,
]);

function showAddNewTaskCard() {
  ui.today.showBtn.classList.add("hidden");
  ui.today.card.classList.remove("hidden");
}

ui.today.showBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  showAddNewTaskCard();
});

function stopClickPropagation(elements) {
  elements.forEach((el) => {
    if (!el) return;
    el.addEventListener("click", (e) => e.stopPropagation());
  });
}

stopClickPropagation([ui.today.card, ui.upcoming.card]);

function hideAddNewTaskCard(card) {
  card.showBtn.classList.remove("hidden");
  card.card.classList.add("hidden");

  card.input.value = "";
  card.textarea.value = "";

  card.input.style.height = "";
  card.textarea.style.height = "";
}

function bindHideAddTask(elements) {
  elements.forEach((el) => {
    if (!el) return;
    el.section.addEventListener("click", () => hideAddNewTaskCard(el));
  });
}

bindHideAddTask([ui.today, ui.upcoming]);

function hideEditTaskForm() {
  ui.editForm.modal.classList.add("hidden");
  resetScrollHeight(ui.editForm);
}

ui.editForm.form.addEventListener("click", (e) => {
  e.stopPropagation();
});

function bindHideEditForm(elements) {
  elements.forEach((el) => {
    if (!el) return;
    el.addEventListener("click", hideEditTaskForm);
  });
}
bindHideEditForm([ui.editForm.modal, ui.editForm.cancelBtn]);

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentTodo = null;

function createTaskContent(title, description, dateValue) {
  const content = document.createElement("div");
  content.className = "space-y-2";

  const taskTitle = document.createElement("h1");
  taskTitle.className = "font-medium dark:text-white break-words";
  taskTitle.textContent = title;
  content.appendChild(taskTitle);

  if (description) {
    const desc = document.createElement("p");
    desc.className = "text-sm text-gray-600 dark:text-gray-400 break-words";
    desc.textContent = description;
    content.appendChild(desc);
  }

  if (dateValue) {
    const date = document.createElement("span");
    date.className = "text-black/50 dark:text-white/50 text-sm mt-2";
    date.textContent = dateValue;
    content.appendChild(date);
  }

  return content;
}

function createElements(
  todoId,
  todoTitle,
  todoDescription,
  element,
  dateValue,
) {
  const taskItem = document.createElement("div");
  taskItem.dataset.id = todoId;
  taskItem.className =
    "task-item relative group w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#1E3E62] rounded-2xl p-4 shrink-0 overflow-hidden";

  const taskContent = createTaskContent(todoTitle, todoDescription, dateValue);
  const controls = createTaskControls();

  taskItem.appendChild(taskContent);

  if (element) {
    element.appendChild(taskItem);
  }

  return {
    ...controls,
    taskContent,
    taskItem,
  };
}

function createTaskControls() {
  const taskControls = document.createElement("div");
  taskControls.className =
    "lg:absolute top-0 right-0 flex gap-2 lg:p-2 mt-4 lg:m-0 lg:opacity-0 lg:group-hover:opacity-100 duration-500";

  const completeTaskBtn = createButton({
    className:
      "completeBtn text-sm text-white px-2 py-1 bg-green-600 rounded-md cursor-pointer",
    text: "Complete",
    iconClass: "fa-solid fa-check ml-2",
  });

  const editTaskBtn = createButton({
    className:
      "editBtn text-sm text-white px-2 py-1 bg-[#FF6500] rounded-md cursor-pointer",
    text: "Edit",
    iconClass: "fa-solid fa-pen ml-2",
  });

  const deleteTaskBtn = createButton({
    className:
      "deleteBtn text-sm text-white px-2 py-1 bg-red-500 rounded-md cursor-pointer",
    text: "Delete",
    iconClass: "fa-solid fa-trash ml-2",
  });

  const undoTaskBtn = createButton({
    className:
      "undoBtn flex items-center gap-2 text-sm text-white px-2 py-1 bg-green-600 rounded-md cursor-pointer",
    text: "Undo",
    iconText: "undo",
  });

  return {
    taskControls,
    completeTaskBtn,
    editTaskBtn,
    deleteTaskBtn,
    undoTaskBtn,
  };
}

function createButton({ className, text, iconClass, iconText }) {
  const btn = document.createElement("button");
  btn.className = className;
  btn.textContent = text;

  if (iconClass || iconText) {
    const icon = document.createElement(iconText ? "span" : "i");
    if (iconClass) icon.className = iconClass;
    if (iconText) {
      icon.className = "material-symbols-outlined undoBtn";
      icon.textContent = iconText;
    }

    btn.appendChild(icon);
  }

  return btn;
}

function applyTaskUI(elements, todo) {
  if (!todo.completed) {
    elements.taskControls.append(
      elements.completeTaskBtn,
      elements.editTaskBtn,
      elements.deleteTaskBtn,
    );
  } else {
    elements.taskControls.appendChild(elements.undoTaskBtn);
  }
  elements.taskItem.appendChild(elements.taskControls);
}

function placeTaskInSection(taskElements, todo) {
  if (!todo.completed && !todo.upcoming) {
    ui.taskLists.containers.forEach((container) => {
      const taskCopy = taskElements.taskItem.cloneNode(true);
      container.appendChild(taskCopy);
    });
  }

  if (todo.completed) {
    ui.completed.container.classList.add("flex-1");
    ui.completed.container.appendChild(taskElements.taskItem);
  } else {
    ui.completed.container.classList.remove("flex-1");
  }
}

function renderTodos() {
  ui.taskLists.containers.forEach((container) => {
    container.innerHTML = "";
  });

  ui.completed.container.innerHTML = "";

  todos.forEach((todo) => {
    if (!todo.upcoming) {
      const elements = createElements(
        todo.id,
        todo.title,
        todo.description,
        null,
        todo.date,
      );
      applyTaskUI(elements, todo);
      placeTaskInSection(elements, todo);
    }
  });
}

function updateCount() {
  let todayCount = 0;
  let upcomingOnlyCount = 0;
  let completedCount = 0;
  todos.forEach((todo) => {
    if (todo.completed) {
      completedCount++;
    } else if (todo.upcoming) {
      upcomingOnlyCount++;
    } else {
      todayCount++;
    }
  });

  ui.today.numberOfTodayTasks.forEach((taskCountElement) => {
    taskCountElement.textContent = todayCount;
  });

  ui.upcoming.numberOfUpcomingTasks.forEach((taskCountElement) => {
    taskCountElement.textContent = upcomingOnlyCount + todayCount;
  });

  ui.completed.numberOfCompletedTasks.forEach((taskCountElement) => {
    taskCountElement.textContent = completedCount;
  });
}

function refreshTodos() {
  renderTodos();
  updateCount();
}

function taskId(target) {
  let taskItem = target.closest(".task-item");
  return taskItem ? Number(taskItem.dataset.id) : null;
}

function findTodo(taskID) {
  const todo = todos.find((t) => t.id === taskID);
  return todo;
}

function updateUI() {
  refreshTodos();
  renderUpcomingTodos();
  completedEmptyMessage(ui.completed.emptyMessage, ui.completed.container);
  todayEmptyMessage(ui.today.emptyMessages, [
    ui.upcoming.upcomingTodayTasks,
    ui.today.todayTasks,
  ]);
  upcomingEmptyMessage(
    ui.upcoming.upcomingEmptyMessage,
    ui.upcoming.upcomingTasks,
  );
}

function saveAndUpdate() {
  updateUI();
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getEventData(e) {
  const target = e.target;
  const id = taskId(target);
  if (id === null) return;
  const todo = findTodo(id);
  return {
    target,
    id,
    todo,
  };
}

function handleTaskClick(e) {
  const data = getEventData(e);
  if (!data) return;
  const { target, id, todo } = data;

  if (target.closest(".completeBtn")) {
    if (todo) todo.completed = true;
    if (todo.upcoming) todo.upcoming = null;
    saveAndUpdate();
  } else if (target.closest(".editBtn")) {
    ui.editForm.modal.classList.remove("hidden");
    if (todo) {
      ui.editForm.input.value = todo.title;
      ui.editForm.textarea.value = todo.description;
      currentTodo = todo;
    }
  } else if (target.closest(".deleteBtn")) {
    todos = todos.filter((t) => t.id !== id);
    saveAndUpdate();
  } else if (target.closest(".undoBtn")) {
    if (todo) todo.completed = false;
    if (todo.upcoming === null) todo.upcoming = true;
    saveAndUpdate();
  }
}

function getTodayDate() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function bindAddTask() {
  const { input, textarea } = ui.today;

  if (input.value.trim() === "") {
    alert("Add Task");
    return;
  }

  const isoDate = new Date().toISOString().slice(0, 10);

  todos.push({
    id: Date.now(),
    title: input.value,
    description: textarea.value,
    completed: false,
    upcoming: false,
    date: isoDate,
  });

  refreshTodos();
  hideAddNewTaskCard(ui.today);
  todayEmptyMessage(ui.today.emptyMessages, [
    ui.upcoming.upcomingTodayTasks,
    ui.today.todayTasks,
  ]);

  localStorage.setItem("todos", JSON.stringify(todos));
}

const submitTaskButtons = [ui.today.submitBtn];
submitTaskButtons.forEach((btn) => btn?.addEventListener("click", bindAddTask));

function saveEditedTask() {
  const { input, textarea } = ui.editForm;

  if (input.value.trim() === "") return;

  currentTodo.title = input.value;
  currentTodo.description = textarea.value;

  renderTodos();
  renderUpcomingTodos();
  hideEditTaskForm();

  localStorage.setItem("todos", JSON.stringify(todos));
}

const saveButtons = [ui.editForm.saveBtn];
saveButtons.forEach((btn) => btn?.addEventListener("click", saveEditedTask));

ui.upcoming.showBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  ui.upcoming.showBtn.classList.add("hidden");
  ui.upcoming.card.classList.remove("hidden");
});

function addUpcomingTask() {
  const { input, dateInput, textarea } = ui.upcoming;

  if (input.value.trim() === "") {
    alert("Add Task");
    return;
  }

  if (dateInput.value === "") {
    alert("Add date");
    return;
  }

  const isFuture = getTodayDate() !== dateInput.value;
  const isoDate = new Date().toISOString().slice(0, 10);

  todos.push({
    id: Date.now(),
    title: input.value,
    description: textarea.value,
    completed: false,
    upcoming: isFuture,
    date: isFuture ? dateInput.value : isoDate,
  });

  hideAddNewTaskCard(ui.upcoming);

  if (!isFuture) {
    refreshTodos();
    todayEmptyMessage(ui.today.emptyMessages, [
      ui.upcoming.upcomingTodayTasks,
      ui.today.todayTasks,
    ]);
  } else {
    renderUpcomingTodos();
    updateCount();
    upcomingEmptyMessage(
      ui.upcoming.upcomingEmptyMessage,
      ui.upcoming.upcomingTasks,
    );
  }

  localStorage.setItem("todos", JSON.stringify(todos));
}

const buttons = [ui.upcoming.submitBtn];
buttons.forEach((btn) => btn?.addEventListener("click", addUpcomingTask));

function renderUpcomingTodos() {
  ui.upcoming.upcomingTasks.innerHTML = "";

  todos.forEach((todo) => {
    if (todo.upcoming) {
      const elements = createElements(
        todo.id,
        todo.title,
        todo.description,
        ui.upcoming.upcomingTasks,
        todo.date,
      );
      applyTaskUI(elements, todo);
      placeTaskInSection(elements, todo);
    }
  });
}

function completedEmptyMessage(element, container) {
  let isCompleted = todos.some((t) => t.completed === true);

  if (!isCompleted) {
    element.classList.remove("hidden");
    container.classList.remove("flex-1");
  } else {
    element.classList.add("hidden");
    container.classList.add("flex-1");
  }
}

function todayEmptyMessage(elements, containers) {
  let isToday = todos.some(
    (t) => t.completed === false && t.upcoming === false,
  );

  if (!isToday) {
    elements.forEach((el) => {
      el.classList.remove("hidden");
    });
    containers.forEach((c) => {
      c.classList.remove("flex-1");
    });
  } else {
    elements.forEach((el) => {
      el.classList.add("hidden");
    });
    containers.forEach((c) => {
      c.classList.add("flex-1");
    });
  }
}

function upcomingEmptyMessage(element, container) {
  let isUpcoming = todos.some((t) => t.upcoming === true);

  if (!isUpcoming) {
    element.classList.remove("hidden");
    container.classList.remove("flex-1");
  } else {
    element.classList.add("hidden");
    container.classList.add("flex-1");
  }
}
