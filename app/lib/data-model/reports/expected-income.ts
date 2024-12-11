"use server";
import { db } from "@vercel/postgres";
const client = await db.connect();

export type ExpectedIncomeReportData = {
  clients: {
    client_name: string;
    event_date: Date;
    total_cost: number;
    total_payments: number;
  }[];
};

export async function fetchExpectedIncomeReportData() {
  try {
    const sql = `
       select clients.primarypersonname as client_name, event_date, total_payments, total_cost
       from clients
        join
            (select client_id, sum(amount) total_payments from payments group by client_id) previous_payments
            on previous_payments.client_id = clients.id
        join (select client_id, sum(coalesce(cost, 0)) as total_cost, max(events.date) as event_date from events group by client_id having sum(coalesce(cost, 0)) > 0) costs
            on costs.client_id = clients.id
       where total_payments <> total_cost
        `;
    const data = await client.query(sql);
    return { clients: data.rows } as ExpectedIncomeReportData;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch data for expected income report.");
  }
}
