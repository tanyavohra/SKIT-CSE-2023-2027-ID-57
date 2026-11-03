export const EXPERIENCE_LEVELS = ["Junior", "Pre-Final Year", "Final Year", "Placement Ready"];
export const JOB_PREFERENCES = ["Full-time", "Internship", "Both"];
export const ALUMNI_TYPES = ["Placed", "Higher Studies", "Entrepreneur"];

const field = (key, label, type, extra = {}) => ({ key, label, type, ...extra });

const BASIC = "Basic info";
const SKILLS = "Skills & interests";
const PROJECTS = "Projects";
const LINKS = "Links";
const MORE = "More details (optional)";

/* ------------------------------ Students ------------------------------ */

const STUDENT_FIELDS = [
  field("fullName", "Full name", "text", { required: true, group: BASIC, placeholder: "Jane Doe" }),
  field("bio", "About", "textarea", {
    group: BASIC,
    maxLength: 1000,
    placeholder: "A short introduction about you…",
  }),
  field("college", "College", "text", { group: BASIC, placeholder: "e.g. SKIT, Jaipur" }),
  field("branch", "Branch", "text", { required: true, group: BASIC, placeholder: "Computer Science" }),
  field("graduationYear", "Graduation year", "number", {
    required: true,
    group: BASIC,
    min: 1990,
    max: 2100,
    placeholder: "2027",
  }),
  field("experienceLevel", "Experience level", "select", {
    required: true,
    group: BASIC,
    options: EXPERIENCE_LEVELS,
  }),
  field("jobPreference", "Job preference", "select", {
    required: true,
    group: BASIC,
    options: JOB_PREFERENCES,
  }),
  field("location", "Preferred work location", "text", {
    required: true,
    group: BASIC,
    placeholder: "Delhi NCR",
  }),

  field("skills", "Skills", "tags", {
    required: true,
    group: SKILLS,
    placeholder: "Type a skill and press Enter (e.g. Python)",
  }),
  field("interests", "Interests", "tags", {
    required: true,
    group: SKILLS,
    placeholder: "Type an interest and press Enter (e.g. AI/ML)",
  }),

  field("projects", "Projects", "projects", { group: PROJECTS }),

  field("resumeUrl", "Resume link", "url", { group: LINKS, placeholder: "https://…" }),

  field("cgpa", "CGPA", "number", { optional: true, group: MORE, min: 0, max: 10, step: "0.01", placeholder: "8.7" }),
  field("backlogCount", "Backlogs", "number", { optional: true, group: MORE, min: 0, placeholder: "0" }),
  field("certifications", "Certifications", "tags", {
    optional: true,
    group: MORE,
    placeholder: "Type a certification and press Enter",
  }),
  field("achievements", "Achievements", "tags", {
    optional: true,
    group: MORE,
    placeholder: "Type an award or recognition and press Enter",
  }),
  field("extraCurricular", "Extra-curricular", "tags", {
    optional: true,
    group: MORE,
    placeholder: "Clubs, sports, leadership roles…",
  }),
];

/* ------------------------------- Alumni ------------------------------- */

