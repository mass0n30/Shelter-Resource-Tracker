import {
  LayoutDashboard,
  FolderSearch,
  Bell,
  Upload,
  Menu,
  House,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import FileForm from "./forms/FileForm";
import { UserDropdown } from "./partials/Dropdown";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

function Navbar({
  className = "",
  user,
  authRouterForm,
  fetchUpdatedData,
  openForm,
  setOpenForm,
  notificationsOpen,
  setNotificationsOpen,
}) {
  return (
    <nav className={className}>
      <header className="border-b border-slate-200 bg-white">
        <div className="px-5 sm:px-6">
          {/* Mobile Navbar */}
          <div className="flex h-14 items-center justify-between lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-transparent text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[280px] bg-white p-0">
                <SheetHeader className="border-b border-slate-200 px-4 py-4 text-left">
                  <SheetTitle className="text-base font-bold tracking-[-0.02em] text-slate-950">
                    Shelter Resource Tracker
                  </SheetTitle>
                  <p className="text-sm font-medium text-slate-400">
                    Bringing a supportive community together
                  </p>
                </SheetHeader>

                <div className="flex flex-col gap-1 px-3 py-4">
                  <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                      }`
                    }
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/dashboard/records"
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                      }`
                    }
                  >
                    <FolderSearch className="h-4 w-4" />
                    Records
                  </NavLink>

                  <Dialog
                    open={openForm === "csv"}
                    onOpenChange={(isOpen) =>
                      setOpenForm(isOpen ? "csv" : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Upload className="h-4 w-4" />
                        Upload CSV
                      </button>
                    </DialogTrigger>

                    <DialogContent className="w-full max-w-lg bg-white">
                      <FileForm
                        authRouterForm={authRouterForm}
                        fetchUpdatedData={fetchUpdatedData}
                        setOpenForm={setOpenForm}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mt-auto border-t border-slate-200 px-4 py-4">
                  <UserDropdown user={user} />
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="absolute left-1/2 -translate-x-1/2 text-[15px] font-bold tracking-[-0.02em] text-slate-950">
              Dashboard
            </h1>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setNotificationsOpen?.(true)}
              className="relative h-10 w-10 rounded-xl bg-transparent text-slate-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <Bell className="h-5 w-5" />

              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                3
              </span>
            </Button>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden h-14 items-center justify-between gap-6 lg:flex">
            {/* Brand */}
            <div className="flex min-w-[290px] items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <House className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold text-left leading-tight tracking-[-0.035em] text-slate-950">
                  Shelter Resource Tracker
                </h1>

                <p className="mt-0.5 truncate text-xs text-left font-medium leading-none tracking-[-0.015em] text-slate-400">
                  Bringing a supportive community together
                </p>
              </div>
            </div>

            {/* Center Nav */}
            <div className="flex flex-1 justify-center">
              <div className="flex items-center gap-1">
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[14px] font-semibold tracking-[-0.02em] transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    }`
                  }
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </NavLink>

                <NavLink
                  to="/dashboard/records"
                  className={({ isActive }) =>
                    `inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[14px] font-semibold tracking-[-0.02em] transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    }`
                  }
                >
                  <FolderSearch className="h-4 w-4" />
                  Records
                </NavLink>

                <Dialog
                  open={openForm === "csv"}
                  onOpenChange={(isOpen) =>
                    setOpenForm(isOpen ? "csv" : null)
                  }
                >
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-transparent px-3 text-[14px] font-semibold tracking-[-0.02em] text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Upload className="h-4 w-4" />
                      Upload CSV
                    </button>
                  </DialogTrigger>

                  <DialogContent className="w-full max-w-lg bg-white">
                    <FileForm
                      authRouterForm={authRouterForm}
                      fetchUpdatedData={fetchUpdatedData}
                      setOpenForm={setOpenForm}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* User */}
            <div className="flex min-w-[180px] border-b border-primary items-center justify-end">
              <UserDropdown user={user} />
            </div>
          </div>
        </div>
      </header>
    </nav>
  );
}

export default Navbar;
