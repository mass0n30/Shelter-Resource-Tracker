export default function ClientProfileSkeleton() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <BannerSkeleton className="shrink-0 w-full border-b bg-backgroundAlt" />

      <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-4">
        <ClientInfoSectionToggleSkeleton className="md:col-span-3" />

        <InformationSkeleton className="min-h-0 max-h-none overflow-y-auto md:col-span-1 md:max-h-[calc(140vh-200px)]" />
      </div>
    </div>
  );
}

function BannerSkeleton({ className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        {/* Left side */}
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:gap-4">
          {/* Back button */}
          <div className="h-7 w-24 animate-pulse rounded-md bg-slate-200 sm:w-36" />

          {/* Client identity */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-slate-200 sm:h-14 sm:w-14" />

            <div className="min-w-0 flex-1 animate-pulse">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <div className="h-5 w-40 rounded-md bg-slate-200 sm:w-52" />
                <div className="h-5 w-20 rounded-full bg-slate-200" />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="h-3 w-20 rounded-md bg-slate-200" />
                <div className="h-3 w-16 rounded-md bg-slate-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:min-w-[300px] md:items-center">
          <div className="h-11 w-full animate-pulse rounded-md bg-white" />
          <div className="h-11 w-full animate-pulse rounded-md bg-white" />
        </div>
      </div>
    </div>
  );
}

function ClientInfoSectionToggleSkeleton({ className = "" }) {
  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden rounded-md bg-white p-3 sm:p-4 ${className}`}
    >
      {/* Toggle buttons */}
      <div className="mb-4 grid shrink-0 grid-cols-3 gap-2 md:gap-4">
        <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
      </div>

      {/* Content area */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl bg-background p-2 pr-1 sm:p-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <ResourceCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourceCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-border bg-white p-3 shadow-sm sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-5 w-40 rounded-md bg-slate-200 sm:w-56" />

          <div className="mt-2 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-slate-200" />
            <div className="h-3 w-28 rounded-md bg-slate-200" />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
          <div className="h-6 w-20 rounded-full bg-slate-200" />
          <div className="h-8 w-8 rounded-md bg-slate-200" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded-md bg-slate-100" />
        <div className="h-3 w-2/3 rounded-md bg-slate-100" />
      </div>
    </div>
  );
}

function InformationSkeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-xl border border-border bg-white shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="border-b border-border px-4 py-4">
        <div className="flex w-full items-center justify-between rounded-full bg-primaryLight px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-slate-200" />
            <div className="h-5 w-36 rounded-md bg-slate-200" />
          </div>

          <div className="h-6 w-12 rounded-md bg-slate-200" />
        </div>

        <div className="mt-2 h-4 w-48 rounded-md bg-slate-200" />
      </div>

      <div className="space-y-sm p-sm text-sm">
        {/* Main info cards */}
        <div className="grid grid-cols-1 gap-xs">
          {Array.from({ length: 8 }).map((_, index) => (
            <InfoCardSkeleton key={index} />
          ))}
        </div>

        {/* Priority need placeholder */}
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-slate-200" />

            <div className="min-w-0 flex-1">
              <div className="h-3 w-24 rounded-md bg-slate-200" />
              <div className="mt-2 h-4 w-40 rounded-md bg-slate-200" />
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Additional info */}
        <div className="rounded-lg border border-dashed border-border bg-backgroundAlt/50 p-3">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-slate-200" />
            <div className="h-3 w-36 rounded-md bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 gap-xs">
            {Array.from({ length: 4 }).map((_, index) => (
              <InfoCardSkeleton key={index} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCardSkeleton({ compact = false }) {
  return (
    <div
      className={`rounded-lg border-b-2 border-border bg-backgroundAlt ${
        compact ? "p-3" : "p-3.5"
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200" />

        <div className="min-w-0 flex-1">
          <div className="h-3 w-24 rounded-md bg-slate-200" />
          <div className="mt-2 h-4 w-32 rounded-md bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="h-3 w-16 rounded-md bg-slate-200" />
          <div className="mt-2 h-7 w-8 rounded-md bg-slate-300" />
        </div>

        <div className="h-9 w-9 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}