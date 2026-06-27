import Database from 'better-sqlite3';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export interface Inspector {
  id: number;
  fullName: string;
  login: string;
  password?: string;
  district: string;
  status: string;
  solved: number;
  active: number;
  responseTime: string;
  createdAt?: string;
}

export interface BotUser {
  id: number;
  userId: string;
  telegramId: string;
  username?: string;
  fullName?: string;
  phone?: string;
  region?: string;
  district?: string;
  mahalla?: string;
  latitude?: string;
  longitude?: string;
  status: string;
  reportsSubmitted: number;
  lastActive?: string;
  createdAt?: string;
}

export interface IncidentDb {
  id: number;
  incidentId: string;
  botUserId?: number | null;
  type?: string;
  content?: string;
  description?: string;
  region?: string;
  district?: string;
  mahalla?: string;
  latitude?: string;
  longitude?: string;
  status: string;
  assignedTo?: number | null;
  inspector?: string;
  aiRiskScore?: number;
  aiConfidence?: number;
  aiDetectedKeywords?: string[];
  aiRecommendation?: string;
  createdAt?: string;
  
  // joined fields
  reporterName?: string;
  reporterPhone?: string;
  reporterId?: string;
}

// Convert row from DB to API format
function mapRow(row: any): Inspector {
  return {
    id: row.id,
    fullName: row.full_name,
    login: row.login,
    password: row.password,
    district: row.district || "Guliston Shahri",
    status: row.status || "ONLINE",
    solved: row.solved !== null && row.solved !== undefined ? Number(row.solved) : 0,
    active: row.active !== null && row.active !== undefined ? Number(row.active) : 0,
    responseTime: row.response_time || "0.0 m",
    createdAt: row.created_at ? String(row.created_at) : undefined
  };
}

function mapBotUserRow(row: any): BotUser {
  return {
    id: row.id,
    userId: row.user_id,
    telegramId: row.telegram_id,
    username: row.username || undefined,
    fullName: row.full_name || undefined,
    phone: row.phone || undefined,
    region: row.region || undefined,
    district: row.district || undefined,
    mahalla: row.mahalla || undefined,
    latitude: row.latitude || undefined,
    longitude: row.longitude || undefined,
    status: row.status || "REGISTERED",
    reportsSubmitted: row.reports_submitted !== null && row.reports_submitted !== undefined ? Number(row.reports_submitted) : 0,
    lastActive: row.last_active ? String(row.last_active) : undefined,
    createdAt: row.created_at ? String(row.created_at) : undefined
  };
}

function mapIncidentRow(row: any): IncidentDb {
  let keywords: string[] = [];
  if (row.ai_detected_keywords) {
    if (typeof row.ai_detected_keywords === 'string') {
      try {
        keywords = JSON.parse(row.ai_detected_keywords);
      } catch (e) {
        keywords = [];
      }
    } else if (Array.isArray(row.ai_detected_keywords)) {
      keywords = row.ai_detected_keywords;
    }
  }
  return {
    id: row.id,
    incidentId: row.incident_id,
    botUserId: row.bot_user_id !== null ? Number(row.bot_user_id) : null,
    type: row.type || undefined,
    content: row.content || undefined,
    description: row.description || undefined,
    region: row.region || undefined,
    district: row.district || undefined,
    mahalla: row.mahalla || undefined,
    latitude: row.latitude || undefined,
    longitude: row.longitude || undefined,
    status: row.status || "NEW",
    assignedTo: row.assigned_to !== null ? Number(row.assigned_to) : null,
    inspector: row.inspector || undefined,
    aiRiskScore: row.ai_risk_score !== null && row.ai_risk_score !== undefined ? Number(row.ai_risk_score) : undefined,
    aiConfidence: row.ai_confidence !== null && row.ai_confidence !== undefined ? Number(row.ai_confidence) : undefined,
    aiDetectedKeywords: keywords,
    aiRecommendation: row.ai_recommendation || undefined,
    createdAt: row.created_at ? String(row.created_at) : undefined,
    reporterName: row.reportername || row.reporterName || undefined,
    reporterPhone: row.reporterphone || row.reporterPhone || undefined,
    reporterId: row.reporterid || row.reporterId || undefined
  };
}

let usePostgres = false;
let pgPool: Pool | null = null;
let sqliteDbInstance: Database.Database | null = null;
let isInitialized = false;
let initPromise: Promise<void> | null = null;

