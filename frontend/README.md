# React + Vite

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
