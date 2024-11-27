export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Client = {
  id: string;
  source?: string;
  notes?: string;
  user_id: string;
  primarypersonname: string;
  primarypersonemail?: string;
  primarypersonphone?: string;
};

export type ScheduledEvent = {
  id: string;
  type: "Wedding" | "Meeting" | "Shoot";
  client_id: string;
  client_name?: string;
  user_id?: string;
  user_name?: string;
  seconduser_id?: string;
  thirduser_id?: string;
  date?: Date;
  title?: string;
  notes?: string;
  cost?: number;
  duration?: number;
  engagementsession?: boolean;
  priorityediting?: boolean;
  numphotographers?: number;
  location?: string;
  location2?: string;
  location3?: string;
  location4?: string;
  pixieseturl?: string;
};

export type ClientDetails = Client & {
  scheduledEvents: ScheduledEvent[];
};

export type EmailTemplate = {
  id: string;
  user_id: string;
  title: string;
  text: string;
};
