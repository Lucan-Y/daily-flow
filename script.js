const STORAGE_KEY = "daily-flow.tasks.v1";

const WINDOWS = [
  { key: "7d", label: "7D", caption: "within a week", to: 7 },
  { key: "15d", label: "15D", caption: "within half a month", to: 15 },
  { key: "30d", label: "30D", caption: "within a month", to: 30 },
  { key: "90d", label: "90D", caption: "within a quarter", to: 90 },
];

const state = {
  tasks: [],
};

const $ = (selector) => document.querySelector(selector);

function todayKey() {
  return toDateKey(new Date());
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  return new Date(`${dateKey}T00:00:00`);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function daysBetween(fromKey, toKey) {
  const from = parseDateKey(fromKey);
  const to = parseDateKey(toKey);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

function displayToday() {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date());
}

function createTask({ title, dueDate, notes = "" }) {
  return {
    id: globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
    title: title.trim(),
    dueDate,
    notes: notes.trim(),
    done: false,
    completedAt: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state.tasks = raw ? JSON.parse(raw) : [];
  } catch {
    state.tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function getWindowKey(task) {
  const diff = daysBetween(todayKey(), task.dueDate);
  if (diff <= 7) return "7d";
  if (diff <= 15) return "15d";
  if (diff <= 30) return "30d";
  if (diff <= 90) return "90d";
  return null;
}

function completedToday(task) {
  return task.done && task.completedAt.startsWith(todayKey());
}

function visibleInBoard(task) {
  return (!task.done || completedToday(task)) && daysBetween(todayKey(), task.dueDate) <= 90;
}

function sortByDueDate(tasks) {
  return [...tasks].sort((a, b) => {
    const dateCompare = a.dueDate.localeCompare(b.dueDate);
    return dateCompare || a.createdAt.localeCompare(b.createdAt);
  });
}

function render() {
  $("#todayLabel").textContent = displayToday();

  const board = $("#board");
  board.innerHTML = "";

  const grouped = Object.fromEntries(WINDOWS.map((windowItem) => [windowItem.key, []]));
  state.tasks.forEach((task) => {
    if (!visibleInBoard(task)) return;
    const key = getWindowKey(task);
    if (key) grouped[key].push(task);
  });

  WINDOWS.forEach((windowItem) => {
    const tasks = sortByDueDate(grouped[windowItem.key]);
    const section = document.createElement("section");
    section.className = `time-window ${windowItem.key}`;
    section.innerHTML = `
      <div class="window-head">
        <div>
          <strong>${windowItem.label}</strong>
          <span>${windowItem.caption}</span>
        </div>
        <em>${tasks.length}</em>
      </div>
      <div class="window-list"></div>
    `;

    const list = section.querySelector(".window-list");
    if (tasks.length === 0) {
      list.innerHTML = `<p class="empty">Empty</p>`;
    } else {
      tasks.forEach((task) => list.appendChild(renderTaskLine(task)));
    }

    board.appendChild(section);
  });
}

function renderTaskLine(task, options = {}) {
  const line = document.createElement("div");
  const overdue = daysBetween(todayKey(), task.dueDate) < 0 && !task.done;
  line.className = `task-line ${task.done ? "done" : ""} ${overdue ? "overdue" : ""}`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => toggleTask(task.id, checkbox.checked));

  const dot = document.createElement("span");
  dot.className = "alert-dot";
  if (overdue) dot.setAttribute("aria-label", "Overdue");

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;

  const noteButton = document.createElement("button");
  if (task.notes) {
    noteButton.type = "button";
    noteButton.className = "note-button";
    noteButton.textContent = "i";
    noteButton.setAttribute("aria-label", "Open note");
    noteButton.addEventListener("click", () => openNote(task));
  } else {
    noteButton.className = "no-note";
    noteButton.setAttribute("aria-hidden", "true");
  }

  line.append(checkbox, dot, title, noteButton);

  if (!options.readOnly) {
    line.appendChild(renderTaskActions(task));
  }

  return line;
}

function renderTaskActions(task) {
  const details = document.createElement("details");
  details.className = "task-actions";

  const summary = document.createElement("summary");
  summary.textContent = "…";
  summary.setAttribute("aria-label", "Task actions");

  const menu = document.createElement("div");
  menu.className = "task-menu";
  menu.innerHTML = `
    <label>
      Due date
      <input type="date" value="${task.dueDate}" />
    </label>
    <div class="move-grid"></div>
    <button type="button" class="danger-action">Delete</button>
  `;

  menu.querySelector("input").addEventListener("change", (event) => {
    updateTask(task.id, { dueDate: event.target.value });
  });

  const moveGrid = menu.querySelector(".move-grid");
  WINDOWS.forEach((windowItem) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = windowItem.label;
    button.addEventListener("click", () => {
      updateTask(task.id, { dueDate: toDateKey(addDays(new Date(), windowItem.to)) });
    });
    moveGrid.appendChild(button);
  });

  menu.querySelector(".danger-action").addEventListener("click", () => {
    deleteTask(task.id);
  });

  details.append(summary, menu);
  return details;
}

function toggleTask(id, done) {
  updateTask(id, {
    done,
    completedAt: done ? new Date().toISOString() : "",
  });
}

function updateTask(id, patch) {
  state.tasks = state.tasks.map((task) =>
    task.id === id ? { ...task, ...patch, updatedAt: new Date().toISOString() } : task,
  );
  saveTasks();
  render();
}

function deleteTask(id) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;
  if (!confirm(`Delete "${task.title}"?`)) return;
  state.tasks = state.tasks.filter((item) => item.id !== id);
  saveTasks();
  render();
}

function openAddDialog() {
  $("#taskForm").reset();
  $("#taskDueDate").value = todayKey();
  $("#noteField").classList.add("hidden");
  $("#noteToggle").textContent = "Add a note";
  $("#taskDialog").showModal();
}

function openCompletedDialog() {
  const cutoff = toDateKey(addDays(new Date(), -15));
  const completed = state.tasks
    .filter((task) => task.done && task.completedAt.slice(0, 10) >= cutoff)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  const list = $("#completedList");
  list.innerHTML = "";

  if (completed.length === 0) {
    list.innerHTML = `<p class="empty">No completed tasks yet.</p>`;
  } else {
    completed.forEach((task) => list.appendChild(renderTaskLine(task, { readOnly: true })));
  }

  $("#completedDialog").showModal();
}

function openNote(task) {
  $("#noteTitle").textContent = task.title;
  $("#noteText").textContent = task.notes;
  $("#noteDialog").showModal();
}

function closeDialog(button) {
  const dialog = button.closest("dialog");
  if (dialog) dialog.close();
}

function bindEvents() {
  $("#addButton").addEventListener("click", openAddDialog);
  $("#completedButton").addEventListener("click", openCompletedDialog);

  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => closeDialog(button));
  });

  $("#noteToggle").addEventListener("click", () => {
    const field = $("#noteField");
    const hidden = field.classList.toggle("hidden");
    $("#noteToggle").textContent = hidden ? "Add a note" : "Hide note";
  });

  $("#taskForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const task = createTask({
      title: String(formData.get("title") || ""),
      dueDate: String(formData.get("dueDate") || todayKey()),
      notes: String(formData.get("notes") || ""),
    });

    state.tasks.push(task);
    saveTasks();
    $("#taskDialog").close();
    render();
  });
}

loadTasks();
bindEvents();
render();