const ALUMNI_FIELDS = [
  field("fullName", "Full name", "text", { required: true, group: BASIC, placeholder: "Rahul Sharma" }),
  field("bio", "About", "textarea", {
    group: BASIC,
    maxLength: 1000,
    placeholder: "A short introduction about you…",
  }),
  field("college", "College", "text", { group: BASIC, placeholder: "e.g. SKIT, Jaipur" }),
  field("branch", "Branch", "text", { required: true, group: BASIC, placeholder: "Computer Science" }),
  field("graduationYear", "Batch year", "number", {
    required: true,
    group: BASIC,
    min: 1960,
    max: 2100,
    placeholder: "2023",
  }),
  field("currentCompany", "Current company", "text", { required: true, group: BASIC, placeholder: "Google" }),
  field("currentRole", "Current role", "text", {
    required: true,
    group: BASIC,
    placeholder: "Software Engineer",
  }),
  field("careerDomain", "Career domain", "text", {
    required: true,
    group: BASIC,
    placeholder: "Cloud Infrastructure & AI",
  }),
  field("location", "Current location", "text", { required: true, group: BASIC, placeholder: "Bangalore" }),
  field("alumniType", "Alumni type", "select", { required: true, group: BASIC, options: ALUMNI_TYPES }),

  field("skills", "Skills", "tags", {
    required: true,
    group: SKILLS,
    placeholder: "Type a skill and press Enter (e.g. Kubernetes)",
  }),
  field("interests", "Areas I can help with", "tags", {
    required: true,
    group: SKILLS,
    placeholder: "e.g. Career Guidance, Interview Prep",
  }),

  field("menteesServed", "Mentees served", "number", {
    required: true,
    group: "Mentoring",
    min: 0,
    placeholder: "0",
  }),
  field("availability", "Open to mentoring & connections", "boolean", {
    group: "Mentoring",
    defaultValue: true,
    trueLabel: "Open to mentoring",
    falseLabel: "Not available right now",
  }),

  field("linkedin", "LinkedIn profile", "url", { group: LINKS, placeholder: "https://linkedin.com/in/…" }),
  field("resumeUrl", "Resume link", "url", { group: LINKS, placeholder: "https://…" }),

  field("yearsOfExperience", "Years of experience", "number", {
    optional: true,
    group: MORE,
    min: 0,
    max: 60,
    placeholder: "3",
  }),
  field("higherEducation", "Higher education", "text", {
    optional: true,
    group: MORE,
    placeholder: "MS in Computer Science, Stanford University",
  }),
  field("previousBranches", "Previous branches (if you switched)", "tags", {
    optional: true,
    group: MORE,
    placeholder: "Type a branch and press Enter",
  }),
  field("foundedStartups", "Founded startups", "tags", {
    optional: true,
    group: MORE,
    placeholder: "Type a company name and press Enter",
  }),
  field("patents", "Patents", "tags", { optional: true, group: MORE, placeholder: "Type a patent and press Enter" }),
  field("publications", "Publications", "tags", {
    optional: true,
    group: MORE,
    placeholder: "Type a paper or article and press Enter",
  }),
  field("awards", "Awards", "tags", { optional: true, group: MORE, placeholder: "Type an award and press Enter" }),
];

export const FIELDS_BY_ROLE = { student: STUDENT_FIELDS, alumni: ALUMNI_FIELDS };

export function getFields(role) {
  return FIELDS_BY_ROLE[role] || STUDENT_FIELDS;
}

export function getFieldMap(role) {
  return Object.fromEntries(getFields(role).map((f) => [f.key, f]));
}

/* --------------------- Sections shown on the profile --------------------- */
// kind: text | facts | chips | list | projects | links

export const SECTIONS_BY_ROLE = {
  student: [
    { id: "about", title: "About", icon: "about", kind: "text", fields: ["bio"] },
    {
      id: "education",
      title: "Education",
      icon: "education",
      kind: "facts",
      fields: ["college", "branch", "graduationYear", "experienceLevel", "cgpa", "backlogCount"],
    },
    { id: "skills", title: "Skills", icon: "skills", kind: "chips", fields: ["skills"] },
    { id: "interests", title: "Interests", icon: "interests", kind: "chips", fields: ["interests"] },
    { id: "projects", title: "Projects", icon: "projects", kind: "projects", fields: ["projects"] },
    {
      id: "certifications",
      title: "Certifications",
      icon: "certifications",
      kind: "list",
      fields: ["certifications"],
    },
    { id: "achievements", title: "Achievements", icon: "achievements", kind: "list", fields: ["achievements"] },
    {
      id: "extraCurricular",
      title: "Extra-curricular",
      icon: "extraCurricular",
      kind: "list",
      fields: ["extraCurricular"],
    },
    {
      id: "career",
      title: "Career preferences",
      icon: "career",
      kind: "facts",
      fields: ["jobPreference", "location"],
    },
    { id: "links", title: "Links", icon: "links", kind: "links", fields: ["resumeUrl"] },
  ],
  alumni: [
    { id: "about", title: "About", icon: "about", kind: "text", fields: ["bio"] },
    {
      id: "experience",
      title: "Experience",
      icon: "career",
      kind: "facts",
      fields: ["currentRole", "currentCompany", "careerDomain", "yearsOfExperience", "alumniType", "location"],
    },
    {
      id: "education",
      title: "Education",
      icon: "education",
      kind: "facts",
      fields: ["college", "branch", "graduationYear", "higherEducation", "previousBranches"],
    },
    { id: "skills", title: "Skills", icon: "skills", kind: "chips", fields: ["skills"] },
    { id: "interests", title: "Can help with", icon: "interests", kind: "chips", fields: ["interests"] },
    {
      id: "mentoring",
      title: "Mentoring",
      icon: "mentoring",
      kind: "facts",
      fields: ["menteesServed", "availability"],
    },
    { id: "startups", title: "Founded startups", icon: "startups", kind: "list", fields: ["foundedStartups"] },
    { id: "patents", title: "Patents", icon: "certifications", kind: "list", fields: ["patents"] },
    { id: "publications", title: "Publications", icon: "publications", kind: "list", fields: ["publications"] },
    { id: "awards", title: "Awards", icon: "achievements", kind: "list", fields: ["awards"] },
    { id: "links", title: "Links", icon: "links", kind: "links", fields: ["linkedin", "resumeUrl"] },
  ],
};

