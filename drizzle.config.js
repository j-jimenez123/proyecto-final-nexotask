const config = {
  schema: "./db/schema.js",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "data/nexotask.db",
  },
};

export default config;
