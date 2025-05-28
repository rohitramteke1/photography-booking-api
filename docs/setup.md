# 🛠 Setup Instructions

## 1. 📦 Clone Repository

Clone the repository using the following command:

```bash
git clone https://github.com/your-org/photography-api.git
cd photography-api
```

---

## 2. 📁 Install Dependencies

Install all required packages:

```bash
npm install
```

---

## 3. ⚙️ Setup Environment Variables

Create a `.env` file in the root directory and add the following configuration:

```env
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1d

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_GOOGLE_SUCCESS_URL=http://localhost:5173/auth/success

# Frontend Origin
FRONTEND_URL=http://localhost:5173

# Admin Credentials
ADMIN_EMAIL_1=
ADMIN_EMAIL_2=
ADMIN_EMAIL_3=
ADMIN_PASSWORD_1=
ADMIN_PASSWORD_2=
ADMIN_PASSWORD_3=

# AWS Credentials
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1

# DynamoDB Tables
DYNAMODB_TABLE=PhotographyUsers
DYNAMODB_BOOKINGS_TABLE=Bookings
PHOTOGRAPHY_SERVICES_TABLE=PhotographyServices
ADDITIONAL_SERVICES_TABLE=AdditionalServices
AWS_DYNAMODB_TABLE_NAME=PhotographyUsers

# S3
AWS_S3_BUCKET_NAME=
```

---

## 4. 🚀 Run App Locally

Start the development server:

```bash
npm run dev
```

Visit the following URL to access Swagger API documentation:

- [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
