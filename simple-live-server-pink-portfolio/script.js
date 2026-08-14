const STORAGE_KEY = "shiningPinkPortfolioDataV1";

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
    { icon: "✦", name: "Flutter", detail: "Mobile development" },
    { icon: "♡", name: "React", detail: "Frontend interfaces" },
    { icon: "⌘", name: "Node.js", detail: "Backend development" },
    { icon: "◌", name: "MongoDB", detail: "Database design" }
  ],
  projects: [
    { title: "ArtSphere App", type: "Creative Community App", description: "A friendly mobile space where artists can share their work, discover inspiration, and connect with a creative community.", tech: "Flutter, Dart, Firebase", image: "" },
    { title: "Dentist Web Application", type: "Healthcare Web Platform", description: "A responsive appointment experience that helps patients explore services, view dentist information, and request a visit online.", tech: "MongoDB, Express, React, Node.js", image: "" }
  ]
};

let data = loadData();
const $ = (id) => document.getElementById(id);

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === "object" ? { ...structuredClone(defaultData), ...saved } : structuredClone(defaultData);
  } catch {
    return structuredClone(defaultData);
  }
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
  document.title = `${data.name} | Portfolio`;

  $("portrait").innerHTML = data.photo
    ? `<img src="${data.photo}" alt="Profile photo">`
    : '<div class="photo-placeholder"><b>♡</b><strong>Add your photo</strong><small>from Edit Portfolio</small></div>';

  renderSkills();
  renderProjects();
}

function renderSkills() {
  const grid = $("skillGrid");
  grid.replaceChildren();
  data.skills.forEach((skill, index) => {
    const card = document.createElement("article");
    card.className = "skill-card";
    const icon = document.createElement("b"); icon.textContent = skill.icon || "✦";
    const title = document.createElement("h3"); title.textContent = skill.name;
    const detail = document.createElement("p"); detail.textContent = skill.detail;
    const number = document.createElement("i"); number.textContent = String(index + 1).padStart(2, "0");
    card.append(icon, title, detail, number); grid.append(card);
  });
}

function renderProjects() {
  const list = $("projectList");
  list.replaceChildren();
  data.projects.forEach((project) => {
    const card = document.createElement("article"); card.className = "project-card";
    const visual = document.createElement("div"); visual.className = "project-image";
    if (project.image) {
      const image = document.createElement("img"); image.src = project.image; image.alt = project.title; visual.append(image);
    } else {
      const mock = document.createElement("div"); mock.className = "mock";
      const star = document.createElement("b"); star.textContent = "✦";
      const name = document.createElement("strong"); name.textContent = project.title.split(" ")[0] || "Project";
      const small = document.createElement("small"); small.textContent = "project preview";
      mock.append(star, name, small); visual.append(mock);
    }
    const copy = document.createElement("div"); copy.className = "project-copy";
    const type = document.createElement("small"); type.textContent = project.type.toUpperCase();
    const title = document.createElement("h3"); title.textContent = project.title;
    const description = document.createElement("p"); description.textContent = project.description;
    const tags = document.createElement("div"); tags.className = "tags";
    project.tech.split(",").map((item) => item.trim()).filter(Boolean).forEach((item) => { const tag = document.createElement("span"); tag.textContent = item; tags.append(tag); });
    copy.append(type, title, description, tags); card.append(visual, copy); list.append(card);
  });
}

function createStars() {
  const field = $("stars");
  for (let i = 0; i < 38; i++) {
    const star = document.createElement("i");
    const size = 5 + (i % 4) * 3;
    star.style.cssText = `left:${(i * 37) % 97}%;top:${(i * 53) % 94}%;width:${size}px;height:${size}px;animation-delay:${(i % 9) * -.42}s`;
    field.append(star);
  }
}

function fillEditor() {
  $("nameInput").value = data.name; $("roleInput").value = data.role; $("taglineInput").value = data.tagline;
  $("introInput").value = data.intro; $("ambitionInput").value = data.ambition; $("degreeInput").value = data.degree;
  $("universityInput").value = data.university; $("cityInput").value = data.city; $("nationalityInput").value = data.nationality;
  $("emailInput").value = data.email; $("phoneInput").value = data.phone; $("linkedinInput").value = data.linkedin; $("githubInput").value = data.github;
  $("editorPhoto").innerHTML = data.photo ? `<img src="${data.photo}" alt="Profile preview">` : "♡";
  renderSkillEditor(); renderProjectEditor();
}

function renderSkillEditor() {
  const box = $("skillEditor"); box.replaceChildren();
  data.skills.forEach((skill, index) => {
    const row = document.createElement("div"); row.className = "skill-edit";
    row.innerHTML = `<label>Icon<input value="${escapeAttribute(skill.icon)}" data-skill="${index}" data-field="icon"></label><label>Name<input value="${escapeAttribute(skill.name)}" data-skill="${index}" data-field="name"></label><label>Description<input value="${escapeAttribute(skill.detail)}" data-skill="${index}" data-field="detail"></label><button type="button" data-remove-skill="${index}">Remove</button>`;
    box.append(row);
  });
}

