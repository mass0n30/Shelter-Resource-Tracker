import {
  LayoutDashboard,
  FolderSearch,
  CalendarDays,
  Bell,
  ChevronDown,
  Upload,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import FileForm  from "./forms/FileForm";
import { UserDropdown } from "./partials/Dropdown";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

function Navbar({ className, user, authRouterForm, fetchUpdatedData, openForm, setOpenForm }) {
  return (
    <nav className={className}>
      <header className="h-full border-b border-border bg-backgroundAlt shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="shrink-0">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Shelter Resource Tracker
              </h1>
              <p className="mt-1 text-sm italic text-muted">
                Bringing a supportive community together
              </p>
            </div>
            <div className="flex items-center gap-4">
            {/* Main Nav */}
            <div className="flex  items-center gap-2">
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-primaryLight text-primary"
                      : "text-muted hover:bg-primaryLight hover:text-primary"
                  }`
                }
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>

              <NavLink
                to="/dashboard/records"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-primaryLight text-primary"
                      : "text-muted hover:bg-primaryLight hover:text-primary"
                  }`
                }
              >
                <FolderSearch className="h-4 w-4" />
                Records
              </NavLink>
                <Dialog
                  open={openForm === "csv"}
                  onOpenChange={(isOpen) => setOpenForm(isOpen ? "csv" : null)}
                >
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-medium text-muted transition hover:bg-primaryLight hover:text-primary"
                    >
                      <Upload className="h-4 w-4" />
                      Upload CSV
                    </button>
                  </DialogTrigger>

                  <DialogContent className="bg-background w-full max-w-lg">
                    <FileForm
                      authRouterForm={authRouterForm}
                      fetchUpdatedData={fetchUpdatedData}
                      setOpenForm={setOpenForm}
                    />
                  </DialogContent>
                </Dialog>
            </div>

            {/* User */}
            <UserDropdown user={user} />
          </div>
          </div>
        </div>
      </header>
    </nav>
  );
}

export default Navbar;