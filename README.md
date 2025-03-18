# AGENCY-2-CA

## Initialize

```
npm install
```

## Run locally

```
npm run dev
```

## Project structure

```
ca-agency-2
├── README.md                # Project documentation (setup, usage, etc.)
├── eslint.config.js         # ESLint configuration for linting JavaScript/React
├── index.html               # Main HTML file with the root <div> for React app
├── package-lock.json        # Auto-generated file for package dependencies (do not edit)
├── package.json             # Project metadata, dependencies, and scripts
├── postcss.config.js        # PostCSS configuration (for Tailwind and other CSS processing)
├── public                   # Public assets (not processed by Vite)
│   └── vite.svg             # Example static asset (publicly accessible)
├── src                      # Source code for the application
│   ├── App.jsx              # Main React component defining the app’s routes/layout
│   ├── Layout.jsx           # Layout wrapper for pages (e.g., header, footer, sidebar)
│   ├── assets/              # Static assets (images, fonts, icons, etc.)
│   ├── components/          # Reusable UI components (buttons, cards, modals, etc.)
│   ├── context/             # React Context API for global state management
│   ├── hooks/               # Custom React hooks (e.g., useAuth, useFetch, useTheme)
│   ├── main.css             # Global styles (Tailwind imported here)
│   ├── main.jsx             # Entry point (renders <App /> and configures React Router)
│   ├── pages/               # Page-level components used for routing
│   ├── utilities/           # Helper functions/utilities (formatters, API calls, etc.)
├── tailwind.config.js       # Tailwind CSS configuration
└── vite.config.js           # Vite configuration (plugins, aliasing, server settings)
```

## Additional Information
To get a nice file overview run this in bash terminal:
```
npx tree-node-cli -L 2 -I "node_modules"
```
-L is amount of lines shown in tree
-I means ignore
