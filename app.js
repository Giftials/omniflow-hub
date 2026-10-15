const saveBtn = document.querySelector('#save-btn');
const statusDisplay = document.querySelector('#status-display');
const docNameInput = document.querySelector('#doc-name');
const deptSelect = document.querySelector('#dept-select');
const logList = document.querySelector('#log-list');
const logCount = document.querySelector('#log-count');
const loginCard = document.querySelector('#login-card');
const appCard = document.querySelector('#app-card');
const usernameInput = document.querySelector('#username-input');
const passwordInput = document.querySelector('#password-input');
const loginBtn = document.querySelector('#login-btn');
const loginStatus = document.querySelector('#login-status');
const currentUserBadge = document.querySelector('#current-user-badge');
const logoutBtn = document.querySelector('#logout-btn');
const clearBtn = document.querySelector('#clear-btn');
const docFilesInput = document.querySelector('#doc-files')
const toast = document.querySelector('#toast');
const toastIcon = document.querySelector('#toast-icon');
const toastMessage = document.querySelector('#toast-message');
const forgotBtn = document.querySelector("#forgot-btn");
const targetDeptSelect = document.querySelector("#target-dept-select");
const roleBadge = document.querySelector("#current-user-badge");
const menuBtn = document.querySelector("#menu-btn");
const sidebar = document.querySelector("#sidebar");
const closeSidebarBtn = document.querySelector("#close-sidebar-btn");
const fileCard = document.querySelector("#file-card");
const navJobBtn = document.querySelector("#nav-job-btn");
const navFileBtn = document.querySelector("#nav-file-btn");
const subMenuBtn = document.querySelector(".sub-menu-btn");
const fileDisplayList = document.querySelector("#file-display-list");
const overLay = document.querySelector("#overlay");
const securityLevelSelect = document.querySelector("#security-level");
const pinBackdrop = document.querySelector('#pin-backdrop');
const pinModal = document.querySelector('#pin-modal');
const supervisorPinInput = document.querySelector('#supervisor-pin');
const confirmPinBtn = document.querySelector('#confirm-pin-btn');
const cancelPinBtn = document.querySelector('#cancel-pin-btn');
const previewBackdrop = document.querySelector('#preview-backdrop');
const previewModal = document.querySelector('#preview-modal');
const previewFrame = document.querySelector('#preview-frame');
const watermarkOverlay = document.querySelector('#watermark-overlay');
const closePreviewBtn = document.querySelector('#close-preview-btn');

let pendingFileUrl = "";
let toastTimer;

function showToast(message, type = "success") {
  toastMessage.textContent = message;

  if (type === "success") {
    toastIcon.textContent = "✅";
    toast.className = "toast toast-success";
  } else if (type === "error") {
    toastIcon.textContent = "⚠️";
    toast.className = "toast toast-error";
  }

  toast.classList.remove('hidden');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    toast.classList.add('hidden');
  }, 3000);
}

let currentSenderDept = "ทั่วไป";

let currentLoggedInDept = "";

function openApp(badgeText, deptName) {
  currentLoggedInDept = deptName;
  roleBadge.textContent = "สิทธิ์: " + badgeText;

  if (deptName !== "all") {
    deptSelect.value = deptName;
    deptSelect.disabled = true; 
  } else {
    deptSelect.disabled = false;
  }

  for (const opt of targetDeptSelect.options) {
    opt.hidden = (opt.value === deptName && deptName !== "all");
  }
  targetDeptSelect.value = "INTERNAL";

  loginCard.classList.add("hidden");
  appCard.classList.remove("hidden");

  filterLogs();
}

const userAccounts = {
  "sa01": { pass: "1234", badge: "🚗 SA รับรถ", dept: "SA" },
  "prt01": { pass: "1234", badge: "⚙️ แผนกอะไหล่", dept: "แผนกอะไหล่" },
  "tech01": { pass: "1234", badge: "🔧 แผนกช่างเทคนิค", dept: "แผนกช่าง" },
  "vdqi01": { pass: "1234", badge: "🚘 แผนก VDQI", dept: "แผนกVDQI" },
  "claim01": { pass: "1234", badge: "📋 แผนกเคลมประกัน", dept: "แผนกเคลม" },
  "reg01": { pass: "1234", badge: "📑 แผนกงานทะเบียน", dept: "แผนกทะเบียน" },
  "call01": { pass: "1234", badge: "📞 Call Center", dept: "Call Center" },

  "sale_show": { pass: "1234", badge: "🛍️ Sales Showroom", dept: "Sales Showroom" },
  "sale_ana": { pass: "1234", badge: "📊 Sales Analysis (ต้นทุน)", dept: "Sales Analysis(ต้นทุน)" },

  "acc01": { pass: "1234", badge: "🧮 แผนกบัญชี", dept: "แผนกบัญชี" },
  "ga01": { pass: "1234", badge: "🛒 General Affair (GA)", dept: "ธุรการ" },
  "it01": { pass: "1234", badge: "💻 แผนก IT", dept: "IT" },
  "admin": { pass: "admin123", badge: "👑 ผู้ดูแลระบบ (ADMIN)", dept: "ผู้บริหาร" }
};

