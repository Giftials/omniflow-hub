/* =====================================================================
 * [โซน 1] คลังตัวแปร (DOM Elements) & ข้อมูลผู้ใช้ (userAccounts)
 * ===================================================================== */

// ---------- 1.1 ระบบล็อกอิน ----------
const loginCard = document.querySelector('#login-card');
const usernameInput = document.querySelector('#username-input');
const passwordInput = document.querySelector('#password-input');
const loginBtn = document.querySelector('#login-btn');
const loginStatus = document.querySelector('#login-status');
const forgotBtn = document.querySelector("#forgot-btn");
const logoutBtn = document.querySelector('#logout-btn');
const currentUserBadge = document.querySelector('#current-user-badge');
const roleBadge = document.querySelector("#current-user-badge");

// ---------- 1.2 หน้าบันทึกงาน (App Card) & ฟอร์มเอกสาร ----------
const appCard = document.querySelector('#app-card');
const saveBtn = document.querySelector('#save-btn');
const clearBtn = document.querySelector('#clear-btn');
const statusDisplay = document.querySelector('#status-display');
const statusBadge = document.querySelector("#status-display");
const docNameInput = document.querySelector('#doc-name');
const deptSelect = document.querySelector('#dept-select');
const deptSelector = document.querySelector("#dept-select");
const targetDeptSelect = document.querySelector("#target-dept-select");
const securityLevelSelect = document.querySelector("#security-level");
const docTypeSelect = document.querySelector("#doc-type-select");
const docFilesInput = document.querySelector('#doc-files');
const docFileInput = document.querySelector("#doc-files");
const sizeAlertMsg = document.querySelector("#sizeAlert");
const docCategorySelect = document.querySelector('#docType') || document.querySelector('#docCategory');
const docTitleInput = document.querySelector('#docTitle') || document.querySelector('#docSubject');

// ---------- 1.3 กล่องประวัติ & คลังเอกสาร ----------
const logList = document.querySelector('#log-list');
const logCount = document.querySelector('#log-count');
const logListBox = document.querySelector('#log-list') || document.querySelector('#history-list');
const fileCard = document.querySelector("#file-card");
const fileDisplayList = document.querySelector("#file-display-list");
const fileListBox = document.querySelector('#file-display-list');

// ---------- 1.4 แถบเมนูด้านข้าง & ปุ่มนำทาง ----------
const menuBtn = document.querySelector("#menu-btn");
const sidebar = document.querySelector("#sidebar");
const closeSidebarBtn = document.querySelector("#close-sidebar-btn");
const overLay = document.querySelector("#overlay");
const darkBackdrop = document.querySelector("#overlay"); // ใช้ตัวแปรใหม่ดักฉากหลัง ป้องกันชื่อตัวแปรชนกัน
const navJobBtn = document.querySelector("#nav-job-btn");
const navFileBtn = document.querySelector("#nav-file-btn");
const subMenuBtn = document.querySelector(".sub-menu-btn");
const brandHomeBtn = document.querySelector("#brand-home-btn");
const backToJobBtn = document.querySelector("#back-to-job-btn");

// ---------- 1.5 แจ้งเตือน (Toast) ----------
const toast = document.querySelector('#toast');
const toastIcon = document.querySelector('#toast-icon');
const toastMessage = document.querySelector('#toast-message');

// ---------- 1.6 ความปลอดภัย: PIN, พรีวิว, ม่านบังตา ----------
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
const blurBtn = document.querySelector('#blurToggleBtn'); // เก็บตัวแปรไว้ตามเดิม (ไม่ได้ผูก listener แยกแล้ว ดู [แก้บั๊ก #2])

// ---------- 1.7 ตัวแปรสถานะของระบบ (State) ----------
let pendingFileUrl = "";
let toastTimer; //popup แทบแจ้งเตือน
let currentSenderDept = "ทั่วไป";
let currentLoggedInDept = "";
let totalCount = 0;
let idleTimer;

// ---------- 1.8 ข้อมูลบัญชีผู้ใช้ (5 บทบาทระบบหลักเอกสาร) ----------
const userAccounts = {
  "prc01": { pass: "1234", badge: "🛒 จัดซื้อ (Procurement)", dept: "procurement" },
  "fin01": { pass: "1234", badge: "💵 บัญชี/การเงิน (Finance)", dept: "finance" },
  "hr01":  { pass: "1234", badge: "🧑‍💼 บุคคล (HR)", dept: "hr" },
  "mgr01": { pass: "1234", badge: "🏢 ผู้บริหาร (Management)", dept: "management" },
  "admin": { pass: "admin123", badge: "👑 ผู้ดูแลระบบ (ADMIN)", dept: "admin" }
};


