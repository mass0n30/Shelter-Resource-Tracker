export default function ClientProfileSkeleton() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-200">
      <BannerSkeleton className="shrink-0 w-full bg-gray-100 min-h-[200px]" />

      <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-4">
        <ClientInfoSectionToggleSkeleton className="md:col-span-3" />

        <InformationSkeleton className="min-h-0 overflow-y-auto md:col-span-1" />
      </div>
    </div>
  );
}

function BannerSkeleton({ className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="max-w-7xl flex-1 flex items-center justify-between gap-4 px-4 animate-pulse">
        <div className="items-start">
          <div className="flex flex-1 mb-2">
            <div className="h-9 w-40 rounded-md bg-gray-200" />
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200" />

            <div className="flex flex-col justify-center gap-3">
              <div className="h-5 w-40 rounded-md bg-gray-200" />
              <div className="flex gap-3">
                <div className="h-4 w-20 rounded-md bg-gray-200" />
                <div className="h-4 w-24 rounded-md bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:min-w-[350px]">
          <div className="h-10 flex-1 rounded-md bg-gray-200" />
          <div className="h-10 flex-1 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function ClientInfoSectionToggleSkeleton({ className = "" }) {
  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden rounded-md bg-white p-4 animate-pulse ${className}`}
    >
      <div className="mb-4 flex shrink-0 gap-2 md:gap-4">
        <div className="h-10 flex-1 rounded-md bg-gray-200" />
        <div className="h-10 flex-1 rounded-md bg-gray-200" />
        <div className="h-10 flex-1 rounded-md bg-gray-200" />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="flex flex-col bg-gray-100 p-3 sm:p-4 rounded-xl space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              <div className="pb-sm flex items-start justify-between gap-2">
                <div className="flex flex-col items-start gap-2">
                  <div className="h-5 w-40 rounded-md bg-gray-200" />
                  <div className="h-4 w-28 rounded-md bg-gray-200" />
                </div>

                <div className="flex items-center gap-sm">
                  <div className="h-6 w-20 rounded-full bg-gray-200" />
                  <div className="h-8 w-8 rounded-md bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InformationSkeleton({ className = "" }) {
  return (
    <div className={`bg-white rounded-xl border shadow-sm animate-pulse ${className}`}>
      <div className="border-b p-4">
        <div className="h-6 w-40 rounded-md bg-gray-200" />
        <div className="mt-2 h-4 w-52 rounded-md bg-gray-200" />
      </div>

      <div className="space-y-5 p-4 text-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className="h-3 w-20 rounded-md bg-gray-200" />
              <div className="mt-2 h-4 w-24 rounded-md bg-gray-200" />
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="h-3 w-24 rounded-md bg-gray-200" />
          <div className="mt-2 h-4 w-40 rounded-md bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className="h-3 w-24 rounded-md bg-gray-200" />
              <div className="mt-2 h-4 w-20 rounded-md bg-gray-200" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="h-3 w-20 rounded-md bg-gray-200" />
            <div className="mt-2 h-7 w-8 rounded-md bg-gray-200" />
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="h-3 w-16 rounded-md bg-gray-200" />
            <div className="mt-2 h-7 w-8 rounded-md bg-gray-200" />
          </div>
        </div>

        <div className="rounded-lg border border-dashed p-3">
          <div className="h-3 w-36 rounded-md bg-gray-200" />

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="h-3 w-20 rounded-md bg-gray-200" />
                <div className="mt-2 h-4 w-24 rounded-md bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}