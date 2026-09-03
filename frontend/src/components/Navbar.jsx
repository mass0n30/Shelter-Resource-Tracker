import {
  LayoutDashboard,
  FolderSearch,
  Bell,
  Upload,
  Menu,
  House,
  HeartHandshake,
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
        <div className="sm:px-0">
          {/* Mobile Navbar */}
          <div className="mobileNav flex items-center justify-between lg:hidden">
            <Sheet className="p-0">
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-transparent text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Menu className="h-10 w-auto" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[280px] bg-white p-0">
                <SheetHeader className="border-b border-slate-200 px-2 py-4 text-left">
                  <div className="flex w-full items-center gap-3">
                    <img src="/logo/shelterledgerfull.png" alt="ShelterLedger Logo" className="h-full sm:h-full w-auto" />
                  </div>
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
                        className="flex bg-blue-500 items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-50 hover:text-blue-700"
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

            <span className="text-sm font-semibold text-slate-700">
              <img src="/logo/dashboardoverview.png" className=" h-20 w-auto" loading="eager"/>
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setNotificationsOpen?.(true)}
              className="relative h-10 w-10 rounded-xl bg-transparent text-slate-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <Bell className="h-10 w-auto" />

              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                !
              </span>
            </Button>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden h-14 items-center justify-between gap-6 lg:flex">
            {/* Brand */}
            <div className="flex min-w-[290px] items-center gap-3">
              <div className="min-w-0 flex flex-col gap-0.5">
                <span className="truncate text-sm font-semibold text-slate-700">
                    <img src="/logo/shelterledgerfulltwo.png" alt="ShelterLedger Logo" className="h-20 w-auto" />
                </span>
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
            <div className="flex min-w-[180px] border-primary items-center justify-end">
              <UserDropdown user={user} />
            </div>
          </div>
        </div>
      </header>
    </nav>
  );
}

export default Navbar;
