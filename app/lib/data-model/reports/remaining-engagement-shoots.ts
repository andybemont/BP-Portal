"use server";
import { db } from "@vercel/postgres";
import { ExpectedIncomeReportData } from "./expected-income";
const client = await db.connect();

export type RemainingEngagementShootsReportData = {
  clients: {
    client_name: string;
    wedding_date: Date;
    shoot_date: Date;
  }[];
};

export async function fetchRemainingEngagementShootsReportData() {
  try {
    const sql = `
       select clients.primarypersonname as client_name, weddings.date as wedding_date, shoots.date as shoot_date
       from clients
        left join
            (select client_id, date, engagementsession from events where type = 'Wedding') weddings
            on weddings.client_id = clients.id
        left join
            (select client_id, date, pixieseturl from events where type = 'Shoot') shoots
            on shoots.client_id = clients.id
       where weddings.engagementsession AND shoots.pixieseturl is null
        `;
    const data = await client.query(sql);
    return { clients: data.rows } as RemainingEngagementShootsReportData;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch data for expected income report.");
  }
}
