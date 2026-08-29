import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function getDatabaseUrl(): string {
  // If an external cloud database is configured (e.g. Postgres / Turso)
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  // On Vercel / Production Linux Serverless
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    try {
      const tmpDbPath = '/tmp/dev.db';

      // Always ensure /tmp/dev.db exists and is writable
      if (!fs.existsSync(tmpDbPath)) {
        const possibleSourcePaths = [
          path.join(process.cwd(), 'prisma', 'dev.db'),
          path.join(process.cwd(), 'dev.db'),
          path.resolve('./prisma/dev.db'),
          '/var/task/prisma/dev.db',
        ];

        for (const src of possibleSourcePaths) {
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, tmpDbPath);
            try {
              fs.chmodSync(tmpDbPath, 0o666);
            } catch {}
            break;
          }
        }
      }

      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (e) {
      console.error('Error preparing SQLite in /tmp:', e);
    }
  }

  return process.env.DATABASE_URL || 'file:./dev.db';
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
