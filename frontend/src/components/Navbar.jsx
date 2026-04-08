
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import ClientForm from "./forms/ClientForm";

// asChild injects ref, defined with React.forwardRef in ui/dialog DialogTrigger, into the button component, allowing it to function as the trigger for the dialog.
function Navbar() {

  return (
    <nav>
      <Dialog>
        <DialogTrigger asChild>
          <button>Create Client</button>
        </DialogTrigger>
        <ClientForm />
      </Dialog>
      <div>Navbar Text</div>
    </nav>
  );
}

export default Navbar;