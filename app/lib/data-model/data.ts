"use server";

import { sql } from "@vercel/postgres";
import {
  BlockedTime,
  Client,
  ClientDetails,
  EmailTemplate,
  Event,
  Payment,
  Task,
  User,
} from "./definitions";
import { db } from "@vercel/postgres";
import { userIds } from "../backup-restore/backup";
const client = await db.connect();

export async function fetchCalendar() {
  try {
    const sql = `
    select 
      client_id,
      clients.primarypersonname as client_name,
      event_id,
      task_id,
      e.user_id,
      seconduser_id,
      thirduser_id,
      e.date,
      text,
      end_date,
      blockedtime_id
    from
    (
        select null::uuid as blockedtime_id, id as event_id, user_id, seconduser_id, thirduser_id, client_id, date, null::date as end_date, 'Wedding' as text, null::uuid as task_id from events where type = 'Wedding' and date >= CURRENT_DATE AND pixieseturl is null
        union
        select null::uuid, id, user_id, null::uuid, null::uuid, client_id, date, null::date, title, null::uuid from events where type = 'Shoot' and date >= CURRENT_DATE AND pixieseturl is null
        union
        select null::uuid, id, user_id, null::uuid, null::uuid, client_id, date, null::date, title, null::uuid from events where type = 'Meeting' and date >= CURRENT_DATE
        union
        select null::uuid, event_id, tasks.user_id, null::uuid, null::uuid, client_id, available_date, null::date, name, tasks.id from tasks join events on events.id = tasks.event_id where available_date <= CURRENT_DATE and completed_date is null
        union
        select id, null::uuid, case when andy then '${userIds.andy}' else null::uuid end, case when carly then '${userIds.carly}' else null::uuid end, case when gillian then '${userIds.gillian}' else null::uuid end, null::uuid, start_date, end_date, text, null::uuid from blockedtimes where start_date >= CURRENT_DATE
    ) e
    left join clients on clients.id = e.client_id
    order by e.date
	  `;
    const data = await client.query(sql);
    return data.rows;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch upcoming events.");
  }
}

export async function fetchFilteredClients(query: string) {
  try {
    const data = await sql<Client>`
    SELECT * FROM clients WHERE id in
    (
        SELECT id FROM clients WHERE    
          notes ILIKE ${`%${query}%`} OR
          primaryPersonName ILIKE ${`%${query}%`} OR
          primaryPersonEmail ILIKE ${`%${query}%`}

        UNION
        
        SELECT distinct client_id as id FROM events WHERE
          title ILIKE ${`%${query}%`} OR
          location ILIKE ${`%${query}%`} OR
          location2 ILIKE ${`%${query}%`} OR
          location3 ILIKE ${`%${query}%`} OR
          location4 ILIKE ${`%${query}%`} OR
          notes ILIKE ${`%${query}%`}
    )
		ORDER BY clients.primaryPersonName ASC
	  `;
    return data.rows;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch filtered clients.");
  }
}

export async function fetchAllUsers() {
  try {
    const users = await sql<User>`SELECT * FROM users order by name`;

    return users.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users.");
  }
}

export async function fetchBackup() {
  try {
    return {
      users: (await sql<User>`SELECT * FROM users`).rows,
      clients: (await sql<Client>`SELECT * FROM clients`).rows,
      events: (await sql<Event>`SELECT * FROM events`).rows,
      tasks: (await sql<Task>`SELECT * FROM tasks`).rows,
      emailtemplates: (await sql<EmailTemplate>`SELECT * FROM emailtemplates`)
        .rows,
      blockedtimes: (await sql<BlockedTime>`SELECT * FROM blockedtimes`).rows,
      payments: (await sql<Payment>`SELECT * FROM payments`).rows,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch backup.");
  }
}

export async function fetchAllEmailTemplates() {
  try {
    const emails = await sql<EmailTemplate>`SELECT * FROM emailtemplates`;

    return emails.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch email templates.");
  }
}

export async function fetchClientDetailsById(id: string) {
  try {
    const client =
      await sql<Client>`SELECT * FROM clients WHERE clients.id = ${id}`;
    const events = await sql<Event>`
        SELECT *
          FROM events
        WHERE events.client_id = ${id}
        ORDER BY
          CASE WHEN type = 'Meeting' AND date >= CURRENT_DATE THEN 1 -- Future meetings
               WHEN type IN ('Shoot', 'Wedding') AND pixieseturl IS NULL THEN 2 -- Undelivered/future shoots and weddings
               ELSE 3 END,
          date
        `;
    const tasks = await sql<Task>`
          SELECT * FROM tasks 
          WHERE event_id IN (SELECT id FROM events WHERE client_id = ${id})
          ORDER BY COALESCE(tasks.available_date, '1/1/2099')
        `;
    const payments = await sql<Payment>`
              SELECT * FROM payments
              WHERE client_id = ${id}
              ORDER BY payments.date
            `;

    return {
      ...client.rows[0],
      payments: payments.rows,
      events: events.rows.map((e) => {
        return {
          ...e,
          tasks: tasks.rows.filter((t) => t.event_id === e.id),
        };
      }),
    } as ClientDetails;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch client details.");
  }
}

export async function fetchEventDetailsById(id: string) {
  try {
    const event = (await sql<Event>`SELECT * FROM events WHERE id = ${id}`)
      .rows[0];
    const tasks = (await sql<Task>`SELECT * FROM tasks WHERE event_id = ${id}`)
      .rows;

    return {
      ...event,
      tasks: tasks,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch event details.");
  }
}
