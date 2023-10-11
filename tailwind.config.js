/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/app/commons/sidebar-admin/*.{html,ts}",
        "./src/app/commons/sidebar-dashboard/*.{html,ts}",
        "./src/app/dashboard/*.{html,ts}",
        "./src/app/dashboard/dashboard-components/topcards-estudio/*.{html,ts}",
        "./src/app/pages/estudio/*.{html,ts}",
        "./src/app/pages/usuarios/*.{html,ts}",
        "./src/app/pages/usuario/*.{html,ts}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}