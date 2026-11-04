// src/pages/Directory.jsx
//
// Full search results. Everything lives in the URL (?search=&education=&company=&city=&page=)
// so results can be shared, bookmarked and reached from the header SearchBar.

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Briefcase, ChevronLeft, ChevronRight, Loader2, MapPin, Search } from "lucide-react";
import { buildSearchParams, searchDirectory } from "../api/directoryApi";
import { getHeadline, getInitials, resolveImageUrl } from "../utils/profileFields";

const PAGE_SIZE = 12;

const FIELDS = [
  { key: "search", label: "Name or keyword", placeholder: "e.g. Rahul" },
  { key: "education", label: "Education", placeholder: "College or branch" },
  { key: "company", label: "Company", placeholder: "e.g. Google" },
  { key: "city", label: "City", placeholder: "e.g. Bangalore" },
];

function PersonCard({ person }) {
  const user = person.userId || {};
  const picture = resolveImageUrl(person.profilePicture);
  const headline = getHeadline(user.role || "alumni", person);

  return (
    <Link
      to={`/profile/${user._id}`}
      className="flex items-start gap-4 rounded-xl border border-[#c6c6cd]/50 bg-white p-5 shadow-sm transition-all hover:border-[#c6c6cd] hover:shadow-md"
    >
      {picture ? (
        <img src={picture} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#131b2e] text-base font-semibold text-white">
          {getInitials(user.fullName) || "?"}
        </span>
      )}
      <div className="min-w-0 space-y-1">
        <h3 className="truncate text-base font-bold text-[#0b1c30]">{user.fullName || "Unnamed user"}</h3>
        {headline && (
          <p className="flex items-center gap-1.5 truncate text-sm text-[#0051d5]">
            <Briefcase size={14} className="shrink-0" />
            <span className="truncate">{headline}</span>
          </p>
        )}
        {person.location && (
          <p className="flex items-center gap-1.5 truncate text-sm text-[#45464d]">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{person.location}</span>
          </p>
        )}
        {(person.college || person.branch) && (
          <p className="truncate text-xs text-[#45464d]">
            {[person.college, person.branch, person.graduationYear].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function Directory() {
  const [searchParams, setSearchParams] = useSearchParams();

  const applied = {
    search: searchParams.get("search") || "",
    education: searchParams.get("education") || "",
    company: searchParams.get("company") || "",
    city: searchParams.get("city") || "",
  };
  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);

  const [form, setForm] = useState(applied);
  const [state, setState] = useState({ loading: true, error: "", people: [], pagination: null });

  // Keep the form in sync when the URL changes (e.g. a search from the header).
  useEffect(() => {
    setForm(applied);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied.search, applied.education, applied.company, applied.city]);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: "" }));

    searchDirectory({ ...applied, page, limit: PAGE_SIZE }, controller.signal)
      .then((data) =>
        setState({ loading: false, error: "", people: data.alumni || [], pagination: data.pagination })
      )
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState({
          loading: false,
          error: err?.response?.data?.message || "We couldn't load the directory. Please try again.",
          people: [],
          pagination: null,
        });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied.search, applied.education, applied.company, applied.city, page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(buildSearchParams(form.search, form));
  };

  const goToPage = (next) => {
    setSearchParams(buildSearchParams(applied.search, applied, next));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { loading, error, people, pagination } = state;
  const hasFilters = Object.values(applied).some(Boolean);

  return (
    <div className="mx-auto w-full max-w-[1000px] space-y-6 px-4 py-8 md:px-6 md:py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">Directory</h1>
        <p className="mt-1 text-sm text-[#45464d]">Find alumni by name, education, company or city.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 rounded-xl border border-[#c6c6cd]/50 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_auto] lg:items-end"
      >
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-xs font-semibold text-[#45464d]">{f.label}</span>
            <input
              type="text"
              value={form[f.key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
              maxLength={100}
              placeholder={f.placeholder}
              className="h-10 w-full rounded-lg border border-[#c6c6cd] bg-white px-3 text-sm text-[#0b1c30] outline-none placeholder:text-[#76777d]/70 focus:border-[#0051d5] focus:ring-4 focus:ring-[#0051d5]/15"
            />
          </label>
        ))}
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-[#131b2e]"
        >
          <Search size={16} />
          Search
        </button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#45464d]" role="status">
          <Loader2 size={18} className="animate-spin" /> Loading…
        </div>
      ) : error ? (
        <div role="alert" className="rounded-xl border border-[#ba1a1a]/30 bg-[#ffdad6]/40 px-4 py-3 text-sm text-[#93000a]">
          {error}
        </div>
      ) : people.length === 0 ? (
        <div className="rounded-xl border border-[#c6c6cd]/40 bg-white p-10 text-center shadow-sm">
          <p className="text-base font-semibold text-[#0b1c30]">No people found</p>
          <p className="mt-1 text-sm text-[#45464d]">
            {hasFilters ? "Try removing a filter or checking the spelling." : "No alumni have set up a profile yet."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-[#45464d]">
            {pagination?.total ?? people.length} {(pagination?.total ?? people.length) === 1 ? "person" : "people"} found
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {people.map((person) => (
              <PersonCard key={person._id} person={person} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <nav className="flex items-center justify-between pt-2" aria-label="Pagination">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#c6c6cd] bg-white px-4 py-2 text-sm font-semibold text-[#0b1c30] transition-colors hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="text-sm text-[#45464d]">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= pagination.totalPages}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#c6c6cd] bg-white px-4 py-2 text-sm font-semibold text-[#0b1c30] transition-colors hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}