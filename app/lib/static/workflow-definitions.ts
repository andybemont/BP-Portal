import { userIds } from "../backup-restore/backup";
import { Event } from "../data-model/definitions";

export type StandardTask = {
  token: string;
  caption: string;
  defaultAssignee?: string;
  prerequisites?: string[];
  getSpecialAvailableDate?: (event: Event) => Date | undefined;
  isNeeded?: (event: Event) => boolean;
};
export type Workflow = {
  tasks: StandardTask[];
};

const tasks = {
  SEND_CONTRACT: "SEND_CONTRACT",
  REQUEST_DEPOSIT: "REQUEST_DEPOSIT",
  WAIT_FOR_CLIENT: "WAIT_FOR_CLIENT",
  RECORD_PAYMENT: "RECORD_PAYMENT",
  SEND_BOOKING_CONFIRMATION: "SEND_BOOKING_CONFIRMATION",
  CREATE_ENGAGEMENT_SHOOT: "CREATE_ENGAGEMENT_SHOOT",
  REQUEST_ITINERARY: "REQUEST_ITINERARY",
  WAIT_FOR_ITINERARY: "WAIT_FOR_ITINERARY",
  SEND_WEDDING_DAY_CONFIRMATION: "SEND_WEDDING_DAY_CONFIRMATION",
  MOVE_PICS_TO_PC: "MOVE_PICS_TO_PC",
  BACKUP_PICS: "BACKUP_PICS",
  WAIT_FOR_PAYMENT: "WAIT_FOR_PAYMENT",
  LOAD_LIGHTROOM: "LOAD_LIGHTROOM",
  CATEGORIZE: "CATEGORIZE",
  FIRST_CULL: "FIRST_CULL",
  SECOND_CULL: "SECOND_CULL",
  EDIT: "EDIT",
  FINAL_EDIT: "FINAL_EDIT",
  MARK_BESTOFS: "MARK_BESTOFS",
  EXPORT_PICS: "EXPORT_PICS",
  UPLOAD_PIXIESET: "UPLOAD_PIXIESET",
  ADD_BESTOFS: "ADD_BESTOFS",
  DELIVER_PICS: "DELIVER_PICS",
  SEND_VENUE_PICS: "SEND_VENUE_PICS",
  RECORD_FEEDBACK: "RECORD_FEEDBACK",
  SOLICIT_REVIEW: "SOLICIT_REVIEW",
};

const bookedEngagementShoot = (event: Event) => {
  return event.engagementsession || false;
};
const eventDate = (event: Event) => {
  return event.date;
};
const thirtyDaysBeforeEventDate = (event: Event) => {
  if (!event.date) {
    return undefined;
  }
  const d = new Date(event.date);
  d.setDate(d.getDate() - 30);
  return d;
};
const twoDaysBeforeEventDate = (event: Event) => {
  if (!event.date) {
    return undefined;
  }
  const d = new Date(event.date);
  d.setDate(d.getDate() - 2);
  return d;
};

export const andyWedding: Workflow = {
  tasks: [
    { token: tasks.SEND_CONTRACT, caption: "Send contract" },
    { token: tasks.REQUEST_DEPOSIT, caption: "Sent deposit payment request" },
    {
      token: tasks.WAIT_FOR_CLIENT,
      caption: "Wait for contract/payment",
      prerequisites: [tasks.SEND_CONTRACT, tasks.REQUEST_DEPOSIT],
    },
    {
      token: tasks.RECORD_PAYMENT,
      caption: "Record payment",
      prerequisites: [tasks.WAIT_FOR_CLIENT],
    },
    {
      token: tasks.SEND_BOOKING_CONFIRMATION,
      caption:
        "Send booking confirmation email with engagement shoot instructions",
      prerequisites: [tasks.WAIT_FOR_CLIENT],
    },
    {
      token: tasks.CREATE_ENGAGEMENT_SHOOT,
      caption: "Create empty engagement shoot if booked",
      prerequisites: [tasks.WAIT_FOR_CLIENT],
      isNeeded: bookedEngagementShoot,
    },
    {
      token: tasks.REQUEST_ITINERARY,
      caption: "Request details",
      getSpecialAvailableDate: thirtyDaysBeforeEventDate,
    },
    {
      token: tasks.WAIT_FOR_ITINERARY,
      caption: "Update Notes with details",
      prerequisites: [tasks.REQUEST_ITINERARY],
    },
    {
      token: tasks.SEND_WEDDING_DAY_CONFIRMATION,
      caption: "Send confirmation",
      prerequisites: [tasks.WAIT_FOR_ITINERARY],
    },
    {
      token: tasks.MOVE_PICS_TO_PC,
      caption: "Put pictures on the computer",
      getSpecialAvailableDate: eventDate,
    },
    {
      token: tasks.BACKUP_PICS,
      caption: "Copy to NAS",
      prerequisites: [tasks.MOVE_PICS_TO_PC],
    },
    {
      token: tasks.WAIT_FOR_PAYMENT,
      caption: "Wait for payment",
      prerequisites: [tasks.BACKUP_PICS],
    },
    {
      token: tasks.LOAD_LIGHTROOM,
      caption: "Load into Lightroom",
      prerequisites: [tasks.MOVE_PICS_TO_PC],
    },
    {
      token: tasks.CATEGORIZE,
      caption: "Categorize",
      prerequisites: [tasks.LOAD_LIGHTROOM],
    },
    {
      token: tasks.FIRST_CULL,
      caption: "1st pass cull",
      defaultAssignee: userIds.carly,
      prerequisites: [tasks.LOAD_LIGHTROOM],
    },
    {
      token: tasks.SECOND_CULL,
      caption: "2nd pass cull",
      prerequisites: [tasks.FIRST_CULL, tasks.CATEGORIZE],
    },
    { token: tasks.EDIT, caption: "Edit", prerequisites: [tasks.SECOND_CULL] },
    {
      token: tasks.FINAL_EDIT,
      caption: "2nd pass edit / review",
      defaultAssignee: userIds.gillian,
      prerequisites: [tasks.EDIT],
    },
    {
      token: tasks.MARK_BESTOFS,
      caption: "Mark potential best ofs",
      defaultAssignee: userIds.gillian,
      prerequisites: [tasks.EDIT],
    },
    {
      token: tasks.EXPORT_PICS,
      caption: "Export pictures",
      defaultAssignee: userIds.gillian,
      prerequisites: [tasks.FINAL_EDIT],
    },
    {
      token: tasks.UPLOAD_PIXIESET,
      caption: "Upload pictures",
      prerequisites: [tasks.EXPORT_PICS],
    },
    {
      token: tasks.ADD_BESTOFS,
      caption: "Add potential best ofs to Best Of catalog",
      prerequisites: [tasks.EXPORT_PICS],
    },
    {
      token: tasks.DELIVER_PICS,
      caption: "Deliver pictures",
      prerequisites: [tasks.UPLOAD_PIXIESET],
    },
    {
      token: tasks.SEND_VENUE_PICS,
      caption: "Send pictures to venue",
      prerequisites: [tasks.UPLOAD_PIXIESET],
    },
    {
      token: tasks.RECORD_FEEDBACK,
      caption: "Record feedback",
      prerequisites: [tasks.DELIVER_PICS],
    },
    {
      token: tasks.SOLICIT_REVIEW,
      caption: "Solicit reviews",
      prerequisites: [tasks.RECORD_FEEDBACK],
    },
  ],
};

