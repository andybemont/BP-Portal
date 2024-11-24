import { Client, ScheduledEvent, User } from "./definitions";

const andyId = "76d65c26-f784-44a2-ac19-586678f7c2f3";
const carlyId = "76d65c26-f784-44a2-ac19-586678f7c2f4";
const gillianId = "76d65c26-f784-44a2-ac19-586678f7c2f5";

const users: User[] = [
  {
    name: "Andy",
    email: "andy@bemontphoto.com",
    id: andyId,
    password: "RunaTuna8288",
  },
  {
    name: "Carly",
    email: "carly@bemontphoto.com",
    id: carlyId,
    password: "RunaTuna8288",
  },
  {
    name: "Gillian",
    email: "gillianbemont@gmail.com",
    id: gillianId,
    password: "RunaTuna8288",
  },
];

const weddingClient = "76d65c26-f784-44a2-ac19-586678f7c2f2";
const shootClient = "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa";
const clients: Client[] = [
  {
    id: weddingClient,
    source: "The Knot",
    notes: "some ho",
    user_id: andyId,
    primarypersonname: "Jessie Stinko",
    primarypersonemail: "jstinx@woah.wow",
    primarypersonphone: "585-590-0570",
  },
  {
    id: shootClient,
    user_id: carlyId,
    primarypersonname: "some dumb lead",
  },
];

const scheduledEvents: ScheduledEvent[] = [
  {
    id: "76d65c26-f784-44a2-ac19-586678f7c2f2",
    client_id: weddingClient,
    user_id: andyId,
    date: new Date("12/1/2024"),
    notes: "Went great!",
    title: "Zoom call",
    type: "Meeting",
    time: new Date("1/1/2024 4:00 PM"),
    cost: 0,
    duration: 0,
    engagementsession: false,
    priorityediting: false,
    numphotographers: 0,
    location: "",
    location2: "",
    location3: "",
    location4: "",
    pixiesetUrl: "",
    seconduser_id: carlyId,
    thirduser_id: gillianId,
  },
  {
    id: "76d65c26-f784-44a2-ac19-586678f7c2f3",
    client_id: shootClient,
    user_id: carlyId,
    title: "Senior shoot at Tinker",
    date: new Date("11/30/2024"),
    location: "Tinker",
    notes: "seven outfit changes",
    cost: 275,
    type: "Shoot",
    time: new Date("1/1/2024 4:00 PM"),
    duration: 1,
    engagementsession: false,
    priorityediting: false,
    numphotographers: 1,
    location2: "",
    location3: "",
    location4: "",
    pixiesetUrl: "",
    seconduser_id: carlyId,
    thirduser_id: gillianId,
  },
  {
    id: "76d65c26-f784-44a2-ac19-586678f7c2f4",
    client_id: weddingClient,
    user_id: andyId,
    seconduser_id: carlyId,
    date: new Date("5/25/2025"),
    duration: 8,
    engagementsession: true,
    priorityediting: false,
    numphotographers: 2,
    location: "5 Chalet Circle, Rochester 14618",
    location2: "Ravenwood",
    notes: "Sparkler exit!",
    cost: 2975,
    location3: "",
    location4: "",
    thirduser_id: gillianId,
    type: "Wedding",
    time: new Date("1/1/2024 4:00 PM"),
    title: "",
    pixiesetUrl: "",
  },
];

export { users, clients, scheduledEvents };