const hasPgConfig = !!(
  process.env.SQL_HOST ||
  process.env.DATABASE_URL
);

if (hasPgConfig) {
  try {
    const config: any = {
      connectionTimeoutMillis: 5000,
    };
    if (process.env.DATABASE_URL) {
      config.connectionString = process.env.DATABASE_URL;
    } else {
      config.host = process.env.SQL_HOST;
      config.user = process.env.SQL_USER;
      config.password = process.env.SQL_PASSWORD;
      config.database = process.env.SQL_DB_NAME;
      config.port = process.env.SQL_PORT ? Number(process.env.SQL_PORT) : 5432;
    }
    pgPool = new Pool(config);
  } catch (err) {
    console.error("SQLiteDB: Failed to instantiate PG pool:", err);
  }
}

function initializeSqlite() {
  if (sqliteDbInstance) return;
  const dbPath = path.join(process.cwd(), 'inspectors.db');
  sqliteDbInstance = new Database(dbPath);

  sqliteDbInstance.exec(`
    CREATE TABLE IF NOT EXISTS inspectors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      login TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      district TEXT,
      status TEXT DEFAULT 'ONLINE',
      solved INTEGER DEFAULT 0,
      active INTEGER DEFAULT 0,
      response_time TEXT DEFAULT '0.0 m',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bot_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      telegram_id TEXT NOT NULL UNIQUE,
      username TEXT,
      full_name TEXT,
      phone TEXT,
      region TEXT,
      district TEXT,
      mahalla TEXT,
      latitude TEXT,
      longitude TEXT,
      status TEXT DEFAULT 'REGISTERED',
      reports_submitted INTEGER DEFAULT 0,
      last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      incident_id TEXT NOT NULL UNIQUE,
      bot_user_id INTEGER,
      type TEXT,
      content TEXT,
      description TEXT,
      region TEXT,
      district TEXT,
      mahalla TEXT,
      latitude TEXT,
      longitude TEXT,
      status TEXT DEFAULT 'NEW',
      assigned_to INTEGER,
      inspector TEXT,
      ai_risk_score INTEGER,
      ai_confidence INTEGER,
      ai_detected_keywords TEXT,
      ai_recommendation TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(bot_user_id) REFERENCES bot_users(id)
    );
  `);

  // Insert default inspectors
  const countRow = sqliteDbInstance.prepare('SELECT COUNT(*) as count FROM inspectors').get() as { count: number };
  if (countRow.count === 0) {
    const insertStmt = sqliteDbInstance.prepare(`
      INSERT INTO inspectors (full_name, login, password, district, status, solved, active, response_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertStmt.run("Kpt. Muxiddin", "mm", "123456", "Guliston Shahri", "ONLINE", 12, 2, "3.5 m");
    insertStmt.run("Kpt. Muxiddin", "as", "123456", "Sirdaryo Tumani", "ONLINE", 8, 1, "4.2 m");
    insertStmt.run("Sardor Xovosov", "sardor", "123456", "Xovos Tumani", "ONLINE", 5, 0, "5.0 m");
  }

  // Insert default bot users
  const countBotUsers = sqliteDbInstance.prepare('SELECT COUNT(*) as count FROM bot_users').get() as { count: number };
  if (countBotUsers.count === 0) {
    const insertUser = sqliteDbInstance.prepare(`
      INSERT INTO bot_users (user_id, telegram_id, username, full_name, phone, region, district, mahalla, status, reports_submitted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertUser.run("VOL-440", "598471203", "sherzod_kiber", "Sherzodbek Aslanov", "+998901234567", "Sirdaryo viloyati", "Guliston shahri", "Istiqlol", "REGISTERED", 42);
    insertUser.run("VOL-215", "612440952", "laylo_q", "Laylo Qodirova", "+998912345678", "Sirdaryo viloyati", "Sirdaryo tumani", "Bahor", "REGISTERED", 19);
    insertUser.run("VOL-119", "471109401", "jahongir_cybersec", "Jahongir To'rayev", "+998933456789", "Sirdaryo viloyati", "Yangiyer shahri", "Tinchlik", "REGISTERED", 25);
    insertUser.run("VOL-502", "704812390", "maftuna_cyber", "Maftuna Sobirova", "+998944567890", "Sirdaryo viloyati", "Boyovut tumani", "Yuksalish", "REGISTERED", 56);
    insertUser.run("VOL-089", "550184291", "farrux_z", "Farrux Ziyoyev", "+998995678901", "Sirdaryo viloyati", "Xovos tumani", "Vatan", "REGISTERED", 5);
  }

  // Insert default incidents
  const countIncidents = sqliteDbInstance.prepare('SELECT COUNT(*) as count FROM incidents').get() as { count: number };
  if (countIncidents.count === 0) {
    const usersList = sqliteDbInstance.prepare('SELECT id, user_id FROM bot_users').all() as { id: number, user_id: string }[];
    const userMap = new Map<string, number>();
    usersList.forEach(u => userMap.set(u.user_id, u.id));

    const insertInc = sqliteDbInstance.prepare(`
      INSERT INTO incidents (
        incident_id, bot_user_id, type, content, description, region, district, status, inspector, ai_risk_score, ai_confidence, ai_detected_keywords, ai_recommendation, latitude, longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertInc.run(
      "INC-4821",
      userMap.get("VOL-440") || null,
      "KANAL",
      "@sirdaryo_dori_reklama",
      "Kanalda noqonuniy dori va psixotrop moddalarning narxlari va manzillari ko'rsatilgan matn va koordinatali rasmlar tarqatilgan. Iltimos buni tezroq tekshirib bloklang.",
      "Sirdaryo viloyati",
      "Guliston Shahri",
      "Blocked",
      "Kpt. Safarov M.",
      98,
      95,
      JSON.stringify(["dori", "psixotrop", "savdo", "reklama"]),
      "CRITICAL",
      "40.4984",
      "68.7011"
    );

    insertInc.run(
      "INC-4818",
      userMap.get("VOL-215") || null,
      "SAYT",
      "https://click-bonus-uz.com",
      "Click to'lov tizimining soxta interfeysi orqali foydalanuvchilarning plastik karta ma'lumotlarini (SMS kod, karta raqami) o'g'irlash harakati.",
      "Sirdaryo viloyati",
      "Sirdaryo Tumani",
      "Evidence Uploaded",
      "Ltn. Alimov F.",
      88,
      90,
      JSON.stringify(["click", "bonus", "fishing", "karta", "sms"]),
      "HIGH",
      "40.8432",
      "68.6621"
    );

    insertInc.run(
      "INC-4810",
      userMap.get("VOL-119") || null,
      "APK",
      "TezkorInternet.apk",
      "Internet tezligini oshirishni va'da qiluvchi soxta ilova. O'rnatilgach SMS xabarlarni o'g'irlab maxfiy serverga yo'naltiradi.",
      "Sirdaryo viloyati",
      "Yangiyer Shahri",
      "Resolved",
      "Kpt. Yo'ldoshev S.",
      95,
      99,
      JSON.stringify(["apk", "troyan", "sms", "virus", "internet"]),
      "CRITICAL",
      "40.2642",
      "68.8140"
    );

    insertInc.run(
      "INC-4802",
      userMap.get("VOL-502") || null,
      "BOT",
      "@pul_yutug_bot",
      "Prezident nomidan kompensatsiya puli tarqatishni va'da qilib, odamlardan guruhlarga odam qo'shishni va karta raqamini kiritishni talab qiladi.",
      "Sirdaryo viloyati",
      "Boyovut Tumani",
      "Investigating",
      "Kpt. Qodirov J.",
      65,
      85,
      JSON.stringify(["bot", "pul", "kompensatsiya", "karta"]),
      "MEDIUM",
      "40.4312",
      "68.9912"
    );

    insertInc.run(
      "INC-4795",
      userMap.get("VOL-089") || null,
      "SAYT",
      "comp-verify@gov-uz.org",
      "Xizmat pochtalariga kompensatsiya olish uchun ariza topshirish so'ralgan soxta hukumat ssilkasi.",
      "Sirdaryo viloyati",
      "Xovos Tumani",
      "Accepted",
      "Ltn. Karimov A.",
      78,
      80,
      JSON.stringify(["mail", "phishing", "gov", "kompensatsiya"]),
      "HIGH",
      "39.9012",
      "68.6721"
    );
  }
}

async function initializePostgresTables() {
  if (!pgPool) return;
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS inspectors (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      login TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      district TEXT,
      status TEXT DEFAULT 'ONLINE',
      solved INTEGER DEFAULT 0,
      active INTEGER DEFAULT 0,
      response_time TEXT DEFAULT '0.0 m',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bot_users (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      telegram_id TEXT NOT NULL UNIQUE,
      username TEXT,
      full_name TEXT,
      phone TEXT,
      region TEXT,
      district TEXT,
      mahalla TEXT,
      latitude TEXT,
      longitude TEXT,
      status TEXT DEFAULT 'REGISTERED',
      reports_submitted INTEGER DEFAULT 0,
      last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id SERIAL PRIMARY KEY,
      incident_id TEXT NOT NULL UNIQUE,
      bot_user_id INTEGER REFERENCES bot_users(id),
      type TEXT,
      content TEXT,
      description TEXT,
      region TEXT,
      district TEXT,
      mahalla TEXT,
      latitude TEXT,
      longitude TEXT,
      status TEXT DEFAULT 'NEW',
      assigned_to INTEGER,
      inspector TEXT,
      ai_risk_score INTEGER,
      ai_confidence INTEGER,
      ai_detected_keywords TEXT,
      ai_recommendation TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const inspectCountRes = await pgPool.query('SELECT COUNT(*) as count FROM inspectors');
  if (parseInt(inspectCountRes.rows[0].count) === 0) {
    await pgPool.query(`
      INSERT INTO inspectors (full_name, login, password, district, status, solved, active, response_time)
      VALUES 
      ('Kpt. Muxiddin', 'mm', '123456', 'Guliston Shahri', 'ONLINE', 12, 2, '3.5 m'),
      ('Kpt. Muxiddin', 'as', '123456', 'Sirdaryo Tumani', 'ONLINE', 8, 1, '4.2 m'),
      ('Sardor Xovosov', 'sardor', '123456', 'Xovos Tumani', 'ONLINE', 5, 0, '5.0 m')
    `);
  }

  const botUsersCountRes = await pgPool.query('SELECT COUNT(*) as count FROM bot_users');
  if (parseInt(botUsersCountRes.rows[0].count) === 0) {
    await pgPool.query(`
      INSERT INTO bot_users (user_id, telegram_id, username, full_name, phone, region, district, mahalla, status, reports_submitted)
      VALUES 
      ('VOL-440', '598471203', 'sherzod_kiber', 'Sherzodbek Aslanov', '+998901234567', 'Sirdaryo viloyati', 'Guliston shahri', 'Istiqlol', 'REGISTERED', 42),
      ('VOL-215', '612440952', 'laylo_q', 'Laylo Qodirova', '+998912345678', 'Sirdaryo viloyati', 'Sirdaryo tumani', 'Bahor', 'REGISTERED', 19),
      ('VOL-119', '471109401', 'jahongir_cybersec', 'Jahongir To''rayev', '+998933456789', 'Sirdaryo viloyati', 'Yangiyer shahri', 'Tinchlik', 'REGISTERED', 25),
      ('VOL-502', '704812390', 'maftuna_cyber', 'Maftuna Sobirova', '+998944567890', 'Sirdaryo viloyati', 'Boyovut tumani', 'Yuksalish', 'REGISTERED', 56),
      ('VOL-089', '550184291', 'farrux_z', 'Farrux Ziyoyev', '+998995678901', 'Sirdaryo viloyati', 'Xovos tumani', 'Vatan', 'REGISTERED', 5)
    `);
  }

  const incidentsCountRes = await pgPool.query('SELECT COUNT(*) as count FROM incidents');
  if (parseInt(incidentsCountRes.rows[0].count) === 0) {
    const userMapRes = await pgPool.query('SELECT id, user_id FROM bot_users');
    const userMap = new Map<string, number>();
    userMapRes.rows.forEach((row: any) => userMap.set(row.user_id, row.id));

    await pgPool.query(`
      INSERT INTO incidents (
        incident_id, bot_user_id, type, content, description, region, district, status, inspector, ai_risk_score, ai_confidence, ai_detected_keywords, ai_recommendation, latitude, longitude
      ) VALUES 
      ('INC-4821', $1, 'KANAL', '@sirdaryo_dori_reklama', 'Kanalda noqonuniy dori va psixotrop moddalarning narxlari va manzillari ko''rsatilgan matn va koordinatali rasmlar tarqatilgan. Iltimos buni tezroq tekshirib bloklang.', 'Sirdaryo viloyati', 'Guliston Shahri', 'Blocked', 'Kpt. Safarov M.', 98, 95, $2, 'CRITICAL', '40.4984', '68.7011'),
      ('INC-4818', $3, 'SAYT', 'https://click-bonus-uz.com', 'Click to''lov tizimining soxta interfeysi orqali foydalanuvchilarning plastik karta ma''lumotlarini (SMS kod, karta raqami) o''g''irlash harakati.', 'Sirdaryo viloyati', 'Sirdaryo Tumani', 'Evidence Uploaded', 'Ltn. Alimov F.', 88, 90, $4, 'HIGH', '40.8432', '68.6621'),
      ('INC-4810', $5, 'APK', 'TezkorInternet.apk', 'Internet tezligini oshirishni va''da qiluvchi soxta ilova. O''rnatilgach SMS xabarlarni o''g''irlab maxfiy serverga yo''naltiradi.', 'Sirdaryo viloyati', 'Yangiyer Shahri', 'Resolved', 'Kpt. Yo''ldoshev S.', 95, 99, $6, 'CRITICAL', '40.2642', '68.8140'),
      ('INC-4802', $7, 'BOT', '@pul_yutug_bot', 'Prezident nomidan kompensatsiya puli tarqatishni va''da qilib, odamlardan guruhlarga odam qo''shishni va karta raqamini kiritishni talab qiladi.', 'Sirdaryo viloyati', 'Boyovut Tumani', 'Investigating', 'Kpt. Qodirov J.', 65, 85, $8, 'MEDIUM', '40.4312', '68.9912'),
      ('INC-4795', $9, 'SAYT', 'comp-verify@gov-uz.org', 'Xizmat pochtalariga kompensatsiya olish uchun ariza topshirish so''ralgan soxta hukumat ssilkasi.', 'Sirdaryo viloyati', 'Xovos Tumani', 'Accepted', 'Ltn. Karimov A.', 78, 80, $10, 'HIGH', '39.9012', '68.6721')
    `, [
      userMap.get("VOL-440") || null, JSON.stringify(["dori", "psixotrop", "savdo", "reklama"]),
      userMap.get("VOL-215") || null, JSON.stringify(["click", "bonus", "fishing", "karta", "sms"]),
      userMap.get("VOL-119") || null, JSON.stringify(["apk", "troyan", "sms", "virus", "internet"]),
      userMap.get("VOL-502") || null, JSON.stringify(["bot", "pul", "kompensatsiya", "karta"]),
      userMap.get("VOL-089") || null, JSON.stringify(["mail", "phishing", "gov", "kompensatsiya"])
    ]);
  }
}

async function ensureInitialized() {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (pgPool) {
      try {
        await pgPool.query('SELECT 1');
        console.log("PostgreSQL connection successful! Using PostgreSQL as primary database.");
        usePostgres = true;
        await initializePostgresTables();
      } catch (err: any) {
        console.warn("PostgreSQL connection failed. Falling back to local SQLite database. Error:", err.message);
        usePostgres = false;
        initializeSqlite();
      }
    } else {
      console.log("PostgreSQL credentials not provided. Using local SQLite database.");
      usePostgres = false;
      initializeSqlite();
    }
    isInitialized = true;
  })();

  return initPromise;
}

// Unified query helpers that abstract sqlite vs pg
async function executeQuery(sql: string, params: any[] = []): Promise<any[]> {
  await ensureInitialized();
  if (usePostgres && pgPool) {
    try {
      const res = await pgPool.query(sql, params);
      return res.rows;
    } catch (err: any) {
      console.error("PostgreSQL query failed, falling back to local SQLite:", err.message);
    }
  }

  initializeSqlite();
  const sqliteSql = sql.replace(/\$[0-9]+/g, '?');
  try {
    const rows = sqliteDbInstance!.prepare(sqliteSql).all(...params);
    return rows;
  } catch (err) {
    console.error("SQLite query failed:", err);
    return [];
  }
}

async function executeNonQuery(sql: string, params: any[] = []): Promise<{ lastInsertRowid?: number, changes: number }> {
  await ensureInitialized();
  if (usePostgres && pgPool) {
    try {
      const res = await pgPool.query(sql, params);
      let lastInsertRowid: number | undefined;
      if (res.rows && res.rows[0] && res.rows[0].id !== undefined) {
        lastInsertRowid = Number(res.rows[0].id);
      }
      return { lastInsertRowid, changes: res.rowCount || 0 };
    } catch (err: any) {
      console.error("PostgreSQL command failed, falling back to local SQLite:", err.message);
    }
  }

  initializeSqlite();
  const sqliteSql = sql.replace(/\$[0-9]+/g, '?');
  try {
    const stmt = sqliteDbInstance!.prepare(sqliteSql);
    const info = stmt.run(...params);
    return { lastInsertRowid: info.lastInsertRowid as number, changes: info.changes };
  } catch (err) {
    console.error("SQLite command failed:", err);
    return { changes: 0 };
  }
}

async function executeQueryOne(sql: string, params: any[] = []): Promise<any | null> {
  const rows = await executeQuery(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export const sqliteDb = {
  // --- Inspectors ---
  async getAll(): Promise<Inspector[]> {
    try {
      const rows = await executeQuery('SELECT * FROM inspectors ORDER BY id ASC');
      return rows.map(mapRow);
    } catch (err) {
      console.error("Failed to select all inspectors:", err);
      return [];
    }
  },

  async getByLogin(login: string): Promise<Inspector | null> {
    try {
      const row = await executeQueryOne('SELECT * FROM inspectors WHERE login = $1', [login]);
      return row ? mapRow(row) : null;
    } catch (err) {
      console.error(`Failed to get inspector by login ${login}:`, err);
      return null;
    }
  },

  async getById(id: number): Promise<Inspector | null> {
    try {
      const row = await executeQueryOne('SELECT * FROM inspectors WHERE id = $1', [id]);
      return row ? mapRow(row) : null;
    } catch (err) {
      console.error(`Failed to get inspector by id ${id}:`, err);
      return null;
    }
  },

  async create(data: { fullName: string; login: string; password?: string; district?: string }): Promise<Inspector> {
    const info = await executeNonQuery(`
      INSERT INTO inspectors (full_name, login, password, district)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [data.fullName, data.login, data.password || "123456", data.district || "Guliston Shahri"]);
    
    const id = info.lastInsertRowid || 1;
    const created = await this.getById(id);
    if (created) return created;
    const found = await this.getByLogin(data.login);
    return found!;
  },

  async update(id: number, data: Partial<Inspector>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.fullName !== undefined) {
      fields.push(`full_name = $${idx++}`);
      values.push(data.fullName);
    }
    if (data.login !== undefined) {
      fields.push(`login = $${idx++}`);
      values.push(data.login);
    }
    if (data.password !== undefined) {
      fields.push(`password = $${idx++}`);
      values.push(data.password);
    }
    if (data.district !== undefined) {
      fields.push(`district = $${idx++}`);
      values.push(data.district);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(data.status);
    }
    if (data.solved !== undefined) {
      fields.push(`solved = $${idx++}`);
      values.push(data.solved);
    }
    if (data.active !== undefined) {
      fields.push(`active = $${idx++}`);
      values.push(data.active);
    }
    if (data.responseTime !== undefined) {
      fields.push(`response_time = $${idx++}`);
      values.push(data.responseTime);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const info = await executeNonQuery(`
      UPDATE inspectors
      SET ${fields.join(', ')}
      WHERE id = $${idx}
    `, values);
    return info.changes > 0;
  },

  async delete(id: number): Promise<boolean> {
    const info = await executeNonQuery('DELETE FROM inspectors WHERE id = $1', [id]);
    return info.changes > 0;
  },

  // --- Bot Users / Volunteers ---
  async getAllBotUsers(): Promise<BotUser[]> {
    try {
      const rows = await executeQuery('SELECT * FROM bot_users ORDER BY id DESC');
      return rows.map(mapBotUserRow);
    } catch (err) {
      console.error("Failed to get all bot users:", err);
      return [];
    }
  },

  async getBotUserById(id: number): Promise<BotUser | null> {
    try {
      const row = await executeQueryOne('SELECT * FROM bot_users WHERE id = $1', [id]);
      return row ? mapBotUserRow(row) : null;
    } catch (err) {
      return null;
    }
  },

  async getBotUserByTelegramId(telegramId: string): Promise<BotUser | null> {
    try {
      const row = await executeQueryOne('SELECT * FROM bot_users WHERE telegram_id = $1', [telegramId]);
      return row ? mapBotUserRow(row) : null;
    } catch (err) {
      return null;
    }
  },

  async getBotUserByUserId(userId: string): Promise<BotUser | null> {
    try {
      const row = await executeQueryOne('SELECT * FROM bot_users WHERE user_id = $1', [userId]);
      return row ? mapBotUserRow(row) : null;
    } catch (err) {
      return null;
    }
  },

  async createBotUser(data: {
    userId: string;
    telegramId: string;
    username?: string;
    fullName?: string;
    phone?: string;
    region?: string;
    district?: string;
    mahalla?: string;
    latitude?: string;
    longitude?: string;
    status?: string;
  }): Promise<BotUser> {
    const info = await executeNonQuery(`
      INSERT INTO bot_users (user_id, telegram_id, username, full_name, phone, region, district, mahalla, latitude, longitude, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [
      data.userId,
      data.telegramId,
      data.username || null,
      data.fullName || null,
      data.phone || null,
      data.region || null,
      data.district || null,
      data.mahalla || null,
      data.latitude || null,
      data.longitude || null,
      data.status || 'PENDING'
    ]);

    const id = info.lastInsertRowid || 1;
    const created = await this.getBotUserById(id);
    if (created) return created;
    const found = await this.getBotUserByTelegramId(data.telegramId);
    return found!;
  },

  async updateBotUser(id: number, data: Partial<BotUser>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.userId !== undefined) {
      fields.push(`user_id = $${idx++}`);
      values.push(data.userId);
    }
    if (data.telegramId !== undefined) {
      fields.push(`telegram_id = $${idx++}`);
      values.push(data.telegramId);
    }
    if (data.username !== undefined) {
      fields.push(`username = $${idx++}`);
      values.push(data.username);
    }
    if (data.fullName !== undefined) {
      fields.push(`full_name = $${idx++}`);
      values.push(data.fullName);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${idx++}`);
      values.push(data.phone);
    }
    if (data.region !== undefined) {
      fields.push(`region = $${idx++}`);
      values.push(data.region);
    }
    if (data.district !== undefined) {
      fields.push(`district = $${idx++}`);
      values.push(data.district);
    }
    if (data.mahalla !== undefined) {
      fields.push(`mahalla = $${idx++}`);
      values.push(data.mahalla);
    }
    if (data.latitude !== undefined) {
      fields.push(`latitude = $${idx++}`);
      values.push(data.latitude);
    }
    if (data.longitude !== undefined) {
      fields.push(`longitude = $${idx++}`);
      values.push(data.longitude);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(data.status);
    }
    if (data.reportsSubmitted !== undefined) {
      fields.push(`reports_submitted = $${idx++}`);
      values.push(data.reportsSubmitted);
    }
    
    fields.push('last_active = CURRENT_TIMESTAMP');

    if (fields.length === 0) return false;

    values.push(id);
    const info = await executeNonQuery(`
      UPDATE bot_users
      SET ${fields.join(', ')}
      WHERE id = $${idx}
    `, values);
    return info.changes > 0;
  },

  async updateBotUserByTelegramId(telegramId: string, data: Partial<BotUser>): Promise<boolean> {
    const user = await this.getBotUserByTelegramId(telegramId);
    if (!user) return false;
    return this.updateBotUser(user.id, data);
  },

  // --- Incidents / Reports ---
  async getAllIncidents(): Promise<IncidentDb[]> {
    try {
      const rows = await executeQuery(`
        SELECT i.*, 
               b.full_name as reporterName, 
               b.phone as reporterPhone, 
               b.user_id as reporterId 
        FROM incidents i
        LEFT JOIN bot_users b ON i.bot_user_id = b.id
        ORDER BY i.id DESC
      `);
      return rows.map(mapIncidentRow);
    } catch (err) {
      console.error("Failed to get all incidents:", err);
      return [];
    }
  },

  async getIncidentById(id: number): Promise<IncidentDb | null> {
    try {
      const row = await executeQueryOne(`
        SELECT i.*, 
               b.full_name as reporterName, 
               b.phone as reporterPhone, 
               b.user_id as reporterId 
        FROM incidents i
        LEFT JOIN bot_users b ON i.bot_user_id = b.id
        WHERE i.id = $1
      `, [id]);
      return row ? mapIncidentRow(row) : null;
    } catch (err) {
      return null;
    }
  },

  async getIncidentByIncidentId(incidentId: string): Promise<IncidentDb | null> {
    try {
      const row = await executeQueryOne(`
        SELECT i.*, 
               b.full_name as reporterName, 
               b.phone as reporterPhone, 
               b.user_id as reporterId 
        FROM incidents i
        LEFT JOIN bot_users b ON i.bot_user_id = b.id
        WHERE i.incident_id = $1
      `, [incidentId]);
      return row ? mapIncidentRow(row) : null;
    } catch (err) {
      return null;
    }
  },

  async createIncident(data: {
    incidentId: string;
    botUserId?: number | null;
    type?: string;
    content?: string;
    description?: string;
    region?: string;
    district?: string;
    mahalla?: string;
    latitude?: string;
    longitude?: string;
    status?: string;
    assignedTo?: number | null;
    inspector?: string;
    aiRiskScore?: number;
    aiConfidence?: number;
    aiDetectedKeywords?: string[];
    aiRecommendation?: string;
  }): Promise<IncidentDb> {
    const keywordsJson = data.aiDetectedKeywords ? JSON.stringify(data.aiDetectedKeywords) : null;
    const info = await executeNonQuery(`
      INSERT INTO incidents (
        incident_id, bot_user_id, type, content, description, region, district, mahalla, 
        latitude, longitude, status, assigned_to, inspector, ai_risk_score, ai_confidence, 
        ai_detected_keywords, ai_recommendation
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id
    `, [
      data.incidentId,
      data.botUserId || null,
      data.type || null,
      data.content || null,
      data.description || null,
      data.region || null,
      data.district || null,
      data.mahalla || null,
      data.latitude || null,
      data.longitude || null,
      data.status || 'NEW',
      data.assignedTo || null,
      data.inspector || null,
      data.aiRiskScore || null,
      data.aiConfidence || null,
      keywordsJson,
      data.aiRecommendation || null
    ]);

    const id = info.lastInsertRowid || 1;
    const created = await this.getIncidentById(id);
    if (created) return created;
    const found = await this.getIncidentByIncidentId(data.incidentId);
    return found!;
  },

  async updateIncidentByIncidentId(incidentId: string, data: Partial<IncidentDb>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.type !== undefined) {
      fields.push(`type = $${idx++}`);
      values.push(data.type);
    }
    if (data.content !== undefined) {
      fields.push(`content = $${idx++}`);
      values.push(data.content);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(data.description);
    }
    if (data.region !== undefined) {
      fields.push(`region = $${idx++}`);
      values.push(data.region);
    }
    if (data.district !== undefined) {
      fields.push(`district = $${idx++}`);
      values.push(data.district);
    }
    if (data.mahalla !== undefined) {
      fields.push(`mahalla = $${idx++}`);
      values.push(data.mahalla);
    }
    if (data.latitude !== undefined) {
      fields.push(`latitude = $${idx++}`);
      values.push(data.latitude);
    }
    if (data.longitude !== undefined) {
      fields.push(`longitude = $${idx++}`);
      values.push(data.longitude);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(data.status);
    }
    if (data.assignedTo !== undefined) {
      fields.push(`assigned_to = $${idx++}`);
      values.push(data.assignedTo);
    }
    if (data.inspector !== undefined) {
      fields.push(`inspector = $${idx++}`);
      values.push(data.inspector);
    }
    if (data.aiRiskScore !== undefined) {
      fields.push(`ai_risk_score = $${idx++}`);
      values.push(data.aiRiskScore);
    }
    if (data.aiConfidence !== undefined) {
      fields.push(`ai_confidence = $${idx++}`);
      values.push(data.aiConfidence);
    }
    if (data.aiDetectedKeywords !== undefined) {
      fields.push(`ai_detected_keywords = $${idx++}`);
      values.push(JSON.stringify(data.aiDetectedKeywords));
    }
    if (data.aiRecommendation !== undefined) {
      fields.push(`ai_recommendation = $${idx++}`);
      values.push(data.aiRecommendation);
    }

    if (fields.length === 0) return false;

    values.push(incidentId);
    const info = await executeNonQuery(`
      UPDATE incidents
      SET ${fields.join(', ')}
      WHERE incident_id = $${idx}
    `, values);
    return info.changes > 0;
  },

  async deleteIncidentByIncidentId(incidentId: string): Promise<boolean> {
    const info = await executeNonQuery('DELETE FROM incidents WHERE incident_id = $1', [incidentId]);
    return info.changes > 0;
  }
};
