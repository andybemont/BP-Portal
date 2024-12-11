"use server";

import { db } from "@vercel/postgres";
import { checkForNewlyAvailableTasks } from "./workflow-actions";
const client = await db.connect();

export async function insertTask(task: any) {
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
      ${
        task.available_date ? `'${task.available_date.toISOString()}'` : "null"
      },
      ${task.completed_date ? `'${task.completed_date.toISOString()}'` : "null"}
     )
      RETURNING ID
   `;
  try {
    await client.query(sql);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create task.");
  }
}

export async function markTaskComplete(task_id: string, event_id: string) {
  try {
    const sql = `
      UPDATE tasks SET completed_date = CURRENT_DATE WHERE id = '${task_id}'`;
    await client.query(sql);
    await checkForNewlyAvailableTasks(event_id);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to mark task complete.");
  }
}

export async function assignTask(
  task: { id: string; user_id?: string },
  prevState: any,
  formData: FormData
) {
  const new_user_id =
    formData.get("user_id")?.valueOf()?.toString() || undefined;

  try {
    const sql = `
      UPDATE tasks SET user_id = ${
        new_user_id ? `'${new_user_id}'` : "null"
      } WHERE id = '${task.id}'`;
    await client.query(sql);
    return { updated: true, new_user_id: new_user_id };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to assign task.");
  }
}

export async function markTaskNotComplete(task_id: string, event_id: string) {
  try {
    const sql = `
      UPDATE tasks SET completed_date = null WHERE id = '${task_id}'`;
    await client.query(sql);
    await checkForNewlyAvailableTasks(event_id);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to mark task NOT complete.");
  }
}

export async function markTaskAvailable(id: string) {
  try {
    const sql = `
      UPDATE tasks SET available_date = CURRENT_DATE WHERE id = '${id}'`;
    await client.query(sql);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to mark task available.");
  }
}

export async function markTaskNotAvailable(id: string) {
  try {
    const sql = `
      UPDATE tasks SET available_date = null WHERE id = '${id}'`;
    await client.query(sql);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to mark task available.");
  }
}
