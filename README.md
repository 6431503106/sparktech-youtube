##.env## 

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


npm run dev 
ติดตั้งตัวนี้ npm install -g concurrently (ทั้ง client และ server)
