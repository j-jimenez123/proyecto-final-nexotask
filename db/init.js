export function initDatabase(sqlite) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      title text NOT NULL,
      description text DEFAULT '',
      priority text DEFAULT 'media' NOT NULL,
      due_date text DEFAULT '',
      due_time text DEFAULT '',
      completed integer DEFAULT false NOT NULL,
      user_id text NOT NULL,
      created_at integer NOT NULL,
      updated_at integer NOT NULL
    );
  `);

  try {
    sqlite.exec("ALTER TABLE tasks ADD COLUMN due_time text DEFAULT '';");
  } catch (error) {
    // La columna ya existe en bases que han sido migradas antes.
  }

  try {
    sqlite.exec("ALTER TABLE tasks ADD COLUMN due_date text DEFAULT '';");
  } catch (error) {
    // La columna ya existe en bases que han sido migradas antes.
  }

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id text NOT NULL PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL UNIQUE,
      emailVerified integer NOT NULL,
      image text,
      createdAt date NOT NULL,
      updatedAt date NOT NULL
    );

    CREATE TABLE IF NOT EXISTS session (
      id text NOT NULL PRIMARY KEY,
      expiresAt date NOT NULL,
      token text NOT NULL UNIQUE,
      createdAt date NOT NULL,
      updatedAt date NOT NULL,
      ipAddress text,
      userAgent text,
      userId text NOT NULL REFERENCES user (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS account (
      id text NOT NULL PRIMARY KEY,
      accountId text NOT NULL,
      providerId text NOT NULL,
      userId text NOT NULL REFERENCES user (id) ON DELETE CASCADE,
      accessToken text,
      refreshToken text,
      idToken text,
      accessTokenExpiresAt date,
      refreshTokenExpiresAt date,
      scope text,
      password text,
      createdAt date NOT NULL,
      updatedAt date NOT NULL
    );

    CREATE TABLE IF NOT EXISTS verification (
      id text NOT NULL PRIMARY KEY,
      identifier text NOT NULL,
      value text NOT NULL,
      expiresAt date NOT NULL,
      createdAt date NOT NULL,
      updatedAt date NOT NULL
    );
  `);
}
