const STORAGE_KEY = "shiningPinkPortfolioPreviewV2";
const THEME_KEY = "shiningPinkPortfolioTheme";

const defaultData = {
  name: "Your Name",
  role: "Software Engineering Student",
  tagline: "Dreaming in pixels, building with purpose ✦",
  intro: "I am a BS Software Engineering student who loves turning creative ideas into thoughtful digital experiences. I enjoy designing friendly interfaces and building useful mobile and web applications.",
  ambition: "My ambition is to become a skilled software engineer, create technology that makes everyday life easier, and keep learning with curiosity, courage, and consistency.",
  degree: "BS Software Engineering",
  university: "Your University Name",
  city: "Your City, Pakistan",
  nationality: "Pakistan",
  email: "your.email@example.com",
  phone: "+92 300 0000000",
  linkedin: "linkedin.com/in/your-profile",
  github: "github.com/your-username",
  photo: "",
  skills: [
    { icon: "✦", name: "Flutter", detail: "Mobile development", level: 85 },
    { icon: "♡", name: "MERN Stack", detail: "Full-stack web development", level: 78 },
    { icon: "⌘", name: "JavaScript", detail: "Interactive experiences", level: 75 },
    { icon: "◌", name: "UI Design", detail: "Responsive interfaces", level: 80 }
  ],
  projects: [
    { title: "ArtSphere App", type: "Creative Community App", description: "A friendly mobile space where artists can share their work, discover inspiration, and connect with a creative community.", tech: "Flutter, Dart, Firebase", image: "", liveUrl: "", githubUrl: "" },
    { title: "Dentist Web Application", type: "Healthcare Web Platform", description: "A responsive appointment experience that helps patients explore services, view dentist information, and request a visit online.", tech: "MongoDB, Express, React, Node.js", image: "", liveUrl: "", githubUrl: "" }
  ]
};

const $ = (id) => document.getElementById(id);
const clone = (value) => JSON.parse(JSON.stringify(value));
let data = loadLocalData();
let currentUser = null;

const config = window.PORTFOLIO_CONFIG || {};
const configured = Boolean(config.supabaseUrl && config.supabaseAnonKey && !config.supabaseUrl.includes("YOUR_") && !config.supabaseAnonKey.includes("YOUR_") && window.supabase);
const db = configured ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey) : null;

function loadLocalData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === "object" ? { ...clone(defaultData), ...saved } : clone(defaultData);
  } catch { return clone(defaultData); }
}

function saveLocalData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* online save still works */ }
}

