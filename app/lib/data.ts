import { sql } from "@vercel/postgres";
import {
  CalendarEntry,
  Client,
  ClientDetails,
  EmailTemplate,
  Event,
  Task,
  User,
} from "./definitions";
import { db } from "@vercel/postgres";
const client = await db.connect();

export async function fetchCalendar() {
  try {
    const data = await sql<CalendarEntry>`
    select 
      client_id,
      clients.primarypersonname as client_name,
      event_id,
      task_id,
      users1.id as user_id,
      users1.name as user_name,
      users2.id as seconduser_id,
      users2.name as seconduser_name,
      users3.id as thirduser_id,
      users3.name as thirduser_name,
      date,
      text
    from
    (
        select id as event_id, user_id, seconduser_id, thirduser_id, client_id, date, 'Wedding' as text, null::uuid as task_id from events where type = 'Wedding' and date >= CURRENT_DATE AND pixieseturl is null
        union
        select id, user_id, null, null, client_id, date, title, null::uuid from events where type = 'Shoot' and date >= CURRENT_DATE AND pixieseturl is null
        union
        select id, user_id, null, null, client_id, date, title, null::uuid from events where type = 'Meeting' and date >= CURRENT_DATE
        union
        select event_id, tasks.user_id, null, null, client_id, available_date, name, tasks.id from tasks join events on events.id = tasks.event_id where available_date <= CURRENT_DATE and completed_date is null
    ) e
    left join users as users1 on users1.id = e.user_id
    left join users as users2 on users2.id = e.seconduser_id
    left join users as users3 on users3.id = e.thirduser_id
    join clients on clients.id = e.client_id
    order by date
	  `;
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

    return {
      ...client.rows[0],
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

export async function updateEventRecord(event: any) {
  try {
    const sql = `
    UPDATE events SET
      client_id = ${event.client_id ? `'${event.client_id}'` : "null"},
      user_id = ${event.user_id ? `'${event.user_id}'` : "null"},
      seconduser_id = ${
        event.seconduser_id ? `'${event.seconduser_id}'` : "null"
      },
      thirduser_id = ${event.thirduser_id ? `'${event.thirduser_id}'` : "null"},
      date = ${event.date ? `'${event.date.toISOString()}'` : "null"},
      title = ${event.title ? `'${event.title}'` : "null"},
      notes = ${event.notes ? `'${event.notes}'` : "null"},
      cost = ${event.cost ? `'${event.cost}'` : "null"},
      duration = ${event.duration ? `'${event.duration}'` : "null"},
      engagementsession = ${
        event.engagementsession ? `'${event.engagementsession}'` : "null"
      },
      priorityediting = ${
        event.priorityediting ? `'${event.priorityediting}'` : "null"
      },
      numphotographers = ${
        event.numphotographers ? `'${event.numphotographers}'` : "null"
      },
      location = ${event.location ? `'${event.location}'` : "null"},
      location2 = ${event.location2 ? `'${event.location2}'` : "null"},
      location3 = ${event.location3 ? `'${event.location3}'` : "null"},
      location4 = ${event.location4 ? `'${event.location4}'` : "null"},
      pixieseturl = ${event.pixieseturl ? `'${event.pixieseturl}'` : "null"}
    WHERE id = '${event.id}'
  `;
    await client.query(sql);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update event.");
  }
}

export async function insertEventRecord(event: any) {
  try {
    const sql = `
     INSERT INTO events (
      id,
    ${event.client_id ? `client_id,` : ""}
    ${event.user_id ? `user_id,` : ""}
    ${event.seconduser_id ? `seconduser_id,` : ""}
    ${event.thirduser_id ? `thirduser_id,` : ""}
    ${event.date ? `date,` : ""}
    ${event.title ? `title,` : ""}
    ${event.notes ? `notes,` : ""}
    ${event.cost ? `cost,` : ""}
    ${event.duration ? `duration,` : ""}
    ${event.engagementsession ? `engagementsession,` : ""}
    ${event.priorityediting ? `priorityediting,` : ""}
    ${event.numphotographers ? `numphotographers,` : ""}
    ${event.location ? `location,` : ""}
    ${event.location2 ? `location2,` : ""}
    ${event.location3 ? `location3,` : ""}
    ${event.location4 ? `location4,` : ""}
    ${event.pixieseturl ? `pixieseturl,` : ""}
      type
     ) VALUES (
      '${event.id}',
      ${event.client_id ? `'${event.client_id}',` : ""}
      ${event.user_id ? `'${event.user_id}',` : ""}
      ${event.seconduser_id ? `'${event.seconduser_id}',` : ""}
      ${event.thirduser_id ? `'${event.thirduser_id}',` : ""}
      ${event.date ? `'${new Date(event.date).toISOString()}',` : ""}
      ${event.title ? `'${event.title}',` : ""}
      ${event.notes ? `'${event.notes}',` : ""}
      ${event.cost ? `'${event.cost}',` : ""}
      ${event.duration ? `'${event.duration}',` : ""}
      ${event.engagementsession ? `'${event.engagementsession}',` : ""}
      ${event.priorityediting ? `'${event.priorityediting}',` : ""}
      ${event.numphotographers ? `'${event.numphotographers}',` : ""}
      ${event.location ? `'${event.location}',` : ""}
      ${event.location2 ? `'${event.location2}',` : ""}
      ${event.location3 ? `'${event.location3}',` : ""}
      ${event.location4 ? `'${event.location4}',` : ""}
      ${event.pixieseturl ? `'${event.pixieseturl}',` : ""}
      '${event.type}'
     )
      RETURNING ID
   `;
    await client.query(sql);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update event.");
  }
}

export async function insertTask(task: Task) {
  const sql = `
   INSERT INTO tasks (
    id,
    event_id,
    user_id,
    token,
    name,
    notes,
    available_date,
    completed_date
   ) VALUES (
    '${task.id}',
    ${task.event_id ? `'${task.event_id}'` : "null"},
    ${task.user_id ? `'${task.user_id}'` : "null"},
    ${task.token ? `'${task.token}'` : "null"},
    '${task.name}',
    ${task.notes ? `'${task.notes}'` : "null"},
    ${task.available_date ? `'${task.available_date.toISOString()}'` : "null"},
    ${task.completed_date ? `'${task.completed_date.toISOString()}'` : "null"}
   )
    RETURNING ID
 `;
  try {
    await client.query(sql);
  } catch (error) {
    console.error("Database Error:", error);
    console.error(sql);
    throw new Error("Failed to create task.");
  }
}

export async function markTaskComplete(id: string) {
  try {
    const sql = `
    UPDATE tasks SET complete_date = CURRENT_DATE WHERE id = ${id}`;
    await client.query(sql);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to mark task complete.");
  }
}

export async function markTaskAvailable(id: string) {
  try {
    const sql = `
    UPDATE tasks SET available_date = CURRENT_DATE WHERE id = ${id}`;
    await client.query(sql);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to mark task available.");
  }
}
