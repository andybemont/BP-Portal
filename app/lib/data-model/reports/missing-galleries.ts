"use server";
import { db } from "@vercel/postgres";
const client = await db.connect();

export type MissingGalleriesReportData = {
  clients: {
    client_id: string;
    client_name: string;
    event_date: Date;
  }[];
};

export async function fetchMissingGalleriesReportData() {
  try {
    const sql = `
       select clients.primarypersonname as client_name, clients.id as client_id, events.date as event_date
       from clients
        join events on events.client_id = clients.id
       where events.type = 'Wedding' and events.date < CURRENT_DATE and pixieseturl is null
       order by client_name
        `;
    const data = await client.query(sql);
    return { clients: data.rows } as MissingGalleriesReportData;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch data for expected income report.");
  }
}