function safeUrl(value) {
  if (!value) return "#";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function render() {
  $("displayName").textContent = data.name;
  $("displayRole").textContent = data.role;
  $("displayTagline").textContent = data.tagline;
  $("displayIntro").textContent = data.intro;
  $("displayAmbition").textContent = data.ambition;
  $("displayDegree").textContent = data.degree;
  $("displayUniversity").textContent = data.university;
  $("displayCity").textContent = data.city;
  $("displayNationality").textContent = data.nationality;
  $("displayEmail").textContent = data.email;
  $("displayPhone").textContent = data.phone;
  $("displayLinkedin").textContent = data.linkedin;
  $("displayGithub").textContent = data.github;
  $("emailLink").href = `mailto:${data.email}`;
  $("linkedinLink").href = safeUrl(data.linkedin);
  $("githubLink").href = safeUrl(data.github);
  const whatsapp = getWhatsappUrl();
  $("whatsappLink").href = whatsapp;
  $("cvWhatsappLink").href = whatsapp;
  $("displayWhatsapp").textContent = data.phone || "Add your number";
  $("whatsappLink").classList.toggle("disabled", whatsapp === "#");
  $("cvWhatsappLink").classList.toggle("disabled", whatsapp === "#");
  document.title = `${data.name} | Portfolio`;
  $("portrait").innerHTML = data.photo
    ? `<img src="${escapeAttribute(data.photo)}" alt="${escapeAttribute(data.name)} profile photo">`
    : '<div class="photo-placeholder"><b>♡</b><strong>Add your photo</strong><small>from Edit Portfolio</small></div>';
  renderSkills();
  renderProjects();
  applyTheme();
}

function renderSkills() {
  const grid = $("skillGrid"); grid.replaceChildren();
  data.skills.forEach((skill, index) => {
    const card = document.createElement("article"); card.className = "skill-card";
    const icon = document.createElement("b"); icon.textContent = skill.icon || "✦";
    const title = document.createElement("h3"); title.textContent = skill.name;
    const detail = document.createElement("p"); detail.textContent = skill.detail;
    const number = document.createElement("i"); number.textContent = String(index + 1).padStart(2, "0");
    const level = document.createElement("div"); level.className = "skill-level";
    const bar = document.createElement("span"); bar.style.width = `${Math.min(100, Math.max(0, Number(skill.level) || 0))}%`;
    level.append(bar); card.append(icon, title, detail, level, number); grid.append(card);
  });
}

function renderProjects() {
  const list = $("projectList"); list.replaceChildren();
  data.projects.forEach((project) => {
    const card = document.createElement("article"); card.className = "project-card";
    const visual = document.createElement("div"); visual.className = "project-image";
    if (project.image) {
      const image = document.createElement("img"); image.src = project.image; image.alt = project.title; visual.append(image);
    } else {
      const mock = document.createElement("div"); mock.className = "mock";
      mock.innerHTML = `<b>✦</b><strong>${escapeHtml(project.title.split(" ")[0] || "Project")}</strong><small>project preview</small>`;
      visual.append(mock);
    }
    const copy = document.createElement("div"); copy.className = "project-copy";
    const type = document.createElement("small"); type.textContent = project.type.toUpperCase();
    const title = document.createElement("h3"); title.textContent = project.title;
    const description = document.createElement("p"); description.textContent = project.description;
    const tags = document.createElement("div"); tags.className = "tags";
    project.tech.split(",").map((item) => item.trim()).filter(Boolean).forEach((item) => { const tag = document.createElement("span"); tag.textContent = item; tags.append(tag); });
    const links = document.createElement("div"); links.className = "project-links";
    if (project.liveUrl) links.append(makeLink(project.liveUrl, "Live demo ↗"));
    if (project.githubUrl) links.append(makeLink(project.githubUrl, "GitHub ↗"));
    copy.append(type, title, description, tags, links); card.append(visual, copy); list.append(card);
  });
}

function makeLink(url, label) {
  const link = document.createElement("a"); link.href = safeUrl(url); link.target = "_blank"; link.rel = "noreferrer"; link.textContent = label; return link;
}

function getWhatsappUrl() {
  let digits = String(data.phone || "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `92${digits.slice(1)}`;
  if (digits.length < 10) return "#";
  const message = encodeURIComponent(`Hello ${data.name}, I visited your portfolio and would like to connect with you.`);
  return `https://wa.me/${digits}?text=${message}`;
}

function pdfText(value = "") {
  return String(value).replace(/[^\x20-\x7E\xA0-\xFF]/g, "").trim();
}

function downloadCvPdf() {
  if (!window.jspdf?.jsPDF) {
    alert("PDF generator could not load. Check your internet connection and try again.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 52;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  function drawHeader() {
    doc.setFillColor(244, 75, 168);
    doc.rect(0, 0, pageWidth, 142, "F");
    doc.setFillColor(112, 91, 220);
    doc.rect(pageWidth - 118, 0, 118, 142, "F");
    doc.setFillColor(50, 196, 211);
    doc.circle(pageWidth - 32, 28, 55, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.text(pdfText(data.name) || "Your Name", margin, 51);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text(pdfText(data.role), margin, 76);
    doc.setFontSize(9.5);
    const contact = [data.email, data.phone, data.city].map(pdfText).filter(Boolean).join("  |  ");
    doc.text(contact, margin, 109, { maxWidth: pageWidth - margin * 2 - 45 });
    y = 177;
  }

  function ensureSpace(height = 70) {
    if (y + height <= pageHeight - 55) return;
    doc.addPage();
    doc.setFillColor(247, 83, 169);
    doc.rect(0, 0, 10, pageHeight, "F");
    y = 55;
  }

  function sectionTitle(title) {
    ensureSpace(55);
    doc.setFillColor(255, 232, 246);
    doc.roundedRect(margin, y - 16, contentWidth, 28, 8, 8, "F");
    doc.setTextColor(178, 48, 116);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title.toUpperCase(), margin + 12, y + 2);
    y += 34;
  }

  function paragraph(text, options = {}) {
    const clean = pdfText(text);
    if (!clean) return;
    doc.setTextColor(...(options.color || [75, 57, 71]));
    doc.setFont("helvetica", options.bold ? "bold" : "normal");
    doc.setFontSize(options.size || 10.5);
    const lines = doc.splitTextToSize(clean, options.width || contentWidth);
    ensureSpace(lines.length * 15 + 10);
    doc.text(lines, options.x || margin, y, { lineHeightFactor: 1.35 });
    y += lines.length * 14.5 + (options.after ?? 10);
  }

  drawHeader();
  sectionTitle("Professional Profile");
  paragraph(data.intro);
  paragraph(data.ambition, { color: [116, 77, 108] });

  sectionTitle("Education");
  paragraph(data.degree, { bold: true, size: 12, after: 4 });
  paragraph([data.university, data.city].map(pdfText).filter(Boolean).join(" · "), { color: [126, 99, 120] });

  sectionTitle("Technical Skills");
  data.skills.forEach((skill) => {
    const level = Number(skill.level) || 0;
    paragraph(`${skill.name} — ${skill.detail} (${level}%)`, { bold: true, after: 5 });
  });

  sectionTitle("Selected Projects");
  data.projects.forEach((project, index) => {
    ensureSpace(85);
    paragraph(`${index + 1}. ${project.title}`, { bold: true, size: 12, color: [184, 49, 118], after: 3 });
    paragraph(`${project.type} | ${project.tech}`, { bold: true, size: 9.5, color: [109, 83, 103], after: 4 });
    paragraph(project.description, { after: 12 });
  });

  sectionTitle("Contact");
  paragraph(`Email: ${data.email}\nPhone: ${data.phone}\nLinkedIn: ${data.linkedin}\nGitHub: ${data.github}`, { after: 5 });

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setDrawColor(238, 203, 225);
    doc.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);
    doc.setTextColor(150, 111, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Generated from ${pdfText(data.name)}'s portfolio`, margin, pageHeight - 19);
    doc.text(`Page ${page} of ${pages}`, pageWidth - margin, pageHeight - 19, { align: "right" });
  }

  const fileName = (pdfText(data.name) || "portfolio").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  doc.save(`${fileName || "portfolio"}-cv.pdf`);
}

function applyTheme() {
  const theme = localStorage.getItem(THEME_KEY) || "light";
  document.body.classList.toggle("dark", theme === "dark");
  $("themeToggle").textContent = theme === "dark" ? "☀" : "☾";
}

function createStars() {
  const field = $("stars");
  for (let i = 0; i < 52; i++) {
    const star = document.createElement("i");
    const size = 4 + (i % 5) * 2;
    star.style.cssText = `left:${(i * 37) % 99}%;top:${(i * 53) % 96}%;width:${size}px;height:${size}px;animation-delay:${(i % 11) * -.37}s;animation-duration:${4 + (i % 6)}s`;
    field.append(star);
  }
}

async function loadOnlineData() {
  if (!db) return;
  const { data: row, error } = await db.from("portfolio_content").select("content").eq("id", 1).maybeSingle();
  if (error) { console.warn("Portfolio could not be loaded", error.message); return; }
  if (row?.content && Object.keys(row.content).length) {
    data = { ...clone(defaultData), ...row.content };
    saveLocalData(); render();
  }
}

function openEditor() {
  $("editorBackdrop").classList.add("open");
  document.body.style.overflow = "hidden";
  $("setupWarning").hidden = configured;
  checkAdminSession();
}

function closeEditor() {
  $("editorBackdrop").classList.remove("open");
  document.body.style.overflow = "";
}

async function checkAdminSession() {
  showAuth();
  if (!db) return setAuthMessage("Connect Supabase first using SETUP-GUIDE.txt.");
  const { data: sessionData } = await db.auth.getSession();
  if (sessionData.session?.user) await authorizeAdmin(sessionData.session.user);
}

async function authorizeAdmin(user) {
  currentUser = user;
  setAuthMessage("Checking admin access…");
  const { data: admin, error } = await db.from("admins").select("email").eq("email", user.email).maybeSingle();
  if (error || !admin) return setAuthMessage("This account is not listed as an admin.");
  $("authGate").hidden = true;
  $("editorContent").hidden = false;
  $("adminIdentity").textContent = `Signed in as ${user.email}`;
  fillEditor();
}

function showAuth() {
  $("authGate").hidden = false;
  $("editorContent").hidden = true;
  setAuthMessage("");
}

function setAuthMessage(message) { $("authMessage").textContent = message; }
function setSaveMessage(message) { $("saveMessage").textContent = message; }

async function login() {
  if (!db) return setAuthMessage("Supabase is not connected yet.");
  const email = $("loginEmail").value.trim();
  const password = $("loginPassword").value;
  if (!email || !password) return setAuthMessage("Enter your email and password.");
  setAuthMessage("Logging in…");
  const { data: result, error } = await db.auth.signInWithPassword({ email, password });
  if (error) return setAuthMessage(error.message);
  await authorizeAdmin(result.user);
}

async function signup() {
  if (!db) return setAuthMessage("Supabase is not connected yet.");
  const email = $("loginEmail").value.trim();
  const password = $("loginPassword").value;
  if (!email || password.length < 6) return setAuthMessage("Use a valid email and a password of at least 6 characters.");
  setAuthMessage("Creating account…");
  const { data: result, error } = await db.auth.signUp({ email, password });
  if (error) return setAuthMessage(error.message);
  if (result.session) await authorizeAdmin(result.user);
  else setAuthMessage("Account created. Confirm the email, then log in.");
}

async function logout() {
  if (db) await db.auth.signOut();
  currentUser = null; showAuth(); setAuthMessage("Logged out successfully.");
}

function fillEditor() {
  $("nameInput").value = data.name; $("roleInput").value = data.role; $("taglineInput").value = data.tagline;
  $("introInput").value = data.intro; $("ambitionInput").value = data.ambition; $("degreeInput").value = data.degree;
  $("universityInput").value = data.university; $("cityInput").value = data.city; $("nationalityInput").value = data.nationality;
  $("emailInput").value = data.email; $("phoneInput").value = data.phone; $("linkedinInput").value = data.linkedin; $("githubInput").value = data.github;
  $("editorPhoto").innerHTML = data.photo ? `<img src="${escapeAttribute(data.photo)}" alt="Profile preview">` : "♡";
  renderSkillEditor(); renderProjectEditor();
}

function renderSkillEditor() {
  const box = $("skillEditor"); box.replaceChildren();
  data.skills.forEach((skill, index) => {
    const row = document.createElement("div"); row.className = "skill-edit";
    row.innerHTML = `<label>Icon<input value="${escapeAttribute(skill.icon)}" data-skill="${index}" data-field="icon"></label><label>Name<input value="${escapeAttribute(skill.name)}" data-skill="${index}" data-field="name"></label><label>Description<input value="${escapeAttribute(skill.detail)}" data-skill="${index}" data-field="detail"></label><label>Level %<input type="number" min="0" max="100" value="${Number(skill.level) || 0}" data-skill="${index}" data-field="level"></label><button type="button" data-remove-skill="${index}">Remove</button>`;
    box.append(row);
  });
}

function renderProjectEditor() {
  const box = $("projectEditor"); box.replaceChildren();
  data.projects.forEach((project, index) => {
    const row = document.createElement("article"); row.className = "project-edit";
    row.innerHTML = `<div class="project-photo">${project.image ? `<img src="${escapeAttribute(project.image)}" alt="Project preview">` : "<span>✦ No image</span>"}<label>Upload image<input type="file" accept="image/*" data-project-image="${index}"></label></div><div class="project-fields"><label>Title<input value="${escapeAttribute(project.title)}" data-project="${index}" data-field="title"></label><label>Type<input value="${escapeAttribute(project.type)}" data-project="${index}" data-field="type"></label><label>Description<textarea rows="3" data-project="${index}" data-field="description">${escapeHtml(project.description)}</textarea></label><label>Technologies<input value="${escapeAttribute(project.tech)}" data-project="${index}" data-field="tech"></label><label>Live demo URL<input value="${escapeAttribute(project.liveUrl || "")}" data-project="${index}" data-field="liveUrl"></label><label>GitHub URL<input value="${escapeAttribute(project.githubUrl || "")}" data-project="${index}" data-field="githubUrl"></label></div><button class="delete" type="button" data-remove-project="${index}">Remove</button>`;
    box.append(row);
  });
}

function escapeAttribute(value = "") { return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;"); }
function escapeHtml(value = "") { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }

async function uploadImage(file, label) {
  if (!file?.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be smaller than 5 MB.");
  if (!db || !currentUser) throw new Error("Please log in first.");
  const extension = (file.name.split(".").pop() || "jpg").replace(/[^a-z0-9]/gi, "").toLowerCase();
  const path = `${currentUser.id}/${label}-${Date.now()}.${extension}`;
  const { error } = await db.storage.from("portfolio-images").upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return db.storage.from("portfolio-images").getPublicUrl(path).data.publicUrl;
}

async function savePortfolio(event) {
  event.preventDefault();
  Object.assign(data, {
    name: $("nameInput").value.trim(), role: $("roleInput").value.trim(), tagline: $("taglineInput").value.trim(),
    intro: $("introInput").value.trim(), ambition: $("ambitionInput").value.trim(), degree: $("degreeInput").value.trim(),
    university: $("universityInput").value.trim(), city: $("cityInput").value.trim(), nationality: $("nationalityInput").value.trim(),
    email: $("emailInput").value.trim(), phone: $("phoneInput").value.trim(), linkedin: $("linkedinInput").value.trim(), github: $("githubInput").value.trim()
  });
  if (!db || !currentUser) return setSaveMessage("Please log in before saving.");
  setSaveMessage("Saving online…");
  const { error } = await db.from("portfolio_content").upsert({ id: 1, content: data, updated_at: new Date().toISOString() });
  if (error) return setSaveMessage(`Save failed: ${error.message}`);
  saveLocalData(); render(); setSaveMessage("Saved permanently ✦");
  setTimeout(closeEditor, 700);
}

$("openEditor").addEventListener("click", openEditor);
$("closeEditor").addEventListener("click", closeEditor);
$("editorBackdrop").addEventListener("click", (event) => { if (event.target === $("editorBackdrop")) closeEditor(); });
$("loginButton").addEventListener("click", login);
$("signupButton").addEventListener("click", signup);
$("logoutButton").addEventListener("click", logout);

$("editorTabs").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-tab]"); if (!button) return;
  document.querySelectorAll(".editor-tabs button").forEach((item) => item.classList.toggle("active", item === button));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === button.dataset.tab));
});

