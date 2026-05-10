import { Heart } from "lucide-react";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-100dvh flex flex-col w-full bg-background">
      {/* Navbar loader */}
      <div className="bg-white w-full shadow h-[120px] animate-pulse" >
        <header className="h-full border-b border-border bg-backgroundAlt">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Shelter Resource Tracker
                </h1>
                <p className="mt-1 text-sm italic text-muted">
                  Bringing a supportive community together
                </p>
              </div>

              <div className="hidden md:flex rounded-full bg-secondary px-4 py-2 text-sm text-primary font-medium gap-2">
              </div>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 flex align-start justify-center p-sm md:p-md">
        <div className="w-full max-w-7xl flex">
          <div className="flex-1 w-full h-screen grid grid-cols-1 auto-rows-min lg:grid-cols-4 gap-4 md:p-4">
            
            {/* DashStats loader */}
            <DashStatsSkeleton className="col-span-1 row-span-3 lg:row-span-2 lg:col-span-4" />

            {/* ClientToggleSection loader */}
            <ClientToggleSectionSkeleton className="col-span-1 lg:col-span-3 row-span-7" />
            {/* Notifications outer wrapper */}
            <NotificationsSkeleton className="col-span-1 lg:col-span-1 row-span-10 min-h-0 overflow-hidden flex flex-col" />

          </div>
        </div>
      </main>
    </div>
  );
}


function DashStatsSkeleton({ className = "" }) {
  return (
    <div className={`flex flex-col gap-md ${className} md:flex-row`}>
      <div className="flex-1 flex gap-md">
        <DashStatCardSkeleton />
        <DashStatCardSkeleton />
      </div>

      <div className="flex-1 flex gap-md">
        <DashStatCardSkeleton />
        <DashStatCardSkeleton />
      </div>
    </div>
  );
}

function DashStatCardSkeleton() {
  return (
    <div
      className="flex-1 bg-backgroundAlt rounded-md shadow-md p-md flex md:flex-col items-center justify-between gap-sm animate-pulse"
    >
      <div className="flex flex-col items-center gap-1">
        <div className="h-4 w-20 rounded-md bg-gray-200 md:h-5 md:w-28" />
      </div>

      <div className="flex md:flex-col items-center gap-sm md:gap-xs">
        <div className="h-3 w-20 rounded-md bg-gray-200 md:h-4 md:w-24" />
        <div className="h-5 w-8 rounded-md bg-gray-300 md:h-7 md:w-10" />
      </div>
    </div>
  );
}

function ClientToggleSectionSkeleton({ className = "" }) {
  return (
    <div className={`px-4 py-2 flex flex-col shadow-md ${className}`}>
      {/* Search + Filter Row */}
      <div className="w-full flex items-center gap-md p-md pb-sm">
        <div className="flex flex-1 flex-col gap-2">
          <div className="w-full">
            <div className="h-4 w-32 mb-2 ml-1 rounded-md bg-gray-200 animate-pulse" />
            <div className="h-10 w-full rounded-md bg-gray-200 animate-pulse" />
          </div>

          <div className="flex justify-start gap-2 md:justify-start">
            <div className="h-9 w-20 rounded-md bg-gray-200 animate-pulse" />
            <div className="h-9 w-28 rounded-md bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Calendar, enrolled toggle, layout toggle buttons */}
      <div className="w-full flex items-center pl-md pr-md pb-lg gap-md">
        <div className="flex-1 justify-between gap-2 flex">
          <div className="h-4 w-40 ml-2 rounded-md bg-gray-200 animate-pulse" />

          <div className="flex items-center gap-2">
            <div className="h-9 w-28 rounded-md bg-gray-200 animate-pulse" />
            <div className="h-9 w-9 rounded-md bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Combobox placeholder */}
      <div className="h-0" />

      {/* Client list skeleton */}
      <div className="clientList flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-md pt-0">
          {Array.from({ length: 8 }).map((_, index) => (
            <ClientCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ClientCardSkeleton() {
  return (
    <div className="flex-1 min-w-0 sm:min-h-28 bg-background border rounded-xl p-3 sm:p-4 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200" />

          <div className="flex flex-col gap-2">
            <div className="h-4 w-28 rounded-md bg-gray-200" />
            <div className="h-3 w-12 rounded-md bg-gray-200" />
          </div>
        </div>

        <div className="h-6 w-20 rounded-md bg-gray-200" />
      </div>

      <div className="mt-3 sm:mt-4 flex gap-2">
        <div className="h-6 w-24 rounded-md bg-gray-200" />
        <div className="h-6 w-20 rounded-md bg-gray-200" />
        <div className="h-6 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

function NotificationsSkeleton({ className = "" }) {
  return (
    <div className={`${className} h-full flex flex-col`}>
      <div className="flex-1 flex flex-col p-4 overflow-hidden animate-pulse">
        {/* Header row */}
        <div className="flex items-center justify-between mb-sm gap-sm">
          <div className="flex-1 items-start text-left gap-sm">
            <div className="h-5 w-24 rounded-md bg-gray-200" />
          </div>

          <div className="flex-1 items-center gap-sm">
            <div className="h-9 w-full rounded-md bg-gray-200" />
          </div>
        </div>

        {/* Toggle buttons */}
        <div className="flex gap-sm mb-sm">
          <div className="h-10 flex-1 rounded-md bg-gray-200" />
          <div className="h-10 flex-1 rounded-md bg-gray-200" />
        </div>

        {/* Filter / subtitle area */}
        <div className="mb-3">
          <div className="h-9 w-full rounded-md bg-gray-200" />
          <div className="mt-3 flex items-center justify-between">
            <div className="h-4 w-32 rounded-md bg-gray-200" />
            <div className="h-4 w-16 rounded-md bg-gray-200" />
          </div>
        </div>

        {/* Notes / reminders list */}
        <div className="min-h-0 flex-1 space-y-3 overflow-hidden">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="rounded-md border bg-background p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 rounded-md bg-gray-200" />
                  <div className="h-3 w-full rounded-md bg-gray-200" />
                  <div className="h-3 w-2/3 rounded-md bg-gray-200" />
                </div>

                <div className="h-7 w-7 rounded-md bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



