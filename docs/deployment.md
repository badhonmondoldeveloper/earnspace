# EarnSpace Production Deployment Guide

## Overview
This document outlines production deployment strategies for both Vercel and cPanel / Node.js VPS environments.

---

## Environment 1: Vercel Staging & Production
1. Connect Git repository to Vercel.
2. Set Environment Variables (`DATABASE_URL`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, `NEXT_PUBLIC_APP_URL`).
3. Build Command: `npx prisma generate && next build`.
4. Output Directory: `.next`.

---

## Environment 2: cPanel / VPS Node.js Server
1. Clone codebase to target directory: `/home/user/earnspace`.
2. Install dependencies: `npm install --production=false`.
3. Generate Prisma Client & Build:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run build
   ```
4. Configure PM2 process manager:
   ```bash
   pm2 start npm --name "earnspace" -- start
   pm2 save
   ```
5. Set up Nginx / Apache reverse proxy to port `3000` with SSL certificate.

