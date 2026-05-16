import {
  LayoutDashboard,
  FolderSearch,
  CalendarDays,
  Bell,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Navbar({ className, user }) {
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

            </div>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primaryLight text-sm font-semibold text-primary">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="hidden md:block">{user ? `Welcome, ${user.firstName}` : "Guest"}</span>
                <ChevronDown className="h-4 w-4 text-muted" />
              </div>
            </div>
          </div>
          </div>
        </div>
      </header>
    </nav>
  );
}

export default Navbar;