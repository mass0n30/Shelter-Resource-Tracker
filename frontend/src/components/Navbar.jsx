
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientForm from "./forms/ClientForm";

// asChild injects ref, defined with React.forwardRef in ui/dialog DialogTrigger, into the button component, allowing it to function as the trigger for the dialog.
function Navbar({className, authRouter, authRouterForm, user }) {

  return (
    <nav className={className}>
    <header className="border-b border-border bg-backgroundAlt">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Shelter Resource Tracker
            </h1>
            <p className="mt-1 text-sm italic text-muted">
              Bringing a supportive community together
            </p>
          </div>

          <div className="hidden md:flex rounded-full bg-secondary px-4 py-2 text-sm text-primary font-medium gap-2">
            <span><i className="icon-user">{user ? `Welcome, ${user.firstName}!` : "Guest"}</i></span>
          </div>
        </div>
      </div>
    </header>
    </nav>
  );
}

export default Navbar;