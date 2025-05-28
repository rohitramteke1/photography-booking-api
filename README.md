# 📸 Photography Booking API

This project is a **serverless-ready, full-featured backend** built with Node.js and DynamoDB for a modern photography service booking platform.

---

## 🔥 Features at a Glance

✅ JWT-based Authentication  
✅ Google OAuth for Admins  
✅ Booking Flow with Price Estimator  
✅ Service & Photographer Listings  
✅ Role-based Access Control  
✅ Admin Analytics Dashboard  
✅ Swagger UI Docs + Postman Collection  
✅ Dockerized for Local & Cloud  
✅ CI/CD with GitHub Actions  
✅ Built on AWS SDK + DynamoDB (NoSQL)

---

## 📂 Project Structure

```
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── docs/
│   ├── tests/
│   └── app.js
├── Dockerfile
├── .env.example
├── README.md
├── swagger.json
└── .github/workflows/ci.yml
```

---

## 🧪 Testing

We use **Jest + Supertest** for full API coverage.

```bash
npm test
```

---

## 📊 API Tools

- Swagger Docs: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- Postman Collection: [`/src/docs/postman_collection.json`](src/docs/postman_collection.json)

---

## 👤 Roles

| Role     | Permissions                          |
|----------|--------------------------------------|
| `user`   | View & book services                 |
| `admin`  | Manage users, bookings, services     |

---

## 🔒 Auth Strategy

- **JWT** for user login
- **Google OAuth** for admin-only access
- **Secure cookies** for token storage

---

## 🌐 AWS Services Used

- **DynamoDB** – NoSQL storage
- **S3** – Media storage (optional)
- **AWS SDK v3** – SDK for DynamoDB access