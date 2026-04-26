const storageKey = "mini-crm-data";

const defaultData = {
  users: [],
  activeUser: null,
  records: []
};

let data = loadData();
let authMode = "login";
let currentFilter = "all";

const authView = document.querySelector("#authView");
const dashboardView = document.querySelector("#dashboardView");
const authForm = document.querySelector("#authForm");
const authTitle = document.querySelector("#authTitle");
const authSubmit = document.querySelector("#authSubmit");
const toggleAuth = document.querySelector("#toggleAuth");
const authMessage = document.querySelector("#authMessage");
const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const activeUser = document.querySelector("#activeUser");
const logoutButton = document.querySelector("#logoutButton");
const taskForm = document.querySelector("#taskForm");
const customerInput = document.querySelector("#customerInput");
const taskInput = document.querySelector("#taskInput");
const priorityInput = document.querySelector("#priorityInput");
const recordList = document.querySelector("#recordList");
const totalCount = document.querySelector("#totalCount");
const openCount = document.querySelector("#openCount");
const doneCount = document.querySelector("#doneCount");
const filterButtons = document.querySelectorAll(".filter-button");

authForm.addEventListener("submit", handleAuth);
toggleAuth.addEventListener("click", switchAuthMode);
logoutButton.addEventListener("click", logout);
taskForm.addEventListener("submit", addRecord);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderDashboard();
  });
});

render();

function loadData() {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    return { ...defaultData };
  }

  try {
    return { ...defaultData, ...JSON.parse(saved) };
  } catch {
    return { ...defaultData };
  }
}

function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function handleAuth(event) {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (username.length < 3 || password.length < 4) {
    showAuthMessage("Kullanıcı adı en az 3, şifre en az 4 karakter olmalı.");
    return;
  }

  if (authMode === "register") {
    register(username, password);
    return;
  }

  login(username, password);
}

function register(username, password) {
  const exists = data.users.some((user) => user.username.toLowerCase() === username.toLowerCase());

  if (exists) {
    showAuthMessage("Bu kullanıcı adı zaten kayıtlı.");
    return;
  }

  data.users.push({ username, password });
  data.activeUser = username;
  saveData();
  resetAuthForm();
  render();
}

function login(username, password) {
  const user = data.users.find((item) => item.username === username && item.password === password);

  if (!user) {
    showAuthMessage("Kullanıcı adı veya şifre hatalı.");
    return;
  }

  data.activeUser = user.username;
  saveData();
  resetAuthForm();
  render();
}

function switchAuthMode() {
  authMode = authMode === "login" ? "register" : "login";
  authTitle.textContent = authMode === "login" ? "Giriş yap" : "Kayıt ol";
  authSubmit.textContent = authMode === "login" ? "Giriş yap" : "Kayıt ol";
  toggleAuth.textContent = authMode === "login" ? "Kayıt ol" : "Girişe dön";
  showAuthMessage("");
}

function showAuthMessage(message) {
  authMessage.textContent = message;
}

function resetAuthForm() {
  authForm.reset();
  showAuthMessage("");
}

function logout() {
  data.activeUser = null;
  saveData();
  render();
}

function addRecord(event) {
  event.preventDefault();

  const customer = customerInput.value.trim();
  const task = taskInput.value.trim();

  if (!customer || !task) {
    return;
  }

  data.records.unshift({
    id: crypto.randomUUID(),
    owner: data.activeUser,
    customer,
    task,
    priority: priorityInput.value,
    status: "open",
    createdAt: new Date().toLocaleDateString("tr-TR")
  });

  saveData();
  taskForm.reset();
  renderDashboard();
}

function toggleRecord(id) {
  data.records = data.records.map((record) => {
    if (record.id !== id) {
      return record;
    }

    return {
      ...record,
      status: record.status === "open" ? "done" : "open"
    };
  });

  saveData();
  renderDashboard();
}

function deleteRecord(id) {
  data.records = data.records.filter((record) => record.id !== id);
  saveData();
  renderDashboard();
}

function render() {
  const loggedIn = Boolean(data.activeUser);

  authView.classList.toggle("hidden", loggedIn);
  dashboardView.classList.toggle("hidden", !loggedIn);

  if (loggedIn) {
    renderDashboard();
  }
}

function renderDashboard() {
  activeUser.textContent = data.activeUser;

  const userRecords = data.records.filter((record) => record.owner === data.activeUser);
  const visibleRecords = userRecords.filter((record) => {
    if (currentFilter === "all") {
      return true;
    }

    return record.status === currentFilter;
  });

  totalCount.textContent = userRecords.length;
  openCount.textContent = userRecords.filter((record) => record.status === "open").length;
  doneCount.textContent = userRecords.filter((record) => record.status === "done").length;

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === currentFilter);
  });

  if (visibleRecords.length === 0) {
    recordList.innerHTML = `<div class="empty-state">Henüz gösterilecek kayıt yok.</div>`;
    return;
  }

  recordList.innerHTML = visibleRecords.map(createRecordHtml).join("");

  recordList.querySelectorAll("[data-action='toggle']").forEach((button) => {
    button.addEventListener("click", () => toggleRecord(button.dataset.id));
  });

  recordList.querySelectorAll("[data-action='delete']").forEach((button) => {
    button.addEventListener("click", () => deleteRecord(button.dataset.id));
  });
}

function createRecordHtml(record) {
  const statusText = record.status === "open" ? "Bekleyen" : "Tamamlandı";
  const toggleText = record.status === "open" ? "Bitir" : "Geri al";

  return `
    <article class="record-card ${record.status === "done" ? "done" : ""}">
      <div>
        <h3>${escapeHtml(record.customer)}</h3>
        <p>${escapeHtml(record.task)}</p>
        <div class="record-meta">
          <span class="pill">${escapeHtml(record.priority)}</span>
          <span class="pill">${statusText}</span>
          <span class="pill">${record.createdAt}</span>
        </div>
      </div>
      <div class="record-actions">
        <button class="record-action" type="button" data-action="toggle" data-id="${record.id}">${toggleText}</button>
        <button class="record-action" type="button" data-action="delete" data-id="${record.id}">Sil</button>
      </div>
    </article>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
