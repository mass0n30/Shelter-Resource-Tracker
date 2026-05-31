
export default function ClientListSkeleton({ count = 6 }) {
  return (
    <div className="m-md grid w-full grid-cols-1 gap-md md:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-auto w-full justify-start rounded-lg border bg-white p-0"
        >
          <ClientCardSkeleton />
        </div>
      ))}
    </div>
  );
}

function ClientCardSkeleton() {
  return (
    <div className="flex-1 min-w-0 min-h-full rounded-lg bg-white border border-primaryLight p-xs sm:px-lg py-md shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Avatar */}
          <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 border border-slate-200 animate-pulse" />

          <div className="flex flex-col min-w-0">
            {/* Name */}
            <div className="h-4 sm:h-5 md:h-6 w-32 sm:w-40 rounded bg-slate-100 animate-pulse" />
          </div>
        </div>

        {/* Status pill */}
        <div className="shrink-0 h-6 sm:h-7 w-20 rounded-full border border-slate-200 bg-slate-100 animate-pulse" />
      </div>

      {/* Stats pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="h-6 w-24 rounded-md border border-gray-200 bg-gray-50 animate-pulse" />
        <div className="h-6 w-20 rounded-md border border-gray-200 bg-gray-50 animate-pulse" />
        <div className="h-6 w-24 rounded-md border border-gray-200 bg-gray-50 animate-pulse" />
      </div>
    </div>
  );
}

