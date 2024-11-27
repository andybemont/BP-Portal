import { sql } from "@vercel/postgres";
import {
  Client,
  ClientDetails,
  EmailTemplate,
  ScheduledEvent,
  User,
} from "./definitions";
import { db } from "@vercel/postgres";
const client = await db.connect();

export async function fetchScheduledEvents() {
  try {
    const data = await sql<ScheduledEvent>`
    select 
       scheduledevents.id,
       clients.primarypersonname as client_name,
       scheduledevents.client_id as client_id,
       string_agg(users.name, ', ') as user_name,
       title,
       date,
       type
    from
    (
        select user_id, id from scheduledevents
        union
        select seconduser_id as user_id, id from scheduledevents WHERE seconduser_id IS NOT NULL
        union
        select thirduser_id as user_id, id from scheduledevents WHERE thirduser_id IS NOT NULL
    ) events
    join scheduledevents on events.id = scheduledevents.id
    join clients on clients.id = scheduledevents.client_id
    left join users on users.id = events.user_id
    where date is not null AND (date >= CURRENT_DATE OR (type IN ('Wedding','Shoot') AND pixieseturl IS NULL))
    group by
       scheduledevents.id,
       clients.primarypersonname,
       scheduledevents.client_id,
       title,
       date

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
        
        SELECT distinct client_id as id FROM scheduledevents WHERE
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
    const clients =
      await sql<Client>`SELECT * FROM clients WHERE clients.id = ${id}`;
    const scheduledEvents = await sql<ScheduledEvent>`
        SELECT *
          FROM scheduledevents
        WHERE scheduledevents.client_id = ${id}
        ORDER BY
          CASE WHEN type = 'Meeting' AND date >= CURRENT_DATE THEN 1 -- Future meetings
               WHEN type IN ('Shoot', 'Wedding') AND pixieseturl IS NULL THEN 2 -- Undelivered/future shoots and weddings
               ELSE 3 END,
          date
        `;

    return {
      ...clients.rows[0],
      scheduledEvents: scheduledEvents.rows,
    } as ClientDetails;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch client.");
  }
}

export async function updateScheduledEvent(scheduledEvent: ScheduledEvent) {
  const sql = `
    UPDATE scheduledEvents SET
      client_id = ${
        scheduledEvent.client_id ? `'${scheduledEvent.client_id}'` : "null"
      },
      user_id = ${
        scheduledEvent.user_id ? `'${scheduledEvent.user_id}'` : "null"
      },
      seconduser_id = ${
        scheduledEvent.seconduser_id
          ? `'${scheduledEvent.seconduser_id}'`
          : "null"
      },
      thirduser_id = ${
        scheduledEvent.thirduser_id
          ? `'${scheduledEvent.thirduser_id}'`
          : "null"
      },
      date = ${
        scheduledEvent.date ? `'${scheduledEvent.date.toISOString()}'` : "null"
      },
      title = ${scheduledEvent.title ? `'${scheduledEvent.title}'` : "null"},
      notes = ${scheduledEvent.notes ? `'${scheduledEvent.notes}'` : "null"},
      cost = ${scheduledEvent.cost ? `'${scheduledEvent.cost}'` : "null"},
      duration = ${
        scheduledEvent.duration ? `'${scheduledEvent.duration}'` : "null"
      },
      engagementsession = ${
        scheduledEvent.engagementsession
          ? `'${scheduledEvent.engagementsession}'`
          : "null"
      },
      priorityediting = ${
        scheduledEvent.priorityediting
          ? `'${scheduledEvent.priorityediting}'`
          : "null"
      },
      numphotographers = ${
        scheduledEvent.numphotographers
          ? `'${scheduledEvent.numphotographers}'`
          : "null"
      },
      location = ${
        scheduledEvent.location ? `'${scheduledEvent.location}'` : "null"
      },
      location2 = ${
        scheduledEvent.location2 ? `'${scheduledEvent.location2}'` : "null"
      },
      location3 = ${
        scheduledEvent.location3 ? `'${scheduledEvent.location3}'` : "null"
      },
      location4 = ${
        scheduledEvent.location4 ? `'${scheduledEvent.location4}'` : "null"
      },
      pixieseturl = ${
        scheduledEvent.pixieseturl ? `'${scheduledEvent.pixieseturl}'` : "null"
      }
    WHERE id = '${scheduledEvent.id}'
  `;
  //console.error(sql);
  return client.query(sql);
}

export async function insertScheduledEvent(scheduledEvent: ScheduledEvent) {
  const sql = `
     INSERT INTO scheduledevents (
      id,
    ${scheduledEvent.client_id ? `client_id,` : ""}
    ${scheduledEvent.user_id ? `user_id,` : ""}
    ${scheduledEvent.seconduser_id ? `seconduser_id,` : ""}
    ${scheduledEvent.thirduser_id ? `thirduser_id,` : ""}
    ${scheduledEvent.date ? `date,` : ""}
    ${scheduledEvent.title ? `title,` : ""}
    ${scheduledEvent.notes ? `notes,` : ""}
    ${scheduledEvent.cost ? `cost,` : ""}
    ${scheduledEvent.duration ? `duration,` : ""}
    ${scheduledEvent.engagementsession ? `engagementsession,` : ""}
    ${scheduledEvent.priorityediting ? `priorityediting,` : ""}
    ${scheduledEvent.numphotographers ? `numphotographers,` : ""}
    ${scheduledEvent.location ? `location,` : ""}
    ${scheduledEvent.location2 ? `location2,` : ""}
    ${scheduledEvent.location3 ? `location3,` : ""}
    ${scheduledEvent.location4 ? `location4,` : ""}
    ${scheduledEvent.pixieseturl ? `pixieseturl,` : ""}
      type
     ) VALUES (
      '${scheduledEvent.id}',
      ${scheduledEvent.client_id ? `'${scheduledEvent.client_id}',` : ""}
      ${scheduledEvent.user_id ? `'${scheduledEvent.user_id}',` : ""}
      ${
        scheduledEvent.seconduser_id ? `'${scheduledEvent.seconduser_id}',` : ""
      }
      ${scheduledEvent.thirduser_id ? `'${scheduledEvent.thirduser_id}',` : ""}
      ${
        scheduledEvent.date
          ? `'${scheduledEvent.date.toLocaleDateString()}',`
          : ""
      }
      ${scheduledEvent.title ? `'${scheduledEvent.title}',` : ""}
      ${scheduledEvent.notes ? `'${scheduledEvent.notes}',` : ""}
      ${scheduledEvent.cost ? `'${scheduledEvent.cost}',` : ""}
      ${scheduledEvent.duration ? `'${scheduledEvent.duration}',` : ""}
      ${
        scheduledEvent.engagementsession
          ? `'${scheduledEvent.engagementsession}',`
          : ""
      }
      ${
        scheduledEvent.priorityediting
          ? `'${scheduledEvent.priorityediting}',`
          : ""
      }
      ${
        scheduledEvent.numphotographers
          ? `'${scheduledEvent.numphotographers}',`
          : ""
      }
      ${scheduledEvent.location ? `'${scheduledEvent.location}',` : ""}
      ${scheduledEvent.location2 ? `'${scheduledEvent.location2}',` : ""}
      ${scheduledEvent.location3 ? `'${scheduledEvent.location3}',` : ""}
      ${scheduledEvent.location4 ? `'${scheduledEvent.location4}',` : ""}
      ${scheduledEvent.pixieseturl ? `'${scheduledEvent.pixieseturl}',` : ""}
      '${scheduledEvent.type}'
     )
      RETURNING ID
   `;
  //console.error(sql);
  return client.query(sql);
}
