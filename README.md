##.env## ในโฟเดอร์ server
-------------------------
PORT = 5000
NODE_ENV = development
MONGODB_URI = mongodb+srv://selabmongodb:selabmongodbpassword@cluster0.wmpt0uv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET = abc123def456
SESSION_SECRET = abc123def456
CLIENT_URL = http://localhost:3000

GOOGLE_CLIENT_ID = 151746761263-4sftjr5gn53lka0nd5dc6thbrdgmn8qb.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = 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

STRIPE_SECRET_KEY = your-stripe-secret-key

EMAIL_HOST = sandbox.smtp.mailtrap.io
EMAIL_PORT = 587
EMAIL_USERNAME = a36f160a343126
EMAIL_PASSWORD = 3135f7a5b8c933


npm run dev ต้องติดตั้งพวกนี่เพื่อรัน
ติดตั้ง 
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
npm install react-modal 
npm install @mui/material //เพิ่มมาใหม่
npm install @emotion/styled //เพิ่มมาใหม่
npm run dev
----------------
cd.. ให้มาหน้าsparktech-youtube
npm i concurrently
แก้ start to dev ในหน้า package.json เพื่อให้ run dev แล้วใช้พวกคำสั่ง นี่ในคำสั่งเดียว(   "dev": "concurrently \"cd client && npm run dev\" \"cd server && npm run dev\" " )

----------------------------------------- server--------------------------------------------ทำหน้า server
npm install mongoose
cd.. ไปยังหน้าหลัก
npm init -y
cd server
npm i npm i bcryptjs
npm i express mongoose dotenv
npm install -D nodemon
npm start
npm i jsonwebtoken แล้วเพิ่มในหน้า controllers (import jwt from 'jsonwebtoken') เพื่อเรียกใช้
npm install passport-google-oauth20 express-session passport axios
npm install uuid //เพิ่มมาเพิ่อจัดการ id
