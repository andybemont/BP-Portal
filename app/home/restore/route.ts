import bcrypt from "bcrypt";
import { backup } from "../../lib/backup";
import { db } from "@vercel/postgres";
import {
  insertBlockedTime,
  insertEventRecord,
  insertTask,
} from "@/app/lib/data";
const client = await db.connect();

async function prep() {
  await client.sql`DROP TABLE IF EXISTS blockedtimes`;
  await client.sql`DROP TABLE IF EXISTS tasks`;
  await client.sql`DROP TABLE IF EXISTS events`;
  await client.sql`DROP TABLE IF EXISTS clients`;
  await client.sql`DROP TABLE IF EXISTS users`;
  await client.sql`DROP TABLE IF EXISTS emailtemplates`;
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
}

async function seedBlockedTimes() {
  await client.sql`
     CREATE TABLE blockedtimes (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        start_date DATE NOT NULL,
        end_Date DATE NOT NULL,
        andy BOOLEAN NOT NULL,
        carly BOOLEAN NOT NULL,
        gillian BOOLEAN NOT NULL,
        text VARCHAR(100) NOT NULL
     );
   `;
  const inserted = await Promise.all(
    backup.blockedtimes.map(async (e) => insertBlockedTime(e))
  );
  return inserted;
}

async function seedUsers() {
  await client.sql`
     CREATE TABLE users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL
     );
   `;
  const inserted = await Promise.all(
    backup.users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
            INSERT INTO users (id, name, email, password)
            VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
            ON CONFLICT (id) DO NOTHING;
          `;
    })
  );
  return inserted;
}

async function seedEmailTemplates() {
  await client.sql`
     CREATE TABLE emailtemplates (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL,
        title VARCHAR(100) NOT NULL,
        text VARCHAR(5000) NOT NULL
     );
   `;
  const inserted = await Promise.all(
    backup.emailtemplates.map(async (e) => {
      return client.sql`
            INSERT INTO emailtemplates (id, user_id, title, text)
            VALUES (${e.id}, ${e.user_id}, ${e.title}, ${e.text})
            ON CONFLICT (id) DO NOTHING;
          `;
    })
  );
  return inserted;
}

async function seedClients() {
  await client.sql`
     CREATE TABLE clients (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        source VARCHAR(255) NULL,
        user_id VARCHAR(255) NOT NULL,
        notes VARCHAR(5000) NULL,
        primaryPersonName VARCHAR(255) NULL,
        primaryPersonEmail VARCHAR(255) NULL,
        primaryPersonPhone VARCHAR(255) NULL
     );
   `;
  const insertedClients = await Promise.all(
    backup.clients.map(
      (c) => client.sql`
         INSERT INTO clients (
          id,
          source,
          user_id,
          notes,
          primaryPersonName,
          primaryPersonEmail,
          primaryPersonPhone
         ) VALUES (
          ${c.id},
          ${c.source},
          ${c.user_id},
          ${c.notes},
          ${c.primarypersonname},
          ${c.primarypersonemail},
          ${c.primarypersonphone}
         )
         ON CONFLICT (id) DO NOTHING;
       `
    )
  );
  return insertedClients;
}

async function seedEvents() {
  await client.sql`
     CREATE TABLE events (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      type VARCHAR(20) NOT NULL,
      client_id UUID NOT NULL,
      user_id UUID NULL,
      seconduser_id UUID NULL,
      thirduser_id UUID NULL,
      date DATE NULL,
      title VARCHAR(100) NULL,
      notes VARCHAR(5000) NULL,
      cost INTEGER NULL,
      duration INTEGER NULL,
      engagementsession BOOLEAN NULL,
      priorityediting BOOLEAN NULL,
      numphotographers INTEGER NULL,
      location VARCHAR(50) NULL,
      location2 VARCHAR(50) NULL,
      location3 VARCHAR(50) NULL,
      location4 VARCHAR(50) NULL,
      pixieseturl VARCHAR(100) NULL
     );
   `;
  const inserted = await Promise.all(
    backup.events.map(async (event) => {
      insertEventRecord(event);
    })
  );
  return inserted;
}

async function seedTasks() {
  await client.sql`
     CREATE TABLE tasks (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      event_id UUID NULL,
      user_id UUID NULL,
      token VARCHAR(100) NULL,
      name VARCHAR(100) NOT NULL,
      notes VARCHAR(5000) NULL,
      available_date DATE NULL,
      completed_date DATE NULL
     );
   `;
  const inserted = await Promise.all(
    backup.tasks.map(async (task) => {
      insertTask(task);
    })
  );
  return inserted;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await prep();
    await seedBlockedTimes();
    await seedUsers();
    await seedClients();
    await seedEvents();
    await seedTasks();
    await seedEmailTemplates();
    await client.sql`COMMIT`;

    return Response.json({
      message: "Database restored from backup successfully",
    });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
