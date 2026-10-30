// โซนตัวแปร IDและClassต่างๆจากHTML
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
const docFileInput = document.querySelector("#doc-files");
const sizeAlertMsg = document.querySelector("#sizeAlert");
const deptSelector = document.querySelector("#dept-select");
const statusBadge = document.querySelector("#status-display");
const docTypeSelect = document.querySelector("#doc-type-select");
const blurBtn = document.querySelector('#blurToggleBtn');
const fileListBox = document.querySelector('#file-display-list');
const logListBox = document.querySelector('#log-list') || document.querySelector('#history-list');
const docCategorySelect = document.querySelector('#docType') || document.querySelector('#docCategory');
const docTitleInput = document.querySelector('#docTitle') || document.querySelector('#docSubject');


let pendingFileUrl = "";
let toastTimer;

// ฟังก์ชั่นแจ้งเตือนต่างๆมีเวลานับถอยหลังหายเอง
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
 // 5 บทบาทระบบหลักเอกสาร
 "prc01": { pass: "1234", badge: "🛒 จัดซื้อ (Procurement)", dept: "procurement" },
  "fin01": { pass: "1234", badge: "💵 บัญชี/การเงิน (Finance)", dept: "finance" },
  "hr01":  { pass: "1234", badge: "🧑‍💼 บุคคล (HR)", dept: "hr" },
  "mgr01": { pass: "1234", badge: "🏢 ผู้บริหาร (Management)", dept: "management" },
  "admin": { pass: "admin123", badge: "👑 ผู้ดูแลระบบ (ADMIN)", dept: "admin" }
};
// โซนระบบล็อกอิน
loginBtn.addEventListener('click', function(e) {
  e.preventDefault();
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();

  const account = userAccounts[user];
// ตรงนี้คือถ้ารหัสผ่าน จะมีแจ้งเตือนยินดีต้อนรับ และถ้าผิด จะขึ้นแจ้งเตือนอีกแบบ
  if (account && account.pass === pass) {
    unblurScreen();
    menuBtn.classList.remove('active');
    openApp(account.badge, account.dept);
    showToast(`ยินดีต้อนรับ ${account.badge}!`, "success");
    passwordInput.value = "";
  } else {
    showToast("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!", "error");
    passwordInput.value = "";
    passwordInput.focus();
  }
});
// ฟังก์ชั่นตรงคือ เราสารถใส่รหัสผ่าน และ กดenterเข้าสู่ระบบได้เลย โดยไม่ต้องเลื่อนเมาส์ไปกด
passwordInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    loginBtn.click();
  }
});

// โซนระบบล็อกเอ้าท์ออก
logoutBtn.addEventListener('click', function() {
  appCard.classList.add('hidden'); 
  fileCard.classList.add('hidden');

  sidebar.classList.add('hidden');
  overLay.classList.add('hidden');
  menuBtn.classList.remove('active');

  loginCard.classList.remove('hidden');
  usernameInput.value = "";
  passwordInput.value = "";
  usernameInput.focus();
});
// ปุ่มลืมรหัสผ่าน
forgotBtn.addEventListener("click", function(e) {
  e.preventDefault();
  showToast("กรุณาติดต่อผู้ดูแลระบบ (ADMIN) เพื่อขอรับรหัสผ่านใหม่", "error");
});

