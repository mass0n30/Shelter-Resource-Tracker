export default function ClientListSkeleton({ count = 6 }) {
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
          {/* Avatar */}
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-full border border-slate-200 bg-slate-100 sm:h-10 sm:w-10" />

          {/* Name */}
          <div className="min-w-0">
            <div className="h-4 w-32 animate-pulse rounded-md bg-slate-100 sm:h-5 sm:w-40 md:h-6" />
          </div>
        </div>

        {/* Status pill */}
        <div className="h-6 w-20 shrink-0 animate-pulse rounded-full border border-slate-200 bg-slate-100 sm:h-7" />
      </div>

      {/* Stats pills */}
      <div className="mt-sm flex flex-wrap items-center gap-2">
        <div className="h-6 w-28 animate-pulse rounded-md border border-gray-200 bg-gray-50" />
        <div className="h-6 w-20 animate-pulse rounded-md border border-gray-200 bg-gray-50" />
        <div className="h-6 w-24 animate-pulse rounded-md border border-gray-200 bg-gray-50" />
      </div>
    </div>
  );
}