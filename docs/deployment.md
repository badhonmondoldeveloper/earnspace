# EarnSpace — Production Deployment Architecture

## Deployment Strategy
- Primary Cloud: Vercel Production (`npx vercel --prod --yes`).
- Database: Supabase PostgreSQL (Port 6543 Tx Pooler with SSL).
- Secondary Platform Support: cPanel Node.js / Custom VPS container deployment compatible (`npm run build` -> `npm start`).
