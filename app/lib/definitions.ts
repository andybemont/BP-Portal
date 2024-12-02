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

export type Task = {
  id: string;
  event_id?: string;
  user_id?: string;
  token?: string;
  name: string;
  notes?: string;
  available_date?: Date;
  completed_date?: Date;
};

export type CalendarEntry = {
  client_id: string;
  client_name: string;
  event_id: string;
  task_id?: string;
  user_id?: string;
  user_name?: string;
  seconduser_id?: string;
  seconduser_name?: string;
  thirduser_id?: string;
  thirduser_name?: string;
  date?: Date;
  text: string;
};

export type Event = {
  id: string;
  type: string;
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
  events: EventDetails[];
};

export type EventDetails = Event & {
  tasks: Task[];
};

export type EmailTemplate = {
  id: string;
  user_id: string;
  title: string;
  text: string;
};
