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
├── README.md                   # Project documentation (setup, usage, etc.)
├── apphosting.yaml             # Configuration for app hosting (e.g., Google App Engine)
├── eslint.config.js            # ESLint configuration for linting JavaScript/React
├── firebase.js                 # Firebase setup (authentication, Firestore, storage)
├── firebase.json               # Firebase configuration (hosting, rewrites, functions)
├── index.html                  # Main HTML file with the root <div> for React app
├── netlify.toml                # Netlify deployment configuration
├── package-lock.json           # Auto-generated file for package dependencies (do not edit)
├── package.json                # Project metadata, dependencies, and scripts
├── postcss.config.js           # PostCSS configuration (for Tailwind and other CSS processing)
├── public                      # Public assets (not processed by Vite)
│   ├── index.html              # Public index file (for static hosting fallbacks)
│   └── vite.svg                # Example static asset (publicly accessible)
├── src                         # Source code for the application
│   ├── App.jsx                 # Main React component defining the app’s routes/layout
│   ├── Layout.jsx              # Layout wrapper for pages (e.g., header, footer, sidebar)
│   ├── assets/                 # Static assets (images, icons, videos)
│   ├── auth/                   # Authentication-related components
│   │   ├── AuthProvider.jsx            # Provides authentication context to the app
│   │   ├── FirebaseAuth.jsx            # Handles Firebase authentication
│   │   ├── FirebaseForgotPassword.jsx  # Component for password recovery
│   │   ├── FirebaseLogin.jsx           # Login form using Firebase authentication
│   │   └── FirebaseRegister.jsx        # Registration form using Firebase authentication
│   ├── components/             # Reusable UI components and feature modules
│   │   ├── Diary/              # Components related to the food diary feature
│   │   ├── calorie-tracker/    # Components for calorie tracking
│   │   ├── ean-logging/        # Components for logging products via barcode scanning
│   │   ├── ean-scan/           # Barcode scanner components
│   │   ├── footer/             # Footer component
│   │   ├── header/             # Header component
│   │   ├── product/            # Components related to product handling
│   │   ├── profile/            # Profile-related components
│   │   ├── recepies/           # Components for recipes and meal tracking
│   │   ├── water/              # Components for water intake logging
│   │   └── weight-tracker/     # Components for tracking weight
│   ├── context/                # React Context API for global state management
│   │   ├── authContext.js      # Authentication context for managing user state
│   │   └── contextexample.js   # Placeholder/example context file
│   ├── hooks/                  # Custom React hooks
│   │   ├── useDebounce.js      # Hook for debouncing input (e.g., search input delay)
│   │   ├── useFetch.js         # Custom hook for fetching data
│   │   ├── useLogProducts.js   # Hook for logging product entries
│   │   ├── useLogRecepies.js   # Hook for logging recipes
│   │   ├── useProductSearch.js # Hook for searching products
│   │   └── useTodaysCalories.js# Hook for calculating daily calorie intake
│   ├── main.css                # Global styles (Tailwind imported here)
│   ├── main.jsx                # Entry point (renders <App /> and configures React Router)
│   ├── pages/                  # Page-level components for routing
│   │   ├── Diary.jsx           # Diary page component
│   │   ├── Home.jsx            # Home page component
│   │   ├── Profile.jsx         # User profile page component
│   │   └── Recipes.jsx         # Recipes page component
│   ├── stores/                 # State management using store-based approach
│   │   ├── calorieStore.js     # Stores calorie tracking state
│   │   ├── macroStore.js       # Stores macro goals state
│   │   ├── waterStore.js       # Stores water intake state
│   │   └── weightStore.js      # Stores weight tracking state
│   └── utils/                  # Utility/helper functions
│       ├── calculateCaloriesFromFoodLogs.js  # Calculates total calories from logs
│       ├── foodLogs.js         # Handles food log operations
│       ├── getLatestWeight.js  # Retrieves latest recorded weight
│       ├── getRecommendedMacros.js # Generates recommended macros based on goals
│       └── setDefaultMacros.js # Sets default macro goals
├── storage.rules               # Firebase storage security rules
├── tailwind.config.js          # Tailwind CSS configuration
└── vite.config.js              # Vite configuration (plugins, aliasing, server settings)
```

## Additional Information
To get a nice file overview run this in bash terminal:
```
npx tree-node-cli -L 2 -I "node_modules"
```
-L is amount of lines shown in tree
-I means ignore
