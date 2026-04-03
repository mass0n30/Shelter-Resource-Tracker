# React + Vite

## Containers, layout + Responsive Design - vanilla CSS
## UI System Setup (shadcn + forms)

### Core Stack Libraries

* `shadcn/ui` → UI components (modals, inputs, etc.)
* `react-hook-form` → form state
* `zod` → validation
---

## Installation

```bash
npm install react-hook-form zod @hookform/resolvers
npx shadcn-ui@latest init
```
---

## Add Core Components

```bash
npx shadcn-ui@latest add input
npx shadcn-ui@latest add button
npx shadcn-ui@latest add select
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add scroll-area

npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add sonner 
```
eventually use progress bars/loaders/spinners
---

## Standard Feature Pattern

Every feature (client edit, profile edit, etc.)

1. Modal (Dialog)
2. Form (react-hook-form)
3. Validation (zod)
4. UI components (shadcn)
5. Submit → API

---

## Modal Example

```jsx
<Dialog>
  <DialogTrigger>Edit</DialogTrigger>

  <DialogContent>
    <FormComponent />
  </DialogContent>
</Dialog>
```

---

## Form Example

```jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1)
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    firstName: "",
    lastName: ""
  }
});
```

---

## Switch (boolean fields)

```jsx
<Switch
  checked={form.watch("active")}
  onCheckedChange={(val) => form.setValue("active", val)}
/>
```

---

## Date Picker

```jsx
<Popover>
  <PopoverTrigger>Select Date</PopoverTrigger>

  <PopoverContent>
    <Calendar
      mode="single"
      selected={form.watch("date")}
      onSelect={(date) => form.setValue("date", date)}
    />
  </PopoverContent>
</Popover>
```

---

## Build Order (IMPORTANT)

1. Modal opens
2. Form submits (console.log)
3. Validation works
4. Hook to backend
5. Replace inputs with styled components
6. Polish UI

---

Vite and Vitest setup now run:
npm install
npm run dev
npm react-router-dom

Two packages that come with react-router-dom:
1. Loaders fetch data before rendering. (link)
	1. A big advantage of loaders is that they decouple data fetching from the component rendering, thus avoiding the waterfall problem.
2. Actions handle form submissions without needing extra state. (Prevents the need for useState in simple <form> handling.)

For testing run:
npm install jsdom --save-dev (enable HTML for vitest testing)
npm install @testing-library/react @testing-library/jest-dom --save-dev (installs React testing library)
npm install @testing-library/user-event --save-dev  (installs userEvent API to simulate user interaction)

More details on the installed libraries: https://www.theodinproject.com/lessons/node-path-react-new-introduction-to-react-testing#setting-up-a-react-testing-environment

npm test App.test.jsx  (to run a test)

npx prettier --write .   (command to auto fix format and spacing issues)
npx eslint . --fix       (command to auto fix inaccurate syntax)  
npx eslint .             (command to just check errors)

Make sure to have React Extension in Browser: https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en for debugging

Installed Vitest using: https://www.robinwieruch.de/vitest-react-testing-library/  (Assuming Vite is setup as well)

Vite → A super-fast build tool for modern web apps (replaces Webpack).
Vitest → A testing framework designed for Vite projects (alternative to Jest).

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