function renderProjectEditor() {
  const box = $("projectEditor"); box.replaceChildren();
  data.projects.forEach((project, index) => {
    const row = document.createElement("article"); row.className = "project-edit";
    row.innerHTML = `<div class="project-photo">${project.image ? `<img src="${project.image}" alt="Project preview">` : "<span>✦ No image</span>"}<label>Upload image<input type="file" accept="image/*" data-project-image="${index}"></label></div><div class="project-fields"><label>Title<input value="${escapeAttribute(project.title)}" data-project="${index}" data-field="title"></label><label>Type<input value="${escapeAttribute(project.type)}" data-project="${index}" data-field="type"></label><label>Description<textarea rows="3" data-project="${index}" data-field="description">${escapeHtml(project.description)}</textarea></label><label>Technologies<input value="${escapeAttribute(project.tech)}" data-project="${index}" data-field="tech"></label></div><button class="delete" type="button" data-remove-project="${index}">Remove</button>`;
    box.append(row);
  });
}

function escapeAttribute(value = "") { return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;"); }
function escapeHtml(value = "") { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }

function readImage(file, callback) {
  if (!file || !file.type.startsWith("image/")) return;
  if (file.size > 2.5 * 1024 * 1024) { $("saveMessage").textContent = "Please choose an image smaller than 2.5 MB."; return; }
  const reader = new FileReader(); reader.onload = () => callback(reader.result); reader.readAsDataURL(file);
}

$("openEditor").addEventListener("click", () => { fillEditor(); $("editorBackdrop").classList.add("open"); document.body.style.overflow = "hidden"; });
$("closeEditor").addEventListener("click", closeEditor);
$("editorBackdrop").addEventListener("click", (event) => { if (event.target === $("editorBackdrop")) closeEditor(); });
function closeEditor() { $("editorBackdrop").classList.remove("open"); document.body.style.overflow = ""; }

$("editorTabs").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-tab]"); if (!button) return;
  document.querySelectorAll(".editor-tabs button").forEach((item) => item.classList.toggle("active", item === button));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === button.dataset.tab));
});

$("profileImageInput").addEventListener("change", (event) => readImage(event.target.files[0], (result) => { data.photo = result; $("editorPhoto").innerHTML = `<img src="${result}" alt="Profile preview">`; }));
$("removePhoto").addEventListener("click", () => { data.photo = ""; $("editorPhoto").textContent = "♡"; });
$("addSkill").addEventListener("click", () => { data.skills.push({ icon: "✦", name: "New skill", detail: "What you use it for" }); renderSkillEditor(); });
$("addProject").addEventListener("click", () => { data.projects.push({ title: "New Project", type: "Project Type", description: "Describe your project here.", tech: "HTML, CSS, JavaScript", image: "" }); renderProjectEditor(); });

$("skillEditor").addEventListener("input", (event) => { const index = event.target.dataset.skill; if (index !== undefined) data.skills[Number(index)][event.target.dataset.field] = event.target.value; });
$("skillEditor").addEventListener("click", (event) => { const index = event.target.dataset.removeSkill; if (index !== undefined) { data.skills.splice(Number(index), 1); renderSkillEditor(); } });
$("projectEditor").addEventListener("input", (event) => { const index = event.target.dataset.project; if (index !== undefined) data.projects[Number(index)][event.target.dataset.field] = event.target.value; });
$("projectEditor").addEventListener("change", (event) => { const index = event.target.dataset.projectImage; if (index !== undefined) readImage(event.target.files[0], (result) => { data.projects[Number(index)].image = result; renderProjectEditor(); }); });
$("projectEditor").addEventListener("click", (event) => { const index = event.target.dataset.removeProject; if (index !== undefined) { data.projects.splice(Number(index), 1); renderProjectEditor(); } });

$("portfolioForm").addEventListener("submit", (event) => {
  event.preventDefault();
  Object.assign(data, { name: $("nameInput").value.trim(), role: $("roleInput").value.trim(), tagline: $("taglineInput").value.trim(), intro: $("introInput").value.trim(), ambition: $("ambitionInput").value.trim(), degree: $("degreeInput").value.trim(), university: $("universityInput").value.trim(), city: $("cityInput").value.trim(), nationality: $("nationalityInput").value.trim(), email: $("emailInput").value.trim(), phone: $("phoneInput").value.trim(), linkedin: $("linkedinInput").value.trim(), github: $("githubInput").value.trim() });
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); $("saveMessage").textContent = "Saved successfully ✦"; render(); setTimeout(closeEditor, 650); }
  catch { $("saveMessage").textContent = "Storage is full. Try smaller images."; }
});

$("resetData").addEventListener("click", () => { if (!confirm("Reset all portfolio details and images?")) return; localStorage.removeItem(STORAGE_KEY); data = structuredClone(defaultData); fillEditor(); render(); $("saveMessage").textContent = "Demo data restored."; });
$("menuBtn").addEventListener("click", () => $("navMenu").classList.toggle("open"));
document.querySelectorAll("#navMenu a").forEach((link) => link.addEventListener("click", () => $("navMenu").classList.remove("open")));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeEditor(); });

createStars();
render();
