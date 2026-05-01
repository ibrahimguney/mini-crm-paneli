const storageKey = "mini-crm-data-v2";
const demoOwner = "Demo hesap";
const defaultData = {
  users: [],
  activeUser: null,
  demoMode: false,
  records: [],
};
const demoRecords = [
  {
    customer: "Acme Ltd.",
    task: "Yeni teklif sunumu hazırlanacak",
    email: "satinalma@acme.test",
    phone: "+90 555 120 30 40",
    priority: "Yüksek",
    status: "open",
    dueDate: offsetDate(1),
  },
  {
    customer: "Beta A.Ş.",
    task: "Sözleşme revizyonu takip edilecek",
    email: "operasyon@beta.test",
    phone: "+90 532 444 18 22",
    priority: "Normal",
    status: "open",
    dueDate: offsetDate(3),
  },
  {
    customer: "Nova Studio",
    task: "Demo kurulumu tamamlandı bilgisi gönderildi",
    email: "hello@nova.test",
    phone: "+90 212 000 90 90",
    priority: "Düşük",
    status: "done",
    dueDate: offsetDate(-1),
  },
];

let data = loadData();
let authMode = "login";
let currentFilter = "all";
let searchTerm = "";
let sortMode = "newest";

const authView = document.querySelector("#authView");
const dashboardView = document.querySelector("#dashboardView");
const authForm = document.querySelector("#authForm");
const authTitle = document.querySelector("#authTitle");
const authSubmit = document.querySelector("#authSubmit");
const toggleAuth = document.querySelector("#toggleAuth");
const authMessage = document.querySelector("#authMessage");
const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const demoButton = document.querySelector("#demoButton");
const activeUser = document.querySelector("#activeUser");
const logoutButton = document.querySelector("#logoutButton");
const taskForm = document.querySelector("#taskForm");
const customerInput = document.querySelector("#customerInput");
const taskInput = document.querySelector("#taskInput");
const emailInput = document.querySelector("#emailInput");
const phoneInput = document.querySelector("#phoneInput");
const priorityInput = document.querySelector("#priorityInput");
const dueInput = document.querySelector("#dueInput");
const recordList = document.querySelector("#recordList");
const searchInput = document.querySelector("#searchInput");
const sortInput = document.querySelector("#sortInput");
const totalCount = document.querySelector("#totalCount");
const openCount = document.querySelector("#openCount");
const doneCount = document.querySelector("#doneCount");
const highCount = document.querySelector("#highCount");
const focusText = document.querySelector("#focusText");
const filterButtons = document.querySelectorAll("[data-filter]");

authForm.addEventListener("submit", handleAuth);
toggleAuth.addEventListener("click", switchAuthMode);
demoButton.addEventListener("click", startDemo);
logoutButton.addEventListener("click", logout);
taskForm.addEventListener("submit", addRecord);
searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLocaleLowerCase("tr-TR");
  renderDashboard();
});
sortInput.addEventListener("change", () => {
  sortMode = sortInput.value;
  renderDashboard();
});
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderDashboard();
  });
});

render();

function loadData() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return { ...defaultData };

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
  const exists = data.users.some((user) => user.username.toLocaleLowerCase("tr-TR") === username.toLocaleLowerCase("tr-TR"));
  if (exists) {
    showAuthMessage("Bu kullanıcı adı zaten kayıtlı.");
    return;
  }

  data.users.push({ username, password });
  data.activeUser = username;
  data.demoMode = false;
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
  data.demoMode = false;
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

function startDemo() {
  data.activeUser = demoOwner;
  data.demoMode = true;
  data.records = demoRecords.map((record, index) => ({
    id: `demo-${index + 1}`,
    owner: demoOwner,
    createdAt: offsetDate(-index * 2),
    ...record,
  }));
  currentFilter = "all";
  searchTerm = "";
  sortMode = "newest";
  searchInput.value = "";
  sortInput.value = "newest";
  saveData();
  resetAuthForm();
  render();
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
  data.demoMode = false;
  saveData();
  render();
}

function addRecord(event) {
  event.preventDefault();
  const customer = customerInput.value.trim();
  const task = taskInput.value.trim();
  if (!customer || !task) return;

  data.records.unshift({
    id: crypto.randomUUID(),
    owner: data.activeUser,
    customer,
    task,
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    priority: priorityInput.value,
    status: "open",
    dueDate: dueInput.value,
    createdAt: new Date().toISOString().slice(0, 10),
  });

  saveData();
  taskForm.reset();
  renderDashboard();
}

