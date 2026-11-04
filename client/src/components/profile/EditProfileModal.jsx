import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import {
  formToPayload,
  getFields,
  profileToForm,
  validateForm,
} from "../../utils/profileFields";

const inputBase =
  "w-full h-11 px-3.5 bg-white border rounded-xl text-sm text-[#0b1c30] placeholder:text-[#76777d]/70 outline-none transition-shadow focus:ring-4";
const inputOk = "border-[#c6c6cd] focus:border-[#0051d5] focus:ring-[#0051d5]/15";
const inputBad = "border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/15";

const cls = (hasError) => `${inputBase} ${hasError ? inputBad : inputOk}`;

/* ------------------------------ Tags input ------------------------------ */

function TagsInput({ id, value, onChange, placeholder, hasError }) {
  const [text, setText] = useState("");

  const commit = (raw) => {
    const parts = raw
      .split(",")
      .map((s) => s.trim().slice(0, 80))
      .filter(Boolean);
    if (parts.length === 0) {
      setText("");
      return;
    }
    const next = [...value];
    parts.forEach((p) => {
      if (!next.some((t) => t.toLowerCase() === p.toLowerCase())) next.push(p);
    });
    onChange(next);
    setText("");
  };

  return (
    <div
      className={`flex min-h-[44px] flex-wrap items-center gap-2 rounded-xl border bg-white px-2.5 py-2 focus-within:ring-4 ${
        hasError
          ? "border-[#ba1a1a] focus-within:ring-[#ba1a1a]/15"
          : "border-[#c6c6cd] focus-within:border-[#0051d5] focus-within:ring-[#0051d5]/15"
      }`}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full border border-[#dbe1ff] bg-[#eff4ff] py-0.5 pl-2.5 pr-1 text-xs font-semibold text-[#003ea8]"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="rounded-full p-0.5 hover:bg-[#dbe1ff]"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit(text);
          } else if (e.key === "Backspace" && !text && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => commit(text)}
        placeholder={value.length === 0 ? placeholder : "Add more…"}
        className="min-w-[140px] flex-1 bg-transparent text-sm text-[#0b1c30] outline-none placeholder:text-[#76777d]/70"
      />
    </div>
  );
}

/* ----------------------------- Projects editor ----------------------------- */

