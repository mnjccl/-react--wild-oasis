LIVE DEMO HERE: https://react-wild-oasis-ten.vercel.app
Wild Oasis is hotel management application designed specifically for hotel staff. The app provides employees with tools to manage bookings, check-ins, check-outs and monitor occupancy rates. Only authorized hotel employees have access to the app and create other users. App is built using React and libraries like React Query, React Error Boundary, React Hook Form, React Hot Toast, React Icons, React Router and ReCharts. Styling is handled using styled-components library and backend is powered by Supabase. FOR DEMO PURPOSES, USERS CAN LOG IN WITH A TEST ACCOUNT (test@gmail.com, password: 11111111). BEFORE TESTING, CLICK THE UPLOADER BUTTON IN THE BOTTOM-RIGHT CORNER TO POPULATE THE DATABASE WITH MOCK DATA, THEN REFRESH THE PAGE TO START USING APP.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