/* =====================================================================
 * [โซน 2] ฟังก์ชันแจ้งเตือน (showToast)
 * ===================================================================== */

// แสดงแจ้งเตือน และซ่อนเองอัตโนมัติเมื่อครบ 3 วินาที
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

  clearTimeout(toastTimer); //ตัวตั้งเวลา แทบแจ้งเตือนต่างๆ ให้หายไปเอง
  toastTimer = setTimeout(function() {
    toast.classList.add('hidden');
  }, 3000);
}


/* =====================================================================
 * [โซน 3] ระบบความปลอดภัยและม่านบังตา (Privacy Blur & Auto-Blur Timer)
 * ===================================================================== */

// ---------- 3.1 ฟังก์ชันกลาง: ปลดม่าน / ปิดม่าน ----------
// ปลดม่านเบลอ คืนความชัด
function unblurScreen() {
  fileListBox?.classList.remove('privacy-blur');
  logListBox?.classList.remove('privacy-blur'); // ปลดเบลอกล่องประวัติ
  document.querySelectorAll('.btn-blur').forEach(btn => {
    btn.textContent = '👁️ ม่านบังตา';
  });
}

// สั่งปิดม่านบังตา
function blurScreen() {
  fileListBox?.classList.add('privacy-blur');
  logListBox?.classList.add('privacy-blur'); // เบลอกล่องประวัติด้วย
  document.querySelectorAll('.btn-blur').forEach(btn => {
    btn.textContent = '🙈 ม่านบังตาทำงาน';
  });
}

// ---------- 3.2 ปุ่มเปิด-ปิดม่านบังตาด้วยตัวเอง ----------
// [แก้บั๊ก #2] ลบ listener ที่ผูกกับ blurBtn (#blurToggleBtn) แยกออกไปแล้ว
// เหลือดักฟังผ่าน .btn-blur เพียงจุดเดียว เพื่อไม่ให้คลิก 1 ครั้งแล้วสลับสถานะ 2 รอบ
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

// ---------- 3.3 Auto-Blur จับเวลา (กดแป้น = ปลดเบลอทันที) ----------
function handleUserActivity() {
  // ถ้าม่านบังตาปิดอยู่ แล้วมีกดปุ่ม -> สั่งเปิดม่านทันที
  if (fileListBox?.classList.contains('privacy-blur')) {
    unblurScreen();
  }

  // รีเซ็ตเวลานับถอยหลังใหม่ (ปัจจุบันตั้งไว้ 300000 ms = 5 นาที | ถ้าต้องการ 30 วินาที ให้ใช้ 30000)
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    blurScreen();
  }, 300000); //ปรับเวลาตรงนี้
}

window.addEventListener('keydown', handleUserActivity); // [แก้บั๊ก #4] กดเฉพาะแป้นพิมพ์ = ปลดเบลอ + รีเซ็ตเวลา
handleUserActivity(); // เริ่มจับเวลา

// ---------- 3.4 ระบบ PIN หัวหน้า สำหรับเอกสารลับ ----------

function handleFilePreview(fileUrl, secLevel) {
  // แก้ไขตรงนี้: เพิ่มเงื่อนไขเช็ก admin (ทั้งพิมพ์เล็กและใหญ่) ไม่ต้องกรอก PIN
  if (secLevel === "CONFIDENTIAL" && currentLoggedInDept !== "all" && String(currentLoggedInDept).toLowerCase() !== "admin") {
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
    // [แก้บั๊ก #3] เปลี่ยนจาก window.open(pendingFileUrl) เป็นเปิดผ่านหน้าต่างพรีวิวพร้อมลายน้ำ
    openSecurePreview(pendingFileUrl);
    showToast("อนุมัติสิทธิ์หัวหน้าสำเร็จ! กำลังเปิดเอกสาร...", "success");
    pendingFileUrl = "";
  } else {
    showToast("รหัส PIN ไม่ถูกต้อง! กรุณาลองใหม่", "error");
    supervisorPinInput.value = "";
    supervisorPinInput.focus();
  }
});

