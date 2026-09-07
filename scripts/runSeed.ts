import { DbInitService } from '../src/services/dbInitService';

async function main() {
  console.log('Running database seed script...');
  const res = await DbInitService.initializeDatabase();
  console.log('Seed Output:', res);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed Failed:', err);
  process.exit(1);
});