$("profileImageInput").addEventListener("change", async (event) => {
  try { setSaveMessage("Uploading profile image…"); data.photo = await uploadImage(event.target.files[0], "profile"); $("editorPhoto").innerHTML = `<img src="${escapeAttribute(data.photo)}" alt="Profile preview">`; setSaveMessage("Image uploaded. Click Save Changes."); }
  catch (error) { setSaveMessage(error.message); }
});
$("removePhoto").addEventListener("click", () => { data.photo = ""; $("editorPhoto").textContent = "♡"; });
$("addSkill").addEventListener("click", () => { data.skills.push({ icon: "✦", name: "New skill", detail: "What you use it for", level: 70 }); renderSkillEditor(); });
$("addProject").addEventListener("click", () => { data.projects.push({ title: "New Project", type: "Project Type", description: "Describe your project here.", tech: "HTML, CSS, JavaScript", image: "", liveUrl: "", githubUrl: "" }); renderProjectEditor(); });
$("skillEditor").addEventListener("input", (event) => { const index = event.target.dataset.skill; if (index !== undefined) data.skills[Number(index)][event.target.dataset.field] = event.target.dataset.field === "level" ? Number(event.target.value) : event.target.value; });
$("skillEditor").addEventListener("click", (event) => { const index = event.target.dataset.removeSkill; if (index !== undefined) { data.skills.splice(Number(index), 1); renderSkillEditor(); } });
$("projectEditor").addEventListener("input", (event) => { const index = event.target.dataset.project; if (index !== undefined) data.projects[Number(index)][event.target.dataset.field] = event.target.value; });
$("projectEditor").addEventListener("change", async (event) => {
  const index = event.target.dataset.projectImage; if (index === undefined) return;
  try { setSaveMessage("Uploading project image…"); data.projects[Number(index)].image = await uploadImage(event.target.files[0], `project-${index}`); renderProjectEditor(); setSaveMessage("Image uploaded. Click Save Changes."); }
  catch (error) { setSaveMessage(error.message); }
});
$("projectEditor").addEventListener("click", (event) => { const index = event.target.dataset.removeProject; if (index !== undefined) { data.projects.splice(Number(index), 1); renderProjectEditor(); } });

