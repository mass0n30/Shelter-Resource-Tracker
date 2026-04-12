
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientForm from "./forms/ClientForm";

// asChild injects ref, defined with React.forwardRef in ui/dialog DialogTrigger, into the button component, allowing it to function as the trigger for the dialog.
function Navbar({className, authRouter, authRouterForm }) {

  return (
    <nav className={className}>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create Client</Button>
        </DialogTrigger>
        <ClientForm authRouter={authRouter} authRouterForm={authRouterForm} />
      </Dialog>
      <div>Navbar Text</div>
    </nav>
  );
}

export default Navbar;