function ProjectsEditor({ value, onChange }) {
  const update = (index, patch) =>
    onChange(value.map((p, i) => (i === index ? { ...p, ...patch } : p)));

  return (
    <div className="space-y-3">
      {value.map((project, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-[#c6c6cd]/60 bg-[#f8f9ff] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#45464d]">
              Project {index + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              aria-label={`Remove project ${index + 1}`}
              className="rounded-lg p-1.5 text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/60"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <input
            value={project.name}
            onChange={(e) => update(index, { name: e.target.value })}
            placeholder="Project name (e.g. TaskFlow)"
            maxLength={100}
            className={cls(false)}
          />
          <textarea
            value={project.description}
            onChange={(e) => update(index, { description: e.target.value })}
            placeholder="Short description"
            rows={2}
            maxLength={300}
            className={`${inputBase} ${inputOk} h-auto resize-y py-2.5 leading-5`}
          />
          <input
            value={project.tech}
            onChange={(e) => update(index, { tech: e.target.value })}
            placeholder="Tech used, comma separated (e.g. React, Node.js, MongoDB)"
            className={cls(false)}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { name: "", description: "", tech: "" }])}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[#0051d5]/50 px-3.5 py-2 text-sm font-semibold text-[#0051d5] transition-colors hover:bg-[#eff4ff]"
      >
        <Plus size={16} />
        Add project
      </button>
    </div>
  );
}

/* --------------------------------- Field --------------------------------- */

const WIDE_TYPES = ["textarea", "tags", "projects", "boolean"];

function FormRow({ f, form, error, setValue }) {
  const id = `field-${f.key}`;
  const value = form[f.key];
  const wide = WIDE_TYPES.includes(f.type);

  let control;
  switch (f.type) {
    case "textarea":
      control = (
        <>
          <textarea
            id={id}
            rows={4}
            maxLength={f.maxLength}
            value={value}
            placeholder={f.placeholder}
            onChange={(e) => setValue(f.key, e.target.value)}
            className={`${inputBase} ${error ? inputBad : inputOk} h-auto resize-y py-2.5 leading-6`}
          />
          {f.maxLength && (
            <p className="mt-1 text-right text-[11px] text-[#76777d]">
              {value.length}/{f.maxLength}
            </p>
          )}
        </>
      );
      break;
    case "select":
      control = (
        <select
          id={id}
          value={value}
          onChange={(e) => setValue(f.key, e.target.value)}
          className={`${cls(Boolean(error))} cursor-pointer ${value ? "" : "text-[#76777d]/70"}`}
        >
          <option value="">Select…</option>
          {f.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
      break;
    case "number":
      control = (
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={f.min}
          max={f.max}
          step={f.step || "1"}
          value={value}
          placeholder={f.placeholder}
          onChange={(e) => setValue(f.key, e.target.value)}
          className={cls(Boolean(error))}
        />
      );
      break;
    case "tags":
      control = (
        <TagsInput
          id={id}
          value={value}
          placeholder={f.placeholder}
          hasError={Boolean(error)}
          onChange={(next) => setValue(f.key, next)}
        />
      );
      break;
    case "projects":
      control = <ProjectsEditor value={value} onChange={(next) => setValue(f.key, next)} />;
      break;
    case "boolean":
      control = (
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => setValue(f.key, !value)}
          className="flex items-center gap-3 text-sm text-[#0b1c30]"
        >
          <span
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
              value ? "bg-[#0051d5]" : "bg-[#c6c6cd]"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                value ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </span>
          <span className="font-medium">{value ? f.trueLabel || "Yes" : f.falseLabel || "No"}</span>
        </button>
      );
      break;
    default:
      control = (
        <input
          id={id}
          type={f.type === "url" ? "url" : "text"}
          value={value}
          placeholder={f.placeholder}
          maxLength={f.type === "url" ? 300 : 120}
          onChange={(e) => setValue(f.key, e.target.value)}
          className={cls(Boolean(error))}
        />
      );
  }

  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#0b1c30]">
        {f.label}
        {f.required && <span className="ml-0.5 text-[#ba1a1a]">*</span>}
      </label>
      {control}
      {error && <p className="mt-1 text-xs text-[#ba1a1a]">{error}</p>}
    </div>
  );
}

/* --------------------------------- Modal --------------------------------- */

export default function EditProfileModal({ open, role, user, profile, saving, error, onClose, onSave }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // Reset the form each time the modal opens.
  useEffect(() => {
    if (open) {
      setForm(profileToForm(role, user, profile));
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Lock page scroll + Escape to close.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, saving, onClose]);

  if (!open || Object.keys(form).length === 0) return null;

  const fields = getFields(role);
  const groups = [];
  fields.forEach((f) => {
    let group = groups.find((g) => g.name === f.group);
    if (!group) {
      group = { name: f.group, fields: [] };
      groups.push(group);
    }
    group.fields.push(f);
  });

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (saving) return;
    const found = validateForm(role, form);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      document.getElementById(`field-${firstKey}`)?.focus();
      return;
    }
    onSave(formToPayload(role, form));
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-3 py-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#c6c6cd]/50 bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#c6c6cd]/40 px-6 py-4">
          <div>
            <h2 id="edit-profile-title" className="text-lg font-bold tracking-tight text-[#0b1c30]">
              Edit profile
            </h2>
            <p className="text-xs text-[#45464d]">
              Fields marked <span className="text-[#ba1a1a]">*</span> are required.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="rounded-lg p-2 text-[#45464d] transition-colors hover:bg-[#eff4ff] disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-5">
          {(error || errorCount > 0) && (
            <div
              role="alert"
              className="rounded-xl border border-[#ba1a1a]/30 bg-[#ffdad6]/40 px-3.5 py-2.5 text-sm text-[#93000a]"
            >
              {error || `Please fix the ${errorCount} highlighted field${errorCount === 1 ? "" : "s"}.`}
            </div>
          )}

          {groups.map((group) => (
            <fieldset key={group.name} className="space-y-4">
              <legend className="mb-1 text-xs font-bold uppercase tracking-wider text-[#0051d5]">
                {group.name}
              </legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {group.fields.map((f) => (
                  <FormRow key={f.key} f={f} form={form} error={errors[f.key]} setValue={setValue} />
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-[#c6c6cd]/40 bg-white px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#c6c6cd] bg-white px-5 text-sm font-semibold text-[#0b1c30] transition-colors hover:bg-[#eff4ff] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-[#131b2e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
