import { Client, EmailTemplate, ScheduledEvent, User } from "./definitions";

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
const realisticClient = "e6e15727-9fe1-4961-8c5b-ea44a9bd81aa";
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
  {
    id: realisticClient,
    user_id: andyId,
    primarypersonname: "Sara LaPlant",
    primarypersonemail: "saralp@yahoo.com",
    primarypersonphone: "(585) 589-5782",
    source: "Wedding Wire",
    notes:
      "Loved her engagement photos. Groom is Bryan. They're not shy but a bit awkward in front of the camera. Not picky.",
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
    cost: 0,
    duration: 0,
    engagementsession: false,
    priorityediting: false,
    numphotographers: 0,
    location: "",
    location2: "",
    location3: "",
    location4: "",
    pixieseturl: "",
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
    duration: 1,
    engagementsession: false,
    priorityediting: false,
    numphotographers: 1,
    location2: "",
    location3: "",
    location4: "",
    pixieseturl: "",
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
    title: "",
    pixieseturl: "",
  },
  {
    client_id: realisticClient,
    user_id: andyId,
    type: "Shoot",
    id: "e6e15727-9fe1-4961-8c5b-ea44a9bd81a1",
    notes: "meeting at tinker. rescheduling because of rain.",
    title: "Engagement shoot at Tinker",
    date: new Date("11/9/2024"),
    location: "Tinker",
    pixieseturl: "https://www.gallery.bemontphoto.com/saraandbryan",
  },
  {
    client_id: realisticClient,
    user_id: andyId,
    type: "Meeting",
    id: "e6e15727-9fe1-4961-8c5b-ea44a9bd81a2",
    notes: `
Join Zoom Meeting
https://us05web.zoom.us/j/83482246143?pwd=NOWFq3HSi48Ht8ykxB9iy15CaBuN4L.1

Meeting ID: 834 8224 6143
Passcode: 7ciGVF `,
    title: "Zoom meeting",
    date: new Date("10/5/2024"),
  },
  {
    client_id: realisticClient,
    user_id: andyId,
    seconduser_id: carlyId,
    type: "Wedding",
    id: "e6e15727-9fe1-4961-8c5b-ea44a9bd81a3",
    notes: `

We are going to send a check, can you send me your address and who I should make it out to? 

Also, Bridgett at Ravenwood is working on the typed up copy of our schedule for the wedding day. She anticipated Greg arriving for “final touches” photos at 1:30, then first look with Greg and reveal with my dad around 2. Girls will begin getting ready early, so we won’t need you to be there that early, but would like to get some getting ready shots.

Since we are doing the first look we were hoping to get our bridal party and immediate family photos done before the ceremony. Would that be possible? 

Bridgett also said she would like our photos before the 4PM ceremony to be done by 3:30 so we aren’t out and about when guests begin arriving. 

I’m sure you have a method and process that you usually follow on wedding days, so advice is appreciated! 

Here is a link to the photo list I’ve created. Let me know if you have any questions or if you need any other information from us. As soon as I get the final timeline from Ravenwood I’ll forward that on to you as well! 

Looking forward to it! `,
    title: "Sara and Bryan",
    date: new Date("7/5/2025"),
    cost: 2750,
    duration: 8,
    engagementsession: true,
    priorityediting: true,
    location: "Ravenwood",
    location2: "5 Chalet Circle 14618",
    location3: "Rochester",
    numphotographers: 2,
  },
];

const emailTemplates: EmailTemplate[] = [
  {
    id: "e6e15727-9fe1-4961-8c5b-ea44a9bd8222",
    user_id: carlyId,
    title: "I'm Available",
    text: `Hi there! I'm a dumb ass slut with an attitude! Book me!

Yours,
Carly`,
  },
  {
    id: "e6e15727-9fe1-4961-8c5b-ea44a9bd8111",
    user_id: andyId,
    title: "Available",
    text: `Hi there!

Congratulations on your engagement! We are available on your date and we'd love to work with you. What have you planned so far?

We're a family team - me (Andy), my wife Gillian, and her sister Carly. Our packages include two photographers and an engagement session - for 8 hours it's $2575 and for 10 hours it's $2950. You can check out www.bemontphoto.com for lots of additional details and lots of our work.

Let me know what questions I can answer, and I'm always happy to do a Zoom call!

Thanks!
Andy`,
  },
];

export { users, clients, scheduledEvents, emailTemplates };
