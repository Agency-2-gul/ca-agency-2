module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['standard', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'prettier'],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.js'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
        // Customize rules as per your project's needs
    },
    settings: {
        react: {
            version: 'detect', // Automatically includes the React version
        },
    },
};