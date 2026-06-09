export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen w-full bg-primaryLight">
      {/* Navbar loader */}
      <div className="sticky top-0 z-50 min-h-navHeight w-full border-b border-border bg-white shadow-sm">
        <div className="flex min-h-navHeight items-center justify-between px-4 py-3 md:px-6">
          <div className="animate-pulse">
            <div className="h-5 w-48 rounded-md bg-slate-200 md:h-6 md:w-64" />
            <div className="mt-2 h-3 w-40 rounded-md bg-slate-200 md:w-56" />
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="h-9 w-28 animate-pulse rounded-full bg-slate-200" />
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-primaryLight">
        <div className="mx-auto flex w-full flex-col">
          <DashboardHeroSkeleton />

          <section className="grid grid-cols-1 lg:grid-cols-5">
            <ClientToggleSectionSkeleton className="min-w-0 border border-border bg-background shadow-sm lg:col-span-4" />

            <aside className="hidden min-w-0 lg:block">
              <NotificationsSkeleton className="flex h-full min-h-[calc(130vh)] flex-col border border-border bg-background shadow-sm" />
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}

function DashboardHeroSkeleton() {
  return (
    <section className="border-b border-border bg-backgroundAlt px-4 py-5 shadow-sm md:px-6">
      <div className="flex flex-col gap-5 animate-pulse">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-52 rounded-md bg-slate-200 md:h-7 md:w-72" />
          <div className="h-4 w-64 max-w-full rounded-md bg-slate-200 md:w-96" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DashStatCardSkeleton />
          <DashStatCardSkeleton />
          <DashStatCardSkeleton />
          <DashStatCardSkeleton />
        </div>
      </div>
    </section>
  );
}

function DashStatCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="h-3 w-24 rounded-md bg-slate-200" />
          <div className="mt-3 h-7 w-12 rounded-md bg-slate-300" />
        </div>

        <div className="h-10 w-10 rounded-full bg-slate-200" />
      </div>

      <div className="mt-4 h-3 w-32 rounded-md bg-slate-200" />
    </div>
  );
}

function ClientToggleSectionSkeleton({ className = "" }) {
  return (
    <div className={`flex min-w-0 flex-col overflow-hidden ${className}`}>
      <div className="flex flex-col gap-4 border border-border p-sm md:p-lg">
        {/* Header + action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="animate-pulse">
            <div className="h-4 w-40 rounded-md bg-slate-200" />
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
            <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>

        {/* Search */}
        <div className="animate-pulse">
          <div className="mb-2 h-3 w-28 rounded-md bg-slate-200" />
          <div className="h-10 w-full rounded-md bg-slate-200" />
        </div>

        {/* Search + filter buttons */}
        <div className="mt-sm flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-9 w-36 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      <ClientListSkeleton count={8} />
    </div>
  );
}

function ClientListSkeleton({ count = 6 }) {
  return (
    <div className="clientList w-full border-t border-border">
      <div className="m-md grid grid-cols-1 gap-sm md:grid-cols-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="h-auto w-full rounded-lg border bg-white p-0"
          >
            <ClientCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientCardSkeleton() {
  return (
    <div className="min-h-full w-full rounded-lg border border-primaryLight bg-white px-sm py-md shadow-sm sm:px-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-full border border-slate-200 bg-slate-100 sm:h-10 sm:w-10" />

          <div className="min-w-0">
            <div className="h-4 w-32 animate-pulse rounded-md bg-slate-100 sm:h-5 sm:w-40 md:h-6" />
          </div>
        </div>

        <div className="h-6 w-20 shrink-0 animate-pulse rounded-full border border-slate-200 bg-slate-100 sm:h-7" />
      </div>

      <div className="mt-sm flex flex-wrap items-center gap-2">
        <div className="h-6 w-28 animate-pulse rounded-md border border-gray-200 bg-gray-50" />
        <div className="h-6 w-20 animate-pulse rounded-md border border-gray-200 bg-gray-50" />
        <div className="h-6 w-24 animate-pulse rounded-md border border-gray-200 bg-gray-50" />
      </div>
    </div>
  );
}

function NotificationsSkeleton({ className = "" }) {
  return (
    <div className={`${className} h-full`}>
      <div className="flex h-full flex-col overflow-hidden p-4 animate-pulse">
        {/* Header row */}
        <div className="mb-sm flex items-center justify-between gap-sm">
          <div className="h-5 w-28 rounded-md bg-slate-200" />
          <div className="h-9 w-24 rounded-md bg-slate-200" />
        </div>

        {/* Toggle buttons */}
        <div className="mb-sm flex gap-sm">
          <div className="h-10 flex-1 rounded-md bg-slate-200" />
          <div className="h-10 flex-1 rounded-md bg-slate-200" />
        </div>

        {/* Filter / subtitle area */}
        <div className="mb-3">
          <div className="h-9 w-full rounded-md bg-slate-200" />

          <div className="mt-3 flex items-center justify-between">
            <div className="h-4 w-32 rounded-md bg-slate-200" />
            <div className="h-4 w-16 rounded-md bg-slate-200" />
          </div>
        </div>

        {/* Notes / reminders list */}
        <div className="min-h-0 flex-1 space-y-3 overflow-hidden">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="rounded-md border border-border bg-background p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded-md bg-slate-200" />
                  <div className="h-3 w-full rounded-md bg-slate-200" />
                  <div className="h-3 w-2/3 rounded-md bg-slate-200" />
                </div>

                <div className="h-7 w-7 rounded-md bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}