$("portfolioForm").addEventListener("submit", savePortfolio);
$("downloadCv").addEventListener("click", downloadCvPdf);
$("resetData").addEventListener("click", () => { if (!confirm("Restore the demo content? Save Changes will publish it.")) return; data = clone(defaultData); fillEditor(); render(); setSaveMessage("Demo content restored. Click Save Changes."); });
$("themeToggle").addEventListener("click", () => { const next = document.body.classList.contains("dark") ? "light" : "dark"; localStorage.setItem(THEME_KEY, next); applyTheme(); });
$("exportData").addEventListener("click", () => {
  const file = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a"); link.href = URL.createObjectURL(file); link.download = "portfolio-backup.json"; link.click(); URL.revokeObjectURL(link.href); setSaveMessage("Backup downloaded.");
});
$("importData").addEventListener("change", (event) => {
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader(); reader.onload = () => {
    try { const imported = JSON.parse(reader.result); if (!imported.name || !Array.isArray(imported.skills) || !Array.isArray(imported.projects)) throw new Error(); data = { ...clone(defaultData), ...imported }; fillEditor(); render(); setSaveMessage("Backup loaded. Click Save Changes to publish it."); }
    catch { setSaveMessage("This backup file is not valid."); }
  }; reader.readAsText(file);
});

$("menuBtn").addEventListener("click", () => $("navMenu").classList.toggle("open"));
document.querySelectorAll("#navMenu a").forEach((link) => link.addEventListener("click", () => $("navMenu").classList.remove("open")));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeEditor(); });
$("backTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  $("scrollProgress").style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  $("backTop").classList.toggle("show", window.scrollY > 600);
});

createStars();
render();
loadOnlineData();
