cd client ไปยังโปรเจคหลักเรา
1. ลบ node_module(ไม่มีก็ข้ามขั้นตอน เพราะยังไม่ได้ติดตั้ง nodejs)
npm install
npm i
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
ใส่โค้ดนี้ที่หน้า  tailwindcss.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js, jxs, tsx, ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
----------------
ใส่นี้ที่ไฟล์ postcss').config.js เพื่อเรียกใช้
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
----------------
ใส่โค้ดนี่ในหน้า index.css หรือหน้า เมนของ css
@tailwind base;
@tailwind components;
@tailwind utilities;
----------------
npm i react-router-dom react-icons
npm run dev
----------------
cd.. ให้มาหน้าsparktech-youtube
npm i concurrently
แก้ start to dev ในหน้า package.json เพื่อให้ run dev แล้วใช้พวกคำสั่ง นี่ในคำสั่งเดียว(   "dev": "concurrently \"cd client && npm run dev\" \"cd server && npm run dev\" " )
----------------------------------------- server--------------------------------------------ทำหน้า server
npm install mongoose
cd..
npm init -y
cd server
npm i express mongoose dotenv
npm install -D nodemon
npm start
npm i jsonwebtoken ในหน้า controllers import jwt from 'jsonwebtoken'
npm install passport-google-oauth20 express-session passport axios
