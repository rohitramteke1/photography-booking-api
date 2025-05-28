# 🚀 Backend Deployment to AWS Lambda (ZIP Method)

This guide helps you deploy your Express.js backend (Node.js v22.x) to AWS Lambda using a `.zip` upload.

---

## 📁 Project Structure (Expected)
```
project-root/
│
├── lambda.js          # Lambda entry point
├── server.js          # Local dev only
├── package.json
├── node_modules/
├── src/
│   └── app.js         # Express app exported from here
```

---

## 🔧 Step 1: Prepare Code for Lambda

### ✅ 1. `src/app.js`
Ensure it **exports** the app:
```js
import express from 'express';
const app = express();

// routes and middleware here...

export default app;
```

---

### ✅ 2. `lambda.js` (at root level)
```js
import awsServerlessExpress from 'aws-serverless-express';
import app from './src/app.js';

const server = awsServerlessExpress.createServer(app);

export const handler = (event, context) => {
  return awsServerlessExpress.proxy(server, event, context);
};
```

---

## 📦 Step 2: Install Required Package

Install serverless adapter:
```bash
npm install aws-serverless-express
```

---

## 📦 Step 3: Create Deployment ZIP

If you're using **PowerShell** on Windows, run:
```powershell
Compress-Archive -Path * -DestinationPath deployment.zip -Force
```

> You can also zip via right-click → "Send to Compressed (zipped) folder".

---

## ☁️ Step 4: Create Lambda Function

1. Go to AWS Lambda → Create function → "Author from scratch"
2. Function name: `photo-backend`
3. Runtime: `Node.js 22.x`
4. Architecture: `x86_64`
5. Execution Role: Create new role with basic Lambda permissions

---

## 📁 Step 5: Upload ZIP

1. Scroll to "Code source" section
2. Click **Upload from** → `.zip file`
3. Choose `deployment.zip`
4. Set **Handler** to:
```
lambda.handler
```

---

## 🌐 Step 6: Add API Gateway Trigger

1. Click "Add trigger"
2. Select: `API Gateway`
3. API type: `HTTP API`
4. Integration: Lambda Function
5. Route: `ANY /{proxy+}`

---

## ✅ Step 7: Test Deployed Endpoint

Access your API:
```
https://<your-api-id>.execute-api.<region>.amazonaws.com/<route>
```

You can test all routes like:
```
GET https://.../api/users/get-users
POST https://.../api/users/create-user
```

---

## ✅ You're Done!

Your Express backend is now live on AWS Lambda 🚀