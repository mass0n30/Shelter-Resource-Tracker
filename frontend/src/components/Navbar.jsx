
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientForm from "./forms/ClientForm";

// asChild injects ref, defined with React.forwardRef in ui/dialog DialogTrigger, into the button component, allowing it to function as the trigger for the dialog.
function Navbar({className, authRouter, authRouterForm, user }) {

  return (
    <nav className={className}>
      <div className="flex w-full items-center justify-between gap-sm max-w-7xl mx-auto">
        <div className="flex flex-col justify-start p-sm pl-lg">
          <h1 className="text-lg text-start font-bold">Shelter Resource Tracker</h1>
          <i>Bringing a <span className="text-muted">supportive community</span> together</i>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;