function toggleRecord(id) {
  data.records = data.records.map((record) => {
    if (record.id !== id) return record;
    return {
      ...record,
      status: record.status === "open" ? "done" : "open",
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
  if (loggedIn) renderDashboard();
}

function renderDashboard() {
  activeUser.textContent = data.demoMode ? "Demo çalışma alanı" : data.activeUser;
  const userRecords = data.records.filter((record) => record.owner === data.activeUser);
  const visibleRecords = getVisibleRecords(userRecords);

  totalCount.textContent = userRecords.length;
  openCount.textContent = userRecords.filter((record) => record.status === "open").length;
  doneCount.textContent = userRecords.filter((record) => record.status === "done").length;
  highCount.textContent = userRecords.filter((record) => record.priority === "Yüksek").length;
  focusText.textContent = getFocusText(userRecords);

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === currentFilter);
  });

  if (visibleRecords.length === 0) {
    recordList.innerHTML = `<div class="empty-state"><strong>${getEmptyMessage(userRecords.length)}</strong><span>Yeni kayıt ekleyerek takip listeni oluşturabilirsin.</span></div>`;
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

function getVisibleRecords(records) {
  return records
    .filter((record) => {
      if (currentFilter === "all") return true;
      if (currentFilter === "high") return record.priority === "Yüksek";
      return record.status === currentFilter;
    })
    .filter((record) => {
      if (!searchTerm) return true;
      return `${record.customer} ${record.task} ${record.email} ${record.phone}`.toLocaleLowerCase("tr-TR").includes(searchTerm);
    })
    .sort(sortRecords);
}

function sortRecords(a, b) {
  if (sortMode === "customer") return a.customer.localeCompare(b.customer, "tr-TR", { sensitivity: "base" });
  if (sortMode === "priority") return priorityRank(b.priority) - priorityRank(a.priority);
  if (sortMode === "due") return (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31");
  return (b.createdAt || "").localeCompare(a.createdAt || "");
}

function priorityRank(priority) {
  return { Düşük: 1, Normal: 2, Yüksek: 3 }[priority] || 0;
}

function getFocusText(records) {
  const openHigh = records.filter((record) => record.status === "open" && record.priority === "Yüksek").length;
  if (openHigh) return `${openHigh} yüksek öncelikli kayıt bekliyor`;
  const open = records.filter((record) => record.status === "open").length;
  if (open) return `${open} açık kayıt takipte`;
  if (records.length) return "Tüm kayıtlar tamamlanmış görünüyor";
  return "İlk müşteri kaydını ekle";
}

function getEmptyMessage(totalRecords) {
  if (totalRecords === 0) return "Henüz gösterilecek kayıt yok.";
  if (searchTerm) return "Aramana uyan kayıt bulunamadı.";
  return "Bu filtrede gösterilecek kayıt yok.";
}

function createRecordHtml(record) {
  const statusText = record.status === "open" ? "Bekleyen" : "Tamamlandı";
  const toggleText = record.status === "open" ? "Bitir" : "Geri al";
  const priorityClass = record.priority === "Yüksek" ? "high" : "";
  const statusClass = record.status === "done" ? "done" : "";

  return `
    <article class="record-card ${record.status === "done" ? "done" : ""}">
      <div>
        <h3>${escapeHtml(record.customer)}</h3>
        <p>${escapeHtml(record.task)}</p>
        <div class="record-contact">
          ${record.email ? `<span>${escapeHtml(record.email)}</span>` : ""}
          ${record.phone ? `<span>${escapeHtml(record.phone)}</span>` : ""}
        </div>
        <div class="record-meta">
          <span class="pill ${priorityClass}">${escapeHtml(record.priority)}</span>
          <span class="pill ${statusClass}">${statusText}</span>
          <span class="pill">Kayıt: ${formatDate(record.createdAt)}</span>
          ${record.dueDate ? `<span class="pill">Takip: ${formatDate(record.dueDate)}</span>` : ""}
        </div>
      </div>
      <div class="record-actions">
        <button class="record-action" type="button" data-action="toggle" data-id="${record.id}">${toggleText}</button>
        <button class="record-action" type="button" data-action="delete" data-id="${record.id}">Sil</button>
      </div>
    </article>
  `;
}

function offsetDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