/* ------------------------------- Helpers ------------------------------- */

// 0 and false are real values; only null / undefined / blank / empty arrays are "empty".
export function isEmptyValue(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

export function isHttpUrl(value) {
  return typeof value === "string" && /^https?:\/\/\S+$/i.test(value.trim());
}

export function formatValue(fieldDef, value) {
  if (fieldDef?.type === "boolean") {
    if (value === null || value === undefined) return "";
    return value ? fieldDef.trueLabel || "Yes" : fieldDef.falseLabel || "No";
  }
  if (isEmptyValue(value)) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

export function getInitials(fullName) {
  if (!fullName) return "";
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function getHeadline(role, profile = {}) {
  if (role === "alumni") {
    const { currentRole, currentCompany } = profile;
    if (currentRole && currentCompany) return `${currentRole} at ${currentCompany}`;
    return currentRole || currentCompany || "";
  }
  return [profile.branch, profile.experienceLevel].filter(Boolean).join(" · ");
}

// Backend may return a relative path (e.g. /uploads/abc.png) for uploaded pictures.
export function resolveImageUrl(url) {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  const base = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

/* --------------------- Form <-> profile conversion --------------------- */

export function profileToForm(role, user, profile = {}) {
  const form = {};
  for (const f of getFields(role)) {
    const value = f.key === "fullName" ? user?.fullName : profile?.[f.key];
    switch (f.type) {
      case "tags":
        form[f.key] = Array.isArray(value) ? [...value] : [];
        break;
      case "number":
        form[f.key] = value === null || value === undefined ? "" : String(value);
        break;
      case "boolean":
        form[f.key] = value === null || value === undefined ? Boolean(f.defaultValue) : Boolean(value);
        break;
      case "projects":
        form[f.key] = Array.isArray(value)
          ? value.map((p) => ({
              name: p?.name || "",
              description: p?.description || "",
              tech: Array.isArray(p?.tech) ? p.tech.join(", ") : p?.tech || "",
            }))
          : [];
        break;
      default:
        form[f.key] = value ?? "";
    }
  }
  return form;
}

export function formToPayload(role, form) {
  const payload = {};
  for (const f of getFields(role)) {
    const value = form[f.key];
    switch (f.type) {
      case "tags":
        payload[f.key] = (value || []).map((t) => t.trim()).filter(Boolean);
        break;
      case "number":
        payload[f.key] = value === "" || value === null || value === undefined ? null : Number(value);
        break;
      case "boolean":
        payload[f.key] = Boolean(value);
        break;
      case "projects":
        payload[f.key] = (value || [])
          .filter((p) => p.name.trim())
          .map((p) => ({
            name: p.name.trim(),
            description: p.description.trim(),
            tech: p.tech
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          }));
        break;
      default:
        payload[f.key] = typeof value === "string" ? value.trim() : value;
    }
  }
  return payload;
}

export function validateForm(role, form) {
  const errors = {};
  for (const f of getFields(role)) {
    const value = form[f.key];

    if (f.required && isEmptyValue(value)) {
      errors[f.key] = `${f.label} is required`;
      continue;
    }

    if (f.type === "url" && !isEmptyValue(value) && !isHttpUrl(value)) {
      errors[f.key] = "Enter a full link starting with http:// or https://";
    }

    if (f.type === "number" && !isEmptyValue(value)) {
      const n = Number(value);
      if (Number.isNaN(n)) errors[f.key] = `${f.label} must be a number`;
      else if (f.min !== undefined && n < f.min) errors[f.key] = `${f.label} must be at least ${f.min}`;
      else if (f.max !== undefined && n > f.max) errors[f.key] = `${f.label} must be at most ${f.max}`;
    }

    if (f.type === "projects" && (value || []).some((p) => !p.name.trim() && (p.description.trim() || p.tech.trim()))) {
      errors[f.key] = "Every project needs a name";
    }
  }
  return errors;
}
