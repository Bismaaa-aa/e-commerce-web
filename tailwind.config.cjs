/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class", // <--- add this line
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            keyframes: {
                float1: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
                float2: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-15px)' } },
                float3: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-25px)' } },
                float4: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-18px)' } },
            },
            animation: {
                float1: 'float1 4s ease-in-out infinite',
                float2: 'float2 5s ease-in-out infinite',
                float3: 'float3 6s ease-in-out infinite',
                float4: 'float4 4.5s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};
