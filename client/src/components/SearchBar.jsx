// src/components/SearchBar.jsx
//
// Global people search shown in the AppLayout header (so it appears on every
// logged-in page, and never on Login / Register). Type a name for instant
// suggestions, or open "Filters" to narrow by education, company and city.
// Enter / "See all results" opens the full /directory page.

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { buildSearchParams, searchDirectory } from "../api/directoryApi";
import { getHeadline, getInitials, resolveImageUrl } from "../utils/profileFields";

const EMPTY_FILTERS = { education: "", company: "", city: "" };
const FILTER_FIELDS = [
  { key: "education", label: "Education", placeholder: "College or branch" },
  { key: "company", label: "Company", placeholder: "e.g. Google" },
  { key: "city", label: "City", placeholder: "e.g. Bangalore" },
];
const DEBOUNCE_MS = 300;
const PREVIEW_LIMIT = 5;

function ResultRow({ person, onSelect }) {
  const user = person.userId || {};
  const headline = getHeadline(user.role || "alumni", person);
  const picture = resolveImageUrl(person.profilePicture);
  const subtitle = [headline, person.location].filter(Boolean).join(" · ");

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(user._id)}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#eff4ff] focus:bg-[#eff4ff] focus:outline-none"
      >
        {picture ? (
          <img src={picture} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#131b2e] text-xs font-semibold text-white">
            {getInitials(user.fullName) || "?"}
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-[#0b1c30]">
            {user.fullName || "Unnamed user"}
          </span>
          {subtitle && <span className="block truncate text-xs text-[#45464d]">{subtitle}</span>}
        </span>
      </button>
    </li>
  );
}

export default function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const wrapRef = useRef(null);

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeFilterCount = Object.values(filters).filter((v) => v.trim()).length;
  const hasCriteria = Boolean(query.trim()) || activeFilterCount > 0;

  // Debounced search. Each run cancels the previous request so stale answers never show.
  useEffect(() => {
    if (!hasCriteria) {
      setResults([]);
      setTotal(0);
      setError("");
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await searchDirectory(
          { search: query, ...filters, limit: PREVIEW_LIMIT },
          controller.signal
        );
        setResults(data.alumni || []);
        setTotal(data.pagination?.total || 0);
      } catch (err) {
        if (controller.signal.aborted) return;
        setResults([]);
        setTotal(0);
        setError(err?.response?.data?.message || "Search is unavailable right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, filters, hasCriteria]);

  // Close when the page changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const openFullResults = () => {
    if (!hasCriteria) return;
    navigate(`/directory?${buildSearchParams(query, filters).toString()}`);
    setOpen(false);
  };

  const openProfile = (id) => {
    if (!id) return;
    navigate(`/profile/${id}`);
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    openFullResults();
  };

  const clearAll = () => {
    setQuery("");
    setFilters(EMPTY_FILTERS);
  };

  const dropdownVisible = open && (showFilters || hasCriteria);

  return (
    <div ref={wrapRef} className="relative">
      <form onSubmit={handleSubmit} role="search" className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            maxLength={100}
            autoComplete="off"
            aria-label="Search people by name"
            placeholder="Search people by name, company, city…"
            className="h-10 w-full rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] pl-10 pr-9 text-sm text-[#0b1c30] outline-none transition-shadow placeholder:text-[#76777d]/70 focus:border-[#0051d5] focus:bg-white focus:ring-4 focus:ring-[#0051d5]/15"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#76777d] hover:bg-[#eff4ff] hover:text-[#0b1c30]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          aria-expanded={showFilters}
          aria-controls="search-filters"
          onClick={() => {
            setShowFilters((v) => !v);
            setOpen(true);
          }}
          className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition-colors ${
            showFilters || activeFilterCount > 0
              ? "border-[#0051d5]/40 bg-[#eff4ff] text-[#0051d5]"
              : "border-[#c6c6cd] bg-white text-[#0b1c30] hover:bg-[#eff4ff]"
          }`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0051d5] px-1 text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </form>

      {dropdownVisible && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[#c6c6cd]/50 bg-white shadow-lg">
          {showFilters && (
            <div id="search-filters" className="border-b border-[#c6c6cd]/40 bg-[#f8f9ff] p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {FILTER_FIELDS.map((f) => (
                  <label key={f.key} className="block">
                    <span className="mb-1 block text-xs font-semibold text-[#45464d]">{f.label}</span>
                    <input
                      type="text"
                      value={filters[f.key]}
                      onChange={(e) => setFilter(f.key, e.target.value)}
                      maxLength={100}
                      placeholder={f.placeholder}
                      className="h-9 w-full rounded-lg border border-[#c6c6cd] bg-white px-3 text-sm text-[#0b1c30] outline-none placeholder:text-[#76777d]/70 focus:border-[#0051d5] focus:ring-4 focus:ring-[#0051d5]/15"
                    />
                  </label>
                ))}
              </div>
              {(activeFilterCount > 0 || query) && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-3 text-xs font-semibold text-[#0051d5] hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          )}

          {hasCriteria ? (
            <div role="listbox" aria-label="Search results">
              {loading && (
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-[#45464d]" role="status">
                  <Loader2 size={16} className="animate-spin" /> Searching…
                </div>
              )}

              {!loading && error && (
                <p className="px-4 py-3 text-sm text-[#93000a]" role="alert">
                  {error}
                </p>
              )}

              {!loading && !error && results.length === 0 && (
                <p className="px-4 py-3 text-sm text-[#45464d]">No people found. Try different words or filters.</p>
              )}

              {!loading && !error && results.length > 0 && (
                <>
                  <ul className="py-1">
                    {results.map((person) => (
                      <ResultRow key={person._id} person={person} onSelect={openProfile} />
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={openFullResults}
                    className="w-full border-t border-[#c6c6cd]/40 px-4 py-2.5 text-center text-sm font-semibold text-[#0051d5] hover:bg-[#eff4ff]"
                  >
                    See all {total} result{total === 1 ? "" : "s"}
                  </button>
                </>
              )}
            </div>
          ) : (
            <p className="px-4 py-3 text-xs text-[#45464d]">Type a name or pick a filter to start searching.</p>
          )}
        </div>
      )}
    </div>
  );
}