export const andyShoot: Workflow = {
  tasks: [
    {
      token: tasks.SEND_BOOKING_CONFIRMATION,
      caption:
        "Send booking confirmation email with engagement shoot instructions",
      prerequisites: [],
    },
    {
      token: tasks.SEND_WEDDING_DAY_CONFIRMATION,
      caption: "Send confirmation",
      getSpecialAvailableDate: twoDaysBeforeEventDate,
    },
    {
      token: tasks.MOVE_PICS_TO_PC,
      caption: "Put pictures on the computer",
      getSpecialAvailableDate: eventDate,
    },
    {
      token: tasks.BACKUP_PICS,
      caption: "Copy to NAS",
      prerequisites: [tasks.MOVE_PICS_TO_PC],
    },
    {
      token: tasks.WAIT_FOR_PAYMENT,
      caption: "Wait for payment",
      prerequisites: [tasks.BACKUP_PICS],
    },
    {
      token: tasks.LOAD_LIGHTROOM,
      caption: "Load into Lightroom",
      prerequisites: [tasks.MOVE_PICS_TO_PC],
    },
    {
      token: tasks.SECOND_CULL,
      caption: "2nd pass cull",
      prerequisites: [tasks.MOVE_PICS_TO_PC, tasks.WAIT_FOR_PAYMENT],
    },
    { token: tasks.EDIT, caption: "Edit", prerequisites: [tasks.SECOND_CULL] },
    {
      token: tasks.FINAL_EDIT,
      caption: "2nd pass edit / review",
      defaultAssignee: userIds.gillian,
      prerequisites: [tasks.EDIT],
    },
    {
      token: tasks.EXPORT_PICS,
      caption: "Export pictures",
      defaultAssignee: userIds.gillian,
      prerequisites: [tasks.FINAL_EDIT],
    },
    {
      token: tasks.UPLOAD_PIXIESET,
      caption: "Upload pictures",
      prerequisites: [tasks.EXPORT_PICS],
    },
    {
      token: tasks.DELIVER_PICS,
      caption: "Deliver pictures",
      prerequisites: [tasks.UPLOAD_PIXIESET],
    },
  ],
};

export const carlyShoot: Workflow = {
  tasks: [
    {
      token: tasks.SEND_BOOKING_CONFIRMATION,
      caption:
        "Send booking confirmation email with engagement shoot instructions",
      prerequisites: [],
    },
    {
      token: tasks.SEND_WEDDING_DAY_CONFIRMATION,
      caption: "Send confirmation",
      getSpecialAvailableDate: twoDaysBeforeEventDate,
    },
    {
      token: tasks.MOVE_PICS_TO_PC,
      caption: "Put pictures on the computer",
      getSpecialAvailableDate: eventDate,
    },
    {
      token: tasks.BACKUP_PICS,
      caption: "Copy to NAS",
      prerequisites: [tasks.MOVE_PICS_TO_PC],
    },
    {
      token: tasks.WAIT_FOR_PAYMENT,
      caption: "Wait for payment",
      prerequisites: [tasks.BACKUP_PICS],
    },
    {
      token: tasks.LOAD_LIGHTROOM,
      caption: "Load into Lightroom",
      prerequisites: [tasks.MOVE_PICS_TO_PC],
    },
    {
      token: tasks.SECOND_CULL,
      caption: "2nd pass cull",
      prerequisites: [tasks.MOVE_PICS_TO_PC, tasks.WAIT_FOR_PAYMENT],
    },
    { token: tasks.EDIT, caption: "Edit", prerequisites: [tasks.SECOND_CULL] },
    {
      token: tasks.EXPORT_PICS,
      caption: "Export pictures",
      prerequisites: [tasks.EDIT],
    },
    {
      token: tasks.UPLOAD_PIXIESET,
      caption: "Upload pictures",
      prerequisites: [tasks.EXPORT_PICS],
    },
    {
      token: tasks.DELIVER_PICS,
      caption: "Deliver pictures",
      prerequisites: [tasks.UPLOAD_PIXIESET],
    },
  ],
};
