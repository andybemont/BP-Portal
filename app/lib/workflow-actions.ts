import { sql } from "@vercel/postgres";
import { Event, Task } from "./definitions";
import { andyWedding, StandardTask, Workflow } from "./workflow-definitions";
import { userIds } from "./backup";
import { uuidv4 } from "./helpers";
import {
  fetchEventDetailsById,
  insertTask,
  markTaskAvailable,
  markTaskNotAvailable,
} from "./data";

export const getWorkflowForEvent = (event: Event) => {
  if (event.user_id === userIds.andy && event.type === "Wedding") {
    return andyWedding;
  }
  return null;
};

export const ensureTasksForEvent = async (event_id: string) => {
  const event = await fetchEventDetailsById(event_id);
  if (!event) {
    return;
  }
  const workflow = getWorkflowForEvent(event);
  if (!workflow) {
    return;
  }

  workflow.tasks.map(async (requiredTask) => {
    if (requiredTask.isNeeded && !requiredTask.isNeeded(event)) {
      // There's a special check to see if this task is needed, and it's not!
      return;
    }
    if (event.tasks.find((t) => t.token === requiredTask.token)) {
      // This task already exists
      return;
    }
    await createMissingTask(requiredTask, event);
  });
};

export const checkForNewlyAvailableTasks = async (event_id: string) => {
  const event = await fetchEventDetailsById(event_id);
  if (!event) {
    return;
  }
  const workflow = getWorkflowForEvent(event);
  if (!workflow) {
    return;
  }

  const completedTaskTokens = event.tasks
    .filter((t) => t.completed_date)
    .map((t) => t.token);

  event.tasks.map(async (task) => {
    const taskDef = workflow.tasks.find((wft) => task.token === wft.token);
    if (!taskDef) {
      // This task is not part of the standard workflow
      return;
    }
    const isAvailable = task.available_date;
    const shouldBeAvailable = !taskDef.prerequisites?.find(
      (prerequisite) =>
        !completedTaskTokens.find((completed) => completed === prerequisite)
    );

    if (isAvailable && !shouldBeAvailable) {
      // Task is available but shouldn't be (probably based on a another task completion being undone)
      await markTaskNotAvailable(task.id);
    } else if (!isAvailable && shouldBeAvailable) {
      // Task is not available but should be (probably based on another task being completed)
      await markTaskAvailable(task.id);
    }
  });
};

const createMissingTask = async (taskDef: StandardTask, event: Event) => {
  const availableDate = taskDef.getSpecialAvailableDate
    ? taskDef.getSpecialAvailableDate(event) // If there's special logic for available date, use it
    : taskDef.prerequisites
    ? undefined // Else if there are no requisites, it's not available for now
    : new Date(); // If there are no prerequisites, it's immediately available
  await insertTask({
    id: await uuidv4(),
    name: taskDef.caption,
    event_id: event.id,
    user_id: taskDef.defaultAssignee || event.user_id,
    token: taskDef.token,
    available_date: availableDate,
  });
};
