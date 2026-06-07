import { useMemo, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Search,
  FolderSearch,
  NotebookText,
  Archive,
  SlidersHorizontal,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { Notes, Resources } from "./ClientProfile";

function RecordsPage() {
  const {
    user,
    data,
    authRouter,
    authRouterForm,
    fetchUpdatedData,
    openForm,
    setOpenForm,
  } = useOutletContext();


  const [activeTab, setActiveTab] = useState("resources");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [notesView, setNotesView] = useState("personal");

  const allResources = data?.referrals || [];
  const allNotes = data?.notes || [];
  const personalNotes = user?.notes || [];

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const archivedStatuses = ["CLOSED", "COMPLETED"];

  const activeResources = allResources.filter(
    (resource) => !archivedStatuses.includes(resource.status)
  );

  const archivedResources = allResources.filter((resource) =>
    archivedStatuses.includes(resource.status)
  );

  const publicNotes = useMemo(() => {
    return allNotes.filter((note) => note.visibility === "public");
  }, [allNotes]);

  const notesToDisplay = notesView === "personal" ? personalNotes : publicNotes;

  const resourceTypes = useMemo(() => {
    return [
      "ALL",
      ...new Set(
        allResources.map((resource) => resource.resourceType).filter(Boolean)
      ),
    ];
  }, [allResources]);

  const filteredResources = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return activeResources.filter((resource) => {
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
  }, [activeResources, searchTerm, statusFilter, typeFilter]);

  const filteredArchivedResources = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return archivedResources.filter((resource) => {
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

      const matchesType =
        typeFilter === "ALL" || resource.resourceType === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [archivedResources, searchTerm, typeFilter]);

  const filteredNotes = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return notesToDisplay.filter((note) => {
      const clientName = note.client
        ? `${note.client.firstName} ${note.client.lastName}`.toLowerCase()
        : "";

      const authorName = note.author
        ? `${note.author.firstName} ${note.author.lastName}`.toLowerCase()
        : "";

      return (
        note.title?.toLowerCase().includes(search) ||
        note.content?.toLowerCase().includes(search) ||
        clientName.includes(search) ||
        authorName.includes(search)
      );
    });
  }, [notesToDisplay, searchTerm]);

  const visibleCount =
    activeTab === "resources"
      ? filteredResources.length
      : activeTab === "notes"
      ? filteredNotes.length
      : filteredArchivedResources.length;

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
  };

  const hasFilters =
    searchTerm || statusFilter !== "ALL" || typeFilter !== "ALL";

  return (
    <>
      <Navbar
        className="bg-white shadow h-24em"
        authRouter={authRouter}
        authRouterForm={authRouterForm}
        openForm={openForm}
        setOpenForm={setOpenForm}
        user={user}
      />

      <main className="bg-primaryLight min-h-full px-sm md:px-md">
        <div className="mx-auto w-full p-sm md:p-md">
          <section className="mb-md flex flex-col items-start">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Records
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-muted">
              Search and manage all client resources, referrals, and case notes
              from one manager-wide workspace.
            </p>
          </section>

          <div className="mb-sm flex flex-wrap gap-3 text-xs text-muted">
            <span>
              Resources:{" "}
              <strong className="font-medium text-foreground/80">
                {activeResources.length}
              </strong>
            </span>

            <span>
              Personal Notes:{" "}
              <strong className="font-medium text-foreground/80">
                {personalNotes.length}
              </strong>
            </span>

            <span>
              Public Notes:{" "}
              <strong className="font-medium text-foreground/80">
                {publicNotes.length}
              </strong>
            </span>

            <span>
              Archived:{" "}
              <strong className="font-medium text-foreground/80">
                {archivedResources.length}
              </strong>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-sm md:gap-md">
            <section className="bg-background border-2 border-border-400 rounded-xl shadow-md overflow-hidden">
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
                        activeTab === "notes"
                          ? "Search by client, author, title, content..."
                          : "Search by client, organization, type, purpose..."
                      }
                      className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {(activeTab === "resources" ||
                    activeTab === "archived") && (
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
                    <div className="flex rounded-lg border border-border bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setNotesView("personal")}
                        className={`flex-1 px-3 py-2.5 text-sm font-medium transition ${
                          notesView === "personal"
                            ? "bg-primary text-white"
                            : "bg-white text-muted hover:bg-primaryLight hover:text-primary"
                        }`}
                      >
                        User Notes
                      </button>

                      <button
                        type="button"
                        onClick={() => setNotesView("public")}
                        className={`flex-1 px-3 py-2.5 text-sm font-medium transition ${
                          notesView === "public"
                            ? "bg-primary text-white"
                            : "bg-white text-muted hover:bg-primaryLight hover:text-primary"
                        }`}
                      >
                        Public
                      </button>
                    </div>
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

              <div className="flex items-center justify-between border-b border-border bg-backgroundAlt px-4 py-3">
                <p className="text-sm text-muted">
                  <span className="font-semibold text-foreground">
                    {visibleCount}
                  </span>{" "}
                  {activeTab === "resources"
                    ? "resources found"
                    : activeTab === "notes"
                    ? `${notesView} notes found`
                    : "archived resources found"}
                </p>
              </div>

              <div className="p-4 max-h-[calc(120vh-500px)] flex-1 overflow-y-auto">
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
                    currentUser={user}
                  />
                )}

                {activeTab === "archived" && (
                  <Resources
                    referrals={filteredArchivedResources}
                    fetchClientData={fetchUpdatedData}
                    authRouter={authRouter}
                    showName={true}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}


export default RecordsPage;