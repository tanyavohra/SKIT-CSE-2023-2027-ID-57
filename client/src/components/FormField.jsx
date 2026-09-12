// Generic labeled input with a leading icon, matching the Stitch form-field style.
export default function FormField({
  id,
  label,
  icon: Icon,
  error,
  trailing,
  ...inputProps
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral">
            <Icon size={18} strokeWidth={1.75} />
          </div>
        )}
        <input
          id={id}
          name={id}
          className={`h-11 w-full rounded-lg border bg-white text-sm text-ink outline-none transition-shadow placeholder:text-muted ${
            Icon ? "pl-10" : "pl-3.5"
          } ${trailing ? "pr-10" : "pr-3.5"} ${
            error
              ? "border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
              : "border-line focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
          }`}
          {...inputProps}
        />
        {trailing}
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}