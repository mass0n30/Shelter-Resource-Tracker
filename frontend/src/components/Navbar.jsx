import {
  LayoutDashboard,
  FolderSearch,
  Bell,
  Upload,
  Menu,
  X,
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
  className,
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
      <header className="border-b border-border bg-backgroundAlt shadow-sm">
        <div className="mx-auto px-lg py-3 md:px-lg md:py-md">
          {/* Mobile Navbar */}
          <div className="flex items-center justify-between lg:hidden">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-transparent text-muted-foreground hover:bg-primaryLight hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                >
                  <Menu className="h-5 w-5 text-foreground" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[280px] bg-background p-0">
                <SheetHeader className="border-b border-border px-4 py-4 text-left">
                  <SheetTitle className="text-base font-bold text-foreground">
                    Shelter Resource Tracker
                  </SheetTitle>
                  <p className="text-xs text-muted-foreground">
                    Bringing a supportive community together
                  </p>
                </SheetHeader>

                <div className="flex flex-col gap-2 px-3 py-4">
                  <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-primaryLight text-primary"
                          : "text-muted-foreground hover:bg-primaryLight hover:text-primary"
                      }`
                    }
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/dashboard/records"
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-primaryLight text-primary"
                          : "text-muted-foreground hover:bg-primaryLight hover:text-primary"
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
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition hover:bg-primaryLight hover:text-primary"
                      >
                        <Upload className="h-4 w-4" />
                        Upload CSV
                      </button>
                    </DialogTrigger>

                    <DialogContent className="w-full max-w-lg bg-background">
                      <FileForm
                        authRouterForm={authRouterForm}
                        fetchUpdatedData={fetchUpdatedData}
                        setOpenForm={setOpenForm}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mt-auto border-t border-border px-4 py-4">
                  <UserDropdown user={user} />
                </div>
              </SheetContent>
            </Sheet>

            {/* Center title */}
            <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-foreground">
              Dashboard
            </h1>

            {/* Bell */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setNotificationsOpen?.(true)}
              className="relative bg-transparent flex h-12 w-12 items-center justify-center rounded-full text-foreground transition hover:bg-primaryLight hover:text-primary"
            >
              <Bell className="h-12 w-12 bg-transparent text-foreground" />

              {/* Optional notification dot/count */}
              <span className="absolute right-2 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-700 px-1 text-[10px] font-bold text-white">
                3
              </span>
            </Button>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden items-center justify-between gap-6 lg:flex">
            {/* Brand */}
            <div className="shrink-0">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Shelter Resource Tracker
              </h1>
              <p className="mt-1 text-sm italic text-muted-foreground">
                Bringing a supportive community together
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Main Nav */}
              <div className="flex items-center gap-2">
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-primaryLight text-primary"
                        : "text-muted-foreground hover:bg-primaryLight hover:text-primary"
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
                        : "text-muted-foreground hover:bg-primaryLight hover:text-primary"
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
                      className="inline-flex items-center gap-2 rounded-md bg-transparent px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primaryLight hover:text-primary"
                    >
                      <Upload className="h-4 w-4" />
                      Upload CSV
                    </button>
                  </DialogTrigger>

                  <DialogContent className="w-full max-w-lg bg-background">
                    <FileForm
                      authRouterForm={authRouterForm}
                      fetchUpdatedData={fetchUpdatedData}
                      setOpenForm={setOpenForm}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <UserDropdown user={user} />
            </div>
          </div>
        </div>
      </header>
    </nav>
  );
}

export default Navbar;
