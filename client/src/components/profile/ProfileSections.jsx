import {
  Award,
  Briefcase,
  ExternalLink,
  FileText,
  FolderGit2,
  GraduationCap,
  Lightbulb,
  Link2,
  Medal,
  Pencil,
  Rocket,
  BookOpen,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
import {
  SECTIONS_BY_ROLE,
  formatValue,
  getFieldMap,
  isEmptyValue,
  isHttpUrl,
} from "../../utils/profileFields";

const ICONS = {
  about: FileText,
  education: GraduationCap,
  skills: Wrench,
  interests: Lightbulb,
  projects: FolderGit2,
  certifications: Award,
  achievements: Trophy,
  extraCurricular: Medal,
  career: Briefcase,
  links: Link2,
  mentoring: Users,
  startups: Rocket,
  publications: BookOpen,
};

function Chips({ items }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-full border border-[#dbe1ff] bg-[#eff4ff] px-3 py-1 text-xs font-semibold text-[#003ea8]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-[#0b1c30]">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0051d5]" />
          <span className="break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Facts({ rows }) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      {rows.map(({ key, label, value }) => (
        <div key={key} className="min-w-0">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#45464d]">{label}</dt>
          <dd className="mt-0.5 break-words text-sm font-medium text-[#0b1c30]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Projects({ projects }) {
  return (
    <div className="space-y-3">
      {projects.map((p, i) => (
        <div
          key={`${p.name}-${i}`}
          className="rounded-xl border border-[#c6c6cd]/50 bg-[#eff4ff]/50 p-4"
        >
          <h4 className="text-sm font-bold text-[#0b1c30]">{p.name}</h4>
          {p.description && (
            <p className="mt-1 text-sm leading-6 text-[#45464d]">{p.description}</p>
          )}
          {Array.isArray(p.tech) && p.tech.length > 0 && (
            <div className="mt-3">
              <Chips items={p.tech} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function LinkRows({ rows }) {
  return (
    <ul className="space-y-2">
      {rows.map(({ key, label, value }) => (
        <li key={key} className="flex items-center gap-2 text-sm">
          <span className="w-32 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-[#45464d]">
            {label}
          </span>
          {isHttpUrl(value) ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-0 items-center gap-1.5 font-semibold text-[#0051d5] hover:underline"
            >
              <span className="truncate">{value}</span>
              <ExternalLink size={14} className="shrink-0" />
            </a>
          ) : (
            <span className="truncate text-[#0b1c30]">{value}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function SectionCard({ section, isOwn, onEdit, children }) {
  const Icon = ICONS[section.icon] || FileText;
  return (
    <section className="rounded-xl border border-[#c6c6cd]/50 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[#c6c6cd]/40 pb-3">
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-[#0051d5]" />
          <h2 className="text-base font-bold text-[#0b1c30]">{section.title}</h2>
        </div>
        {isOwn && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${section.title}`}
            title={`Edit ${section.title}`}
            className="rounded-lg p-1.5 text-[#45464d] transition-colors hover:bg-[#eff4ff] hover:text-[#0051d5]"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

export default function ProfileSections({ role, profile, isOwn, onEdit }) {
  const fieldMap = getFieldMap(role);
  const sections = SECTIONS_BY_ROLE[role] || SECTIONS_BY_ROLE.student;
  const data = profile || {};

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const hasContent = section.fields.some((key) => !isEmptyValue(data[key]));
        if (!hasContent && !isOwn) return null;

        const rows = section.fields
          .filter((key) => !isEmptyValue(data[key]))
          .map((key) => ({
            key,
            label: fieldMap[key]?.label || key,
            value: formatValue(fieldMap[key], data[key]),
          }));

        let body;
        if (!hasContent) {
          body = (
            <button
              type="button"
              onClick={onEdit}
              className="text-sm font-semibold text-[#0051d5] hover:underline"
            >
              + Add {section.title.toLowerCase()}
            </button>
          );
        } else if (section.kind === "text") {
          body = (
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#0b1c30]">
              {data[section.fields[0]]}
            </p>
          );
        } else if (section.kind === "chips") {
          body = <Chips items={data[section.fields[0]]} />;
        } else if (section.kind === "list") {
          body = <BulletList items={data[section.fields[0]]} />;
        } else if (section.kind === "projects") {
          body = <Projects projects={data[section.fields[0]]} />;
        } else if (section.kind === "links") {
          body = <LinkRows rows={rows} />;
        } else {
          body = <Facts rows={rows} />;
        }

        return (
          <SectionCard key={section.id} section={section} isOwn={isOwn} onEdit={onEdit}>
            {body}
          </SectionCard>
        );
      })}
    </div>
  );
}
