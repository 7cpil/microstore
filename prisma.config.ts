import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_zq08mkTicEGb@ep-withered-flower-as1oay0c-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require",
  },
});