// ---------- 3.5 หน้าต่างพรีวิวเอกสาร + ลายน้ำ ----------
function openSecurePreview(fileUrl) {
  const now = new Date().toLocaleString('th-TH');

  // ลายน้ำบนเอกสารตอนพรีวิว: ผู้เปิดอ่าน (แผนก), วันที่และเวลา
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


/* =====================================================================
 * [โซน 4] แถบเมนูและการสลับหน้า (Sidebar, Navigation & Logout)
 * ===================================================================== */

// ---------- 4.1 ฟังก์ชันปิด Sidebar ----------
// หมายเหตุ: มีการประกาศ closeSidebar ซ้ำ 2 ครั้ง (คงไว้ตามต้นฉบับ)
// เนื่องจาก function declaration ถูก hoist ตัวที่ประกาศ "ทีหลัง" (ตัวที่ 2) คือตัวที่ทำงานจริง
function closeSidebar() {
  sidebar.classList.add("hidden");
  overLay.classList.add("hidden");
}

// ฟังก์ชันปิด Sidebar คลีน 100% ปราบแฮมเบอร์เกอร์ค้าง (ตัวที่ทำงานจริง)
function closeSidebar() {
  sidebar?.classList.add('hidden');
  overlay?.classList.add('hidden');
  menuBtn?.classList.remove('active'); // บังคับคืนร่าง 3 ขีดเสมอ
}

// ---------- 4.2 ปุ่ม 3 ขีด (เปิดเมนู + แปลงร่างปุ่ม) ----------
menuBtn.addEventListener("click", function() {
  sidebar.classList.remove("hidden");
  overLay.classList.remove("hidden");
});

// แปลงร่างปุ่ม 3 ขีด และคืนร่างเมื่อลิ้นชักปิด
if (menuBtn) {
  menuBtn.addEventListener("click", function () {
    menuBtn.classList.toggle("active");
  });
}

// ---------- 4.3 ปิดเมนูด้วยปุ่มกากบาท / คลิกพื้นที่สีเทา ----------
closeSidebarBtn.addEventListener("click", function() {
  sidebar.classList.add("hidden");
  overLay.classList.add("hidden");
});

overLay.addEventListener("click", function() {
  sidebar.classList.add("hidden");
  overLay.classList.add("hidden");
});

closeSidebarBtn?.addEventListener('click', closeSidebar);
overlay?.addEventListener('click', closeSidebar);

if (darkBackdrop) {
  darkBackdrop.addEventListener("click", function () {
    menuBtn.classList.remove("active");
  });
}

// ---------- 4.4 สลับหน้า: บันทึกงาน <-> คลังเอกสาร ----------
// เมนูด้านข้าง: ไปหน้าคลังเอกสาร
navFileBtn.addEventListener("click", function() {
  unblurScreen();
  appCard.classList.add("hidden");
  fileCard.classList.remove("hidden");

  navJobBtn.classList.remove("active");
  navFileBtn.classList.add("active");

  sidebar.classList.add("hidden");
  overLay.classList.add('hidden');
  menuBtn.classList.remove("active"); // [แก้บั๊ก #5] คืนร่างปุ่ม 3 ขีด ไม่ให้ค้างเป็นตัว X
});

// เมนูด้านข้าง: ไปหน้าบันทึกงาน
navJobBtn.addEventListener("click", function() {
  unblurScreen();
  fileCard.classList.add("hidden");
  appCard.classList.remove("hidden");

  navFileBtn.classList.remove("active");
  navJobBtn.classList.add("active");

  sidebar.classList.add("hidden");
  overLay.classList.add('hidden');
  menuBtn.classList.remove("active"); // [แก้บั๊ก #5] คืนร่างปุ่ม 3 ขีด ไม่ให้ค้างเป็นตัว X
});

// ปุ่ม ☰ ในหน้าคลังเอกสาร
if (subMenuBtn) {
  subMenuBtn.addEventListener("click", function() {
    sidebar.classList.remove("hidden");
    overLay.classList.remove("hidden"); // [ปรับปรุง] เปิดฉากหลังสีเทาพร้อม Sidebar (กดพื้นที่สีเทาเพื่อปิดได้)
  });
}

// ฟังก์ชันกลาง: กลับไปหน้าบันทึกงาน
function goToJobPage() {
  fileCard.classList.add("hidden");
  appCard.classList.remove("hidden");

  navFileBtn.classList.remove("active");
  navJobBtn.classList.add("active");

  sidebar.classList.add("hidden");
  overLay.classList.add("hidden");
  menuBtn.classList.remove("active"); // [แก้บั๊ก #5] คืนร่างปุ่ม 3 ขีด ไม่ให้ค้างเป็นตัว X
}

// กดโลโก้แบรนด์ -> กลับหน้าบันทึกงาน
if (brandHomeBtn) {
  brandHomeBtn.addEventListener("click", goToJobPage);
}

// ปุ่มย้อนกลับจากหน้าคลังเอกสาร
if (backToJobBtn) {
  backToJobBtn.addEventListener("click", goToJobPage);
}

// ---------- 4.5 ออกจากระบบ (Logout) ----------
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


/* =====================================================================
 * [โซน 5] ระบบล็อกอินและทางลัดแบบฟอร์ม (Login, Enter key, Auto-Prefix ใบลา)
 * ===================================================================== */

// ---------- 5.1 เปิดแอปหลังล็อกอิน & กำหนดสิทธิ์แผนก ----------
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

// ---------- 5.2 กรองการ์ดตามสิทธิ์แผนก ----------
function filterLogs() {
  // 1. ดึงทั้งการ์ดงาน (.log-card) และการ์ดไฟล์ (.file-item) มาตรวจพร้อมกัน
  const allItems = document.querySelectorAll(".log-card, .file-item");

  allItems.forEach(function(item) {
    const sender = item.getAttribute("data-sender");
    const receiver = item.getAttribute("data-receiver");

    // 2. ถ้าเป็นแอดมิน (all หรือ admin/ADMIN/Admin ทุกรูปแบบ): มองเห็นครบทุกอย่าง 100%
    // [แก้บั๊ก #1] แปลงเป็นตัวพิมพ์เล็กก่อนเทียบ ให้ครอบคลุมทั้ง "admin" และ "ADMIN"
    if (currentLoggedInDept === "all" || String(currentLoggedInDept).toLowerCase() === "admin") {
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

// ---------- 5.3 ปุ่มเข้าสู่ระบบ ----------
loginBtn.addEventListener('click', function(e) {
  e.preventDefault();
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();

  const account = userAccounts[user];

  // รหัสถูก -> แจ้งเตือนยินดีต้อนรับ / รหัสผิด -> แจ้งเตือนข้อผิดพลาด
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

// ---------- 5.4 กด Enter ในช่องรหัสผ่าน = เข้าสู่ระบบทันที ----------
passwordInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    loginBtn.click();
  }
});

// ---------- 5.5 ปุ่มลืมรหัสผ่าน ----------
forgotBtn.addEventListener("click", function(e) {
  e.preventDefault();
  showToast("กรุณาติดต่อผู้ดูแลระบบ (ADMIN) เพื่อขอรับรหัสผ่านใหม่", "error");
});

// ---------- 5.6 ทางลัดแบบฟอร์ม: อัปเดตสถานะเมื่อเปลี่ยนตัวเลือก ----------
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

// ---------- 5.7 Auto-Prefix ใบลา ----------
docTypeSelect?.addEventListener('change', (e) => {
  // ตรวจจับว่ามีคำว่า "ใบลา" อยู่ในตัวเลือกที่เลือกหรือไม่
  if (e.target.value.includes('ใบลา')) {
    docNameInput.value = '[ใบลา] ขอลาป่วย/ลากิจ - ';
    docNameInput.focus(); // เด้งเคอร์เซอร์ไปรอให้พิมพ์ต่อทันที
  }
});


/* =====================================================================
 * [โซน 6] ระบบบันทึก ลบ และโหลดเอกสาร (Save, Download, Delete, File Validation)
 * ===================================================================== */

// ---------- 6.1 ตรวจสอบขนาดไฟล์ (จำกัด 20MB) ----------
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

// ---------- 6.2 ปุ่มบันทึกเอกสาร (หน้าแรก) ----------
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

  // ป้ายระดับความสำคัญของเอกสาร
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

  // ถ้ามีการแนบไฟล์จริง ให้สร้างการ์ดไฟล์พร้อมปุ่ม [โหลด] และ [ลบ] ส่งเข้าคลังเอกสาร
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
  logCount.textContent = totalCount + "รายการ";

  docNameInput.value = "";
  docFilesInput.value = "";
  showToast("บันทึกเอกสารเรียบร้อยแล้ว!", "success");

  targetDeptSelect.value = "INTERNAL";
});

// ---------- 6.3 ปุ่มล้างประวัติทั้งหมด ----------
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

// ---------- 6.4 ปุ่มดาวน์โหลด (Virtual Anchor) + ปุ่มลบในคลังเอกสาร ----------
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
