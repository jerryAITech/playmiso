import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function getDatabaseUrl(): string {
  // On Vercel / Linux Serverless Lambdas
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    try {
      const tmpDbPath = '/tmp/dev.db';

      if (!fs.existsSync(tmpDbPath)) {
        const possibleSourcePaths = [
          path.join(process.cwd(), 'prisma', 'dev.db'),
          path.join(process.cwd(), 'dev.db'),
          path.resolve('./prisma/dev.db'),
          '/var/task/prisma/dev.db',
          '/var/task/dev.db',
        ];

        for (const src of possibleSourcePaths) {
          if (fs.existsSync(src)) {
            try {
              fs.copyFileSync(src, tmpDbPath);
              fs.chmodSync(tmpDbPath, 0o666);
              break;
            } catch {}
          }
        }
      }

      return `file:${tmpDbPath}`;
    } catch (e) {
      console.error('Error preparing SQLite in /tmp:', e);
      return 'file:/tmp/dev.db';
    }
  }

  // Local development
  let url = process.env.DATABASE_URL || 'file:./prisma/dev.db';
  if (!url.startsWith('file:')) {
    url = `file:${url}`;
  }

  return url;
}

const activeDbUrl = getDatabaseUrl();

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: activeDbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