let totalCount = 0;
// ปุ่มเซฟงาน หรือ ปุ่มบันทุกเอกสาร ส่วนหน้าแรก
saveBtn.addEventListener('click', function() {
  docTypeSelect.selectedIndex = 0;
  const docName = docNameInput.value.trim();
  const senderDept = currentLoggedInDept;
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
// ปุ่มพรีวิวไฟล์ที่ส่ง
  if (files.length > 0) {
    const file = files[0];
    const fileUrl = URL.createObjectURL(file);
    fileInfoHTML = `📎 แนบ: <strong>${file.name}</strong> (${files.length} ไฟล์)`;
    filePreviewBtn = `<button class="preview-btn" onclick="handleFilePreview('${fileUrl}', '${secLevel}')">👁️ เปิดดู</button>`;
  }
// แทบเลือกความสำคัญของเอกสารแต่ละประเภท
  const secBadge = secLevel === "CONFIDENTIAL" 
    ? `<span style="background: #ffebee; color: #c62828; padding: 2px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #ffcdd2;">🔒 ลับเฉพาะ</span>` 
    : `<span style="background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #c8e6c9;">🟢 ทั่วไป</span>`;
// แม่พิมพ์การ์ดประวัติเอกสาร (หน้าบันทึกด่วน) ดึงชื่อเรื่อง แผนก และระดับความลับมาประกอบร่าง
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
// เอาการ์ดใหม่ไปเสียบไว้บนสุดของกล่องประวัติ
  logList.innerHTML = cardHTML + logList.innerHTML;
// ถ้ามีการแนบไฟล์จริง ให้เสกการ์ดไฟล์พร้อมปุ่ม [โหลด] และ [ลบ] ส่งเข้าคลังเอกสาร
  if (files.length > 0) {
    const fileCardItem = `
      <div class="file-item" data-sender="${senderDept}" data-receiver="${targetDept}" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #ffffff; border: 1px solid var(--border-strong); border-radius: 10px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
        <div>
          <div style="font-weight: 700; color: var(--text-main);">📎 ${files[0].name}</div>
          <div style="font-size: 0.85rem; color: var(--text-sub); margin-top: 4px;">จากเอกสาร: <strong>${docName}</strong> (${senderDept} ➔ ${targetDept === 'INTERNAL' ? 'ใช้ภายในแผนก' : targetDept})</div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          ${secBadge}
          ${filePreviewBtn}
          <button class="repo-download-btn" data-filename="${files[0].name}" style="background:#2563eb; color:white; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;">📥 โหลด</button>
          <button class="repo-del-btn" style="background:#fee2e2; color:#dc2626; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;">❌ ลบ</button>
        </div>
      </div>
    `;

    if (fileDisplayList.innerHTML.includes("ยังไม่มี")) {
      fileDisplayList.innerHTML = "";
    }
    
    fileDisplayList.innerHTML = fileCardItem + fileDisplayList.innerHTML;
  }

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
  // 1. ดึงทั้งการ์ดงาน (.log-card) และการ์ดไฟล์ (.file-item) มาตรวจพร้อมกัน
  const allItems = document.querySelectorAll(".log-card, .file-item");

  allItems.forEach(function(item) {
    const sender = item.getAttribute("data-sender");
    const receiver = item.getAttribute("data-receiver");

    // 2. ถ้าเป็นแอดมิน (all หรือ ADMIN): มองเห็นครบทุกอย่าง 100%
    if (currentLoggedInDept === "all" || currentLoggedInDept === "ADMIN") {
      item.classList.remove("hidden");
    // 3. ถ้าเป็นคนส่ง หรือคนรับ หรือเป็นงานใช้ภายในแผนกตัวเอง: ให้มองเห็นได้
    } else if (sender === currentLoggedInDept || receiver === currentLoggedInDept || (receiver === "INTERNAL" && sender === currentLoggedInDept)) {
      item.classList.remove("hidden");
    // 4. ถ้าเป็นแผนกอื่นที่ไม่เกี่ยวข้อง: สั่งซ่อนทันที!
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
// แทบด้านข้าง สำหรับในหน้าส่งไฟล์
navFileBtn.addEventListener("click", function() {
  unblurScreen();
  appCard.classList.add("hidden");
  fileCard.classList.remove("hidden");

  navJobBtn.classList.remove("active");
  navFileBtn.classList.add("active");

  sidebar.classList.add("hidden");
  overLay.classList.add('hidden');
});
// แทบด้านข้าง สำหรับในหน้าคลังเอกสาร
navJobBtn.addEventListener("click", function() {
  unblurScreen();
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
// ไปหน้าคลังเอกสาร
const brandHomeBtn = document.querySelector("#brand-home-btn");
if (brandHomeBtn) {
  brandHomeBtn.addEventListener("click", goToJobPage);
}

// กลับจากหน้าคลังเอกสาร
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
// ระบบpinเอกสารความสำคัญ
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
// ลายน้ำหลังเอกสารตอนนดูพรีวิว ชื่อ แผนก วันที่และเวลา
  watermarkOverlay.innerHTML = `
    🔒 CONFIDENTIAL DOCUMENT<br>
    ผู้เปิดอ่าน: ${currentLoggedInDept}<br>
    วันที่และเวลา: ${now}
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

// --- อะไหล่ชิ้นที่ 5: แปลงร่างปุ่ม 3 ขีด และคืนร่างเมื่อลิ้นชักปิด ---
if (menuBtn) {
  menuBtn.addEventListener("click", function () {
    menuBtn.classList.toggle("active");
  });
}

// --- ฟังก์ชันปิด Sidebar คลีน 100% ปราบแฮมเบอร์เกอร์ค้าง ---
function closeSidebar() {
  sidebar?.classList.add('hidden');
  overlay?.classList.add('hidden');
  menuBtn?.classList.remove('active'); // บังคับคืนร่าง 3 ขีดเสมอ
}

// สั่งปิดเมนูเมื่อกดปุ่มกากบาท หรือกดพื้นที่สีเทาข้างนอก
closeSidebarBtn?.addEventListener('click', closeSidebar);
overlay?.addEventListener('click', closeSidebar);


// ใช้ตัวแปรใหม่ดักฉากหลัง ป้องกันชื่อตัวแปรชนกัน
const darkBackdrop = document.querySelector("#overlay");
if (darkBackdrop) {
  darkBackdrop.addEventListener("click", function () {
    menuBtn.classList.remove("active");
  });
}

if (docFileInput && sizeAlertMsg) {
  docFileInput.addEventListener("change", function () {
    const file = docFileInput.files[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      if (file.size > 20 * 1024 * 1024) {
        sizeAlertMsg.textContent = `⚠️ ไฟล์ใหญ่เกินไป (${sizeMB} MB) จำกัดไม่เกิน 20MB`;
        sizeAlertMsg.style.color = "#ef4444";
        docFileInput.value = ""; // ล้างค่าออก ป้องกันเซิร์ฟเวอร์ล่ม
      } else {
        sizeAlertMsg.textContent = `✅ ขนาดไฟล์ผ่าน (${sizeMB} MB)`;
        sizeAlertMsg.style.color = "#16a34a";
      }
    }
  });
}

if (deptSelector && statusBadge) {
  deptSelector.addEventListener("change", function () {
    statusBadge.textContent = `โหมดเอกสาร: ${deptSelector.options[deptSelector.selectedIndex].text}`;
    statusBadge.style.color = "#0284c7";
  });
}

if (docTypeSelect && statusDisplay) {
  docTypeSelect.addEventListener("change", function () {
    statusDisplay.textContent = `เอกสารที่กำลังทำ: ${docTypeSelect.value}`;
    statusDisplay.style.color = "#0284c7";
  });
}

// --- อะไหล่ชิ้นที่ 1 & 2: สั่งปุ่มดาวน์โหลด (Virtual Anchor) + ปุ่มลบในคลังเอกสาร ---
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("repo-download-btn")) {
    const fileName = e.target.getAttribute("data-filename") || "OmniFlow_Doc.txt";
    const link = document.createElement("a");
    link.href = "data:text/plain;charset=utf-8," + encodeURIComponent("สำเนาเอกสารฉุกเฉิน: " + fileName);
    link.download = fileName;
    link.click();
    showToast("ดาวน์โหลด " + fileName + " สำเร็จ!", "success");
  }

  if (e.target.classList.contains("repo-del-btn")) {
    if (confirm("⚠️ ยืนยันการลบไฟล์นี้ออกจากคลังเอกสารใช่หรือไม่?")) {
      const card = e.target.closest(".file-item");
      if (card) card.remove();
      showToast("ลบไฟล์ออกจากคลังเรียบร้อยแล้ว", "error");
    }
  }
});

// --- ระบบม่านบังตาฉุกเฉิน & Auto-Blur ปลอดภัย 100% ---
// ฟังก์ชันกลาง: ปลดม่านเบลอ คืนความชัด
function unblurScreen() {
  fileListBox?.classList.remove('privacy-blur');
  logListBox?.classList.remove('privacy-blur'); // 👈 ปลดเบลอกล่องประวัติ
  document.querySelectorAll('.btn-blur').forEach(btn => {
    btn.textContent = '👁️ ม่านบังตา';
  });
}

// ฟังก์ชันกลาง: สั่งปิดม่านบังตา
function blurScreen() {
  fileListBox?.classList.add('privacy-blur');
  logListBox?.classList.add('privacy-blur'); // 👈 สั่งเบลอกล่องประวัติตรงนี้เลย!
  document.querySelectorAll('.btn-blur').forEach(btn => {
    btn.textContent = '🙈 ม่านบังตาทำงาน';
  });
}

// 1. กดปุ่มเปิด-ปิด ม่านบังตาด้วยตัวเอง
blurBtn?.addEventListener('click', () => {
  const isBlurred = fileListBox?.classList.contains('privacy-blur');
  if (isBlurred) {
    unblurScreen();
  } else {
    blurScreen();
  }
});

// 2. ระบบ Auto-Blur จับเวลา (ขยับเมาส์/กดแป้น = ปลดเบลอทันที)
let idleTimer;
function handleUserActivity() {
  // ถ้าม่านบังตาปิดอยู่ แล้วมีการขยับเมาส์หรือกดปุ่ม -> สั่งเปิดม่านทันที
  if (fileListBox?.classList.contains('privacy-blur')) {
    unblurScreen();
  }

  // รีเซ็ตเวลานับถอยหลังใหม่ (ตั้งไว้ 60 วินาที)
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    blurScreen();
  }, 5000);
}

window.addEventListener('keydown', handleUserActivity);
handleUserActivity(); // เริ่มจับเวลา

docTypeSelect?.addEventListener('change', (e) => {
  // ตรวจจับว่ามีคำว่า "ใบลา" อยู่ในตัวเลือกที่เลือกหรือไม่
  if (e.target.value.includes('ใบลา')) {
    docNameInput.value = '[ใบลา] ขอลาป่วย/ลากิจ - ';
    docNameInput.focus(); // เด้งเคอร์เซอร์ไปรอให้พิมพ์ต่อทันที
  }
});

// ดักจับปุ่มม่านบังตาทุกปุ่มในระบบ (ไม่ว่าจะอยู่หน้าคลังหรือหน้าบันทึก)
document.querySelectorAll('.btn-blur').forEach(btn => {
  btn.addEventListener('click', () => {
    const isBlurred = fileListBox?.classList.contains('privacy-blur');
    if (isBlurred) {
      unblurScreen();
    } else {
      blurScreen();
    }
  });
});
