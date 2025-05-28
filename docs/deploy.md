# Deployment Guide

## 📦 Docker Build

```bash
docker build -t photography-api .
docker run -p 5000:5000 --env-file .env photography-api
```

## 🔁 CI/CD with GitHub Actions

- Auto-runs `npm test` on every push to main
- File: `.github/workflows/ci.yml`

## 🌍 Hosting Options

- Render
- Railway
- AWS EC2 + PM2
- Serverless with AWS Lambda + API Gateway