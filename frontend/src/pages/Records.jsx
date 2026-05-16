import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Search,
  FolderSearch,
  NotebookText,
  Archive,
  SlidersHorizontal,
  X,
  User
} from "lucide-react";

import Navbar from "../components/Navbar";
import { Notes, Resources } from "./ClientProfile";

function RecordsPage() {
  const { user, data, authRouter, authRouterForm, fetchUpdatedData } =
    useOutletContext();

  const [activeTab, setActiveTab] = useState("resources");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [visibilityFilter, setVisibilityFilter] = useState("ALL");

  const allResources = data?.referrals || [];
  const allNotes = data?.notes || [];

  const resourceTypes = useMemo(() => {
    return [
      "ALL",
      ...new Set(
        allResources
          .map((resource) => resource.resourceType)
          .filter(Boolean)
      ),
    ];
  }, [allResources]);

  const filteredResources = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return allResources.filter((resource) => {
      const clientName = resource.client
        ? `${resource.client.firstName} ${resource.client.lastName}`.toLowerCase()
        : "";

      const matchesSearch =
        resource.organizationName?.toLowerCase().includes(search) ||
        resource.resourceType?.toLowerCase().includes(search) ||
        resource.status?.toLowerCase().includes(search) ||
        resource.summary?.toLowerCase().includes(search) ||
        resource.purpose?.toLowerCase().includes(search) ||
        clientName.includes(search);

      const matchesStatus =
        statusFilter === "ALL" || resource.status === statusFilter;

      const matchesType =
        typeFilter === "ALL" || resource.resourceType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allResources, searchTerm, statusFilter, typeFilter]);

  const filteredNotes = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return allNotes.filter((note) => {
      const clientName = note.client
        ? `${note.client.firstName} ${note.client.lastName}`.toLowerCase()
        : "";

      const authorName = note.author
        ? `${note.author.firstName} ${note.author.lastName}`.toLowerCase()
        : "";

      const matchesSearch =
        note.title?.toLowerCase().includes(search) ||
        note.content?.toLowerCase().includes(search) ||
        note.visibility?.toLowerCase().includes(search) ||
        clientName.includes(search) ||
        authorName.includes(search);

      const matchesVisibility =
        visibilityFilter === "ALL" || note.visibility === visibilityFilter;

      return matchesSearch && matchesVisibility;
    });
  }, [allNotes, searchTerm, visibilityFilter]);

  const visibleCount =
    activeTab === "resources"
      ? filteredResources.length
      : activeTab === "notes"
      ? filteredNotes.length
      : 0;

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setVisibilityFilter("ALL");
  };

  const hasFilters =
    searchTerm ||
    statusFilter !== "ALL" ||
    typeFilter !== "ALL" ||
    visibilityFilter !== "ALL";

  return (
    <>
      <Navbar
        className="bg-white shadow h-24em"
        authRouter={authRouter}
        authRouterForm={authRouterForm}
        user={user}
      />

      <main className="bg-primaryLight min-h-screen px-sm md:px-md">
        <div className="mx-auto w-full max-w-7xl p-sm md:p-md">
          {/* Header */}
          <section className="mb-md flex flex-col items-start">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Records
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              Search and manage all client resources, referrals, and case notes
              from one manager-wide workspace.
            </p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-sm md:gap-md">
            {/* Main Panel */}
            <section className="lg:col-span-3 bg-background border-2 border-border-400 rounded-xl shadow-md overflow-hidden">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-border bg-backgroundAlt p-4">
                <button
                  onClick={() => setActiveTab("resources")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    activeTab === "resources"
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white text-muted border border-border hover:bg-primaryLight hover:text-primary"
                  }`}
                >
                  <FolderSearch className="h-4 w-4" />
                  Resources
                </button>

                <button
                  onClick={() => setActiveTab("notes")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    activeTab === "notes"
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white text-muted border border-border hover:bg-primaryLight hover:text-primary"
                  }`}
                >
                  <NotebookText className="h-4 w-4" />
                  Notes
                </button>

                <button
                  onClick={() => setActiveTab("archived")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    activeTab === "archived"
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white text-muted border border-border hover:bg-primaryLight hover:text-primary"
                  }`}
                >
                  <Archive className="h-4 w-4" />
                  Archived
                </button>
              </div>

              {/* Filters */}
              <div className="border-b border-border bg-background p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  Search & Filters
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={
                        activeTab === "resources"
                          ? "Search by client, organization, type, purpose..."
                          : "Search by client, author, title, content..."
                      }
                      className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {activeTab === "resources" && (
                    <>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="INQUIRED">Inquired</option>
                        <option value="REFERRED">Referred</option>
                        <option value="PENDING">Pending</option>
                        <option value="ENROLLED">Enrolled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CLOSED">Closed</option>
                      </select>

                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        {resourceTypes.map((type) => (
                          <option key={type} value={type}>
                            {type === "ALL" ? "All Types" : type}
                          </option>
                        ))}
                      </select>
                    </>
                  )}

                  {activeTab === "notes" && (
                    <select
                      value={visibilityFilter}
                      onChange={(e) => setVisibilityFilter(e.target.value)}
                      className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="ALL">All Visibility</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  )}

                  {hasFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Count */}
              <div className="flex items-center justify-between border-b border-border bg-backgroundAlt px-4 py-3">
                <p className="text-sm text-muted">
                  <span className="font-semibold text-foreground">
                    {visibleCount}
                  </span>{" "}
                  {activeTab === "resources"
                    ? "resources found"
                    : activeTab === "notes"
                    ? "notes found"
                    : "archived records found"}
                </p>
              </div>

              {/* Existing Components */}
              <div className="p-4  max-h-[calc(120vh-500px)] flex-1 overflow-y-auto  ">
                {activeTab === "resources" && (
                  <Resources
                    referrals={filteredResources}
                    fetchClientData={fetchUpdatedData}
                    authRouter={authRouter}
                    showName={true}
                  />
                )}

                {activeTab === "notes" && (
                  <Notes
                    notes={filteredNotes}
                    fetchClientData={fetchUpdatedData}
                    authRouter={authRouter}
                    showName={true}
                  />
                )}

                {activeTab === "archived" && (
                  <div className="bg-gray-100 p-8 rounded-xl text-center">
                    <Archive className="mx-auto h-10 w-10 text-muted" />
                    <h3 className="mt-3 font-semibold text-foreground">
                      Archived records coming soon
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      This section can show deleted, completed, or inactive
                      records later.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Summary */}
            <aside className="lg:col-span-1 bg-background border-2 border-border-400 rounded-xl shadow-md overflow-hidden h-fit">
              <div className="border-b border-border px-4 py-4">
                <h2 className="font-semibold text-foreground">
                  Record Summary
                </h2>
                <p className="mt-1 text-sm text-muted">Manager-wide totals</p>
              </div>

              <div className="p-4 space-y-3">
                <SummaryCard label="Resources" value={allResources.length} />
                <SummaryCard label="Notes" value={allNotes.length} />
                <SummaryCard label="Visible Now" value={visibleCount} />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-backgroundAlt p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default RecordsPage;