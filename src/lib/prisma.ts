import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Handle SQLite in Vercel Serverless environment
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  try {
    const tmpDbPath = '/tmp/dev.db';
    if (!fs.existsSync(tmpDbPath)) {
      // Find source dev.db in project
      const possibleSourcePaths = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.resolve('./prisma/dev.db'),
      ];

      for (const src of possibleSourcePaths) {
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, tmpDbPath);
          break;
        }
      }
    }

    if (!process.env.DATABASE_URL) {
      process.env.DATABASE_URL = `file:${tmpDbPath}`;
    }
  } catch (e) {
    console.error('Error preparing SQLite in serverless:', e);
  }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