loginBtn.addEventListener('click', function(e) {
  e.preventDefault();
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();

  const account = userAccounts[user];

  if (account && account.pass === pass) {
    openApp(account.badge, account.dept);
    showToast(`ยินดีต้อนรับ ${account.badge}!`, "success");
    passwordInput.value = "";
  } else {
    showToast("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!", "error");
    passwordInput.value = "";
    passwordInput.focus();
  }
});


logoutBtn.addEventListener('click', function() {
  appCard.classList.add('hidden'); 
  fileCard.classList.add('hidden');

  sidebar.classList.add('hidden');
  overLay.classList.add('hidden');

  loginCard.classList.remove('hidden');
  usernameInput.value = "";
  passwordInput.value = "";
  usernameInput.focus();
});

forgotBtn.addEventListener("click", function(e) {
  e.preventDefault();
  showToast("กรุณาติดต่อผู้ดูแลระบบ (ADMIN) เพื่อขอรับรหัสผ่านใหม่", "error");
});

let totalCount = 0;

saveBtn.addEventListener('click', function() {
  const docName = docNameInput.value.trim();
  const senderDept = deptSelect.value;
  const targetDept = targetDeptSelect.value;
  const secLevel = securityLevelSelect.value;
  const files = docFilesInput.files;

  if (docName === "") {
    showToast("กรุณากรอกชื่อหรือเลขที่เอกสาร!", "error");
    return;
  }
if (!files || files.length === 0) {
    showToast("กรุณาแนบไฟล์เอกสารหรือรูปภาพ!", "error");
    return;
  }

  let fileInfoHTML = `<span style="color: #888;">(ไม่มีไฟล์แนบ)</span>`;
  let filePreviewBtn = "";

  if (files.length > 0) {
    const file = files[0];
    const fileUrl = URL.createObjectURL(file);
    fileInfoHTML = `📎 แนบ: <strong>${file.name}</strong> (${files.length} ไฟล์)`;
    filePreviewBtn = `<button class="preview-btn" onclick="handleFilePreview('${fileUrl}', '${secLevel}')">👁️ เปิดดู</button>`;
  }

  const secBadge = secLevel === "CONFIDENTIAL" 
    ? `<span style="background: #ffebee; color: #c62828; padding: 2px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #ffcdd2;">🔒 ลับเฉพาะ</span>` 
    : `<span style="background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #c8e6c9;">🟢 ทั่วไป</span>`;

  const cardHTML = `
    <div class="log-card" data-sender="${senderDept}" data-receiver="${targetDept}" data-security="${secLevel}" style="border-left: 5px solid ${secLevel === 'CONFIDENTIAL' ? '#d32f2f' : '#1976d2'}; padding: 12px; margin-bottom: 10px; background: white; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <h4 style="margin: 0; color: #333;">📄 ${docName}</h4>
        ${secBadge}
      </div>
      <p style="margin: 4px 0; font-size: 0.9rem; color: #555;">
        <strong>ต้นเรื่อง:</strong> ${senderDept} ➔ <strong>ส่งถึง:</strong> ${targetDept === 'INTERNAL' ? '📌 บันทึกใช้ภายในแผนก' : targetDept}
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 0.85rem;">
        <div>${fileInfoHTML}</div>
        <div>${filePreviewBtn}</div>
      </div>
    </div>
  `;

  logList.innerHTML = cardHTML + logList.innerHTML;

  totalCount++;
  logCount.textContent = totalCount;

  docNameInput.value = "";
  docFilesInput.value = "";
  showToast("บันทึกเอกสารเรียบร้อยแล้ว!", "success");

  targetDeptSelect.value = "INTERNAL";
});

clearBtn.addEventListener('click', function() {
  if (totalCount === 0) {
    showToast("ไม่มีรายการเอกสารให้ล้าง", "error");
    return;
  }

  logList.innerHTML = "";

  totalCount = 0;
  logCount.textContent = "0 รายการ";

  showToast("ล้างรายการประวัติทั้งหมดเรียบร้อยแล้ว!", "error");
});


