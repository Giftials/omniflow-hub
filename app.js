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
const closeSidebarBtn = document.querySelector("#close-sidebar-btn")
const fileCard = document.querySelector("#file-card");
const navJobBtn = document.querySelector("#nav-job-btn");
const navFileBtn = document.querySelector("#nav-file-btn");
const subMenuBtn = document.querySelector(".sub-menu-btn");
const fileDisplayList = document.querySelector("#file-display-list");
const overLay = document.querySelector("#overlay");

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

  if (deptName !== "ADMIN") {
    deptSelect.value = deptName;
  }

  loginCard.classList.add("hidden");
  appCard.classList.remove("hidden");

  filterLogs();
}

loginBtn.addEventListener('click', function() {
  const user = usernameInput.value;
  const pass = passwordInput.value;

  if (user === "prt01" && pass === "1234") {
    openApp("⚙️ แผนกอะไหล่", "แผนกอะไหล่");

  } else if (user === "pur01" && pass === "pur333") {
    openApp("🛒 แผนกจัดซื้อ", "แผนกจัดซื้อ");

  } else if (user === "tech01" && pass === "5678") {
    openApp("🔧 แผนกช่างเทคนิค", "แผนกช่างเทคนิค");

  } else if (user === "mkt01" && pass === "mkt111") {
    openApp("📄 แผนกการตลาด", "แผนกการตลาด");

  } else if (user === "acc01" && pass === "acc222") {
    openApp("📠 แผนกบัญชี", "แผนกบัญชี");

  } else if (user === "hr01" && pass === "hr888") {
    openApp("👩‍💼 แผนกบุคคล", "แผนกบุคคล");

  } else if (user === "admin" && pass === "admin99") {
    openApp("👑 ผู้ดูแลระบบ (ADMIN)", "all");

  } else if (user === "it01" && pass === "it777") {
    openApp("💻 แผนกไอที", "แผนกไอที");    

  } else {

    showToast("รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง!", "error");
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
  const docName = docNameInput.value;
  const dept = deptSelect.value;
  const targetDept = targetDeptSelect.value;

  let routeDisplay = "";
  let actualReceiver = "";

  if (targetDept === "INTERNAL") {
      routeDisplay = `<span style="color: #059669; font-weight: bold;">📌 ใช้ภายในแผนก</span>`;
      actualReceiver = dept;
    } else {
      routeDisplay = `<span style="color: #2563eb; font-weight: bold;">🚀 ส่งต่อ: จาก ${dept} ➔ ถึง ${targetDept}</span>`;
      actualReceiver = targetDept;
    }

  if (docName === "") {
  showToast("กรุณากรอกชื่อหรือเลขที่เอกสารก่อน!", "error");
  docNameInput.focus();
  return;
  }

  if (docFilesInput.files.length === 0) {
    showToast("กรุณาแนบไฟล์เอกสารหรือรูปภาพก่อนบันทึก!", "error");
    docFilesInput.focus();
    return;
  }

  let fileInfo = "📎 ไม่มีไฟล์แนบ";
  const attachedFiles = docFilesInput.files;

  if (attachedFiles.length === 1) {
    fileInfo = "📎 " + attachedFiles[0].name;
  } else if (attachedFiles.length > 1) {
    fileInfo = "📎 แนบแล้ว " + attachedFiles.length + " ไฟล์";
  }

  const newCardHTML = `
    <div class="log-item" data-sender="${dept}" data-receiver="${actualReceiver}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <strong>📄 ${docName}</strong>
          <span style="font-size: 0.8rem; color: #64748b;">${fileInfo}</span>
        </div>
        <div style="font-size: 0.85rem; margin-top: 4px;">
          ${routeDisplay}
        </div>
      </div>
    `;

  logList.innerHTML = newCardHTML + logList.innerHTML;

  totalCount = totalCount +1;
  logCount.textContent = totalCount + "รายการ";

  showToast("บันทึก [" + dept + "] เรียบร้อยแล้ว!", "success");

  if (attachedFiles.length > 0) {
      const fileURL = URL.createObjectURL(attachedFiles[0]);
      
      const fileCardHTML = `
        <div class="file-item" data-sender="${dept}" data-receiver="${actualReceiver}" style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; padding: 12px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="font-size: 0.95rem; color: #1e293b;">📄 ${docName}</strong>
              <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">
                📎 ${attachedFiles[0].name}
              </div>
            </div>
            <a href="${fileURL}" target="_blank" style="background: #eff6ff; color: #2563eb; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 0.85rem; font-weight: bold; border: 1px solid #bfdbfe;">
              👁️ เปิดดู
            </a>
          </div>
          <div style="font-size: 0.8rem; margin-top: 8px; padding-top: 6px; border-top: 1px dashed #f1f5f9;">
            ${routeDisplay}
          </div>
        </div>
      `;

      if (fileDisplayList.innerHTML.includes("ยังไม่มีการเปิดอ่านไฟล์")) {
        fileDisplayList.innerHTML = "";
      }
      fileDisplayList.innerHTML = fileCardHTML + fileDisplayList.innerHTML;
    }

  docNameInput.value = "";
  docNameInput.focus();
  docFilesInput.value = "";

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
});

navJobBtn.addEventListener("click", function() {
  fileCard.classList.add("hidden");
  appCard.classList.remove("hidden");

  navFileBtn.classList.remove("active");
  navJobBtn.classList.add("hidden");

  sidebar.classList.add("hidden");
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