function filterLogs() {
  const allItems = document.querySelectorAll(".log-item, .file-item");
  
  allItems.forEach(function(item) {
    const sender = item.getAttribute("data-sender");
    const receiver = item.getAttribute("data-receiver");
    
    if (currentLoggedInDept === "ADMIN") {
      item.classList.remove("hidden");
    } else if (sender === currentLoggedInDept || receiver === currentLoggedInDept) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });
}

function closeSidebar() {
  sidebar.classList.add("hidden");
  overLay.classList.add("hidden");
}

menuBtn.addEventListener("click", function() {
  sidebar.classList.remove("hidden");
  overLay.classList.remove("hidden");
});

closeSidebarBtn.addEventListener("click", function() {
  sidebar.classList.add("hidden"); 
  overLay.classList.add("hidden");
});

overLay.addEventListener("click", function() {
  sidebar.classList.add("hidden");
  overLay.classList.add("hidden");
});

navFileBtn.addEventListener("click", function() {
  appCard.classList.add("hidden");
  fileCard.classList.remove("hidden");

  navJobBtn.classList.remove("active");
  navFileBtn.classList.add("active");

  sidebar.classList.add("hidden");
  overLay.classList.add('hidden');
});

navJobBtn.addEventListener("click", function() {
  fileCard.classList.add("hidden");
  appCard.classList.remove("hidden");

  navFileBtn.classList.remove("active");
  navJobBtn.classList.add("active");

  sidebar.classList.add("hidden");
  overLay.classList.add('hidden');
});

if (subMenuBtn) {
  subMenuBtn.addEventListener("click", function() {
    sidebar.classList.remove("hidden");
  });
}

function goToJobPage() {
  fileCard.classList.add("hidden");       
  appCard.classList.remove("hidden");     
  
  navFileBtn.classList.remove("active");
  navJobBtn.classList.add("active");
  
  sidebar.classList.add("hidden");
  overLay.classList.add("hidden");        
}

const brandHomeBtn = document.querySelector("#brand-home-btn");
if (brandHomeBtn) {
  brandHomeBtn.addEventListener("click", goToJobPage);
}


const backToJobBtn = document.querySelector("#back-to-job-btn");
if (backToJobBtn) {
  backToJobBtn.addEventListener("click", goToJobPage);
}

function handleFilePreview(fileUrl, secLevel) {
  if (secLevel === "CONFIDENTIAL" && currentLoggedInDept !== "all") {

      pendingFileUrl = fileUrl;
    supervisorPinInput.value = "";
    pinModal.classList.remove('hidden');
    pinBackdrop.classList.remove('hidden');
    supervisorPinInput.focus();
  } else {
   openSecurePreview(fileUrl);
  }
}

cancelPinBtn.addEventListener('click', function() {
  pinModal.classList.add('hidden');
  pinBackdrop.classList.add('hidden');
  pendingFileUrl = "";
});

pinBackdrop.addEventListener('click', function() {
  pinModal.classList.add('hidden');
  pinBackdrop.classList.add('hidden');
  pendingFileUrl = "";
});

confirmPinBtn.addEventListener('click', function() {
  const enteredPin = supervisorPinInput.value.trim();

  if (enteredPin === "9999") {
    pinModal.classList.add('hidden');
    pinBackdrop.classList.add('hidden');
    window.open(pendingFileUrl);
    showToast("อนุมัติสิทธิ์หัวหน้าสำเร็จ! กำลังเปิดเอกสาร...", "success");
    pendingFileUrl = "";

  } else {
   
    showToast("รหัส PIN ไม่ถูกต้อง! กรุณาลองใหม่", "error");
    supervisorPinInput.value = "";
    supervisorPinInput.focus();
  }
});
  
function openSecurePreview(fileUrl) {
  const now = new Date().toLocaleString('th-TH');

  watermarkOverlay.innerHTML = `
    🔒 CONFIDENTIAL DOCUMENT<br>
    ผู้เปิดอ่าน: ${currentLoggedInDept}<br>
    เวลา: ${now}
  `;

  previewFrame.src = fileUrl;
  previewModal.classList.remove('hidden');
  previewBackdrop.classList.remove('hidden'); 
}

closePreviewBtn.addEventListener('click', function() {
  previewModal.classList.add('hidden');
  previewBackdrop.classList.add('hidden');
  previewFrame.src = "";
});

previewBackdrop.addEventListener('click', function() {
  previewModal.classList.add('hidden');
  previewBackdrop.classList.add('hidden');
  previewFrame.src = "";
});

