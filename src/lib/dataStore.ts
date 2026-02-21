// Shared data store using localStorage so admin changes are visible to students

export interface QAComment {
  id: string;
  author: string;
  authorId: string;
  text: string;
  date: string;
}

export interface QAQuestion {
  id: string;
  authorId: string;
  author: string;
  title: string;
  body: string;
  date: string;
  likes: string[]; // array of user IDs who liked
  comments: QAComment[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string;
}

export interface CBTQuestion {
  id: string;
  course: string;
  question: string;
  options: string[];
  answer: number;
}

export interface PastQuestion {
  id: string;
  title: string;
  course: string;
  type: string;
  url?: string;
  fileName?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  date?: string;
}

const KEYS = {
  cbt: "app_cbt_questions",
  pastQuestions: "app_past_questions",
  tutorials: "app_tutorials",
  announcements: "app_announcements",
  qa: "app_qa_questions",
  projects: "app_projects",
};

const defaultProjects: Project[] = [
  { id: "1", title: "Student Result Management System", description: "Build a web-based system to manage and display student results", tech: "React, Node.js, MongoDB" },
  { id: "2", title: "Library Management System", description: "Create a digital library catalog and borrowing system", tech: "Python, Django, PostgreSQL" },
  { id: "3", title: "E-Voting System", description: "Develop a secure electronic voting platform for departmental elections", tech: "React, Express, JWT" },
];

const defaultQA: QAQuestion[] = [
  {
    id: "1",
    authorId: "demo1",
    author: "John D.",
    title: "How do I connect a React frontend to an Express backend?",
    body: "I'm trying to set up my first full-stack project and I'm not sure how to connect the two.",
    date: "2026-02-14",
    likes: [],
    comments: [
      { id: "c1", author: "Jane S.", authorId: "demo2", text: "Use fetch or axios with your API base URL. Make sure CORS is enabled on Express!", date: "2026-02-14" },
    ],
  },
  {
    id: "2",
    authorId: "demo2",
    author: "Jane S.",
    title: "What's the difference between SQL and NoSQL databases?",
    body: "Can someone explain when to use one over the other?",
    date: "2026-02-12",
    likes: [],
    comments: [],
  },
];

const defaultCBT: CBTQuestion[] = [
  { id: "1", course: "COM 111", question: "What does CPU stand for?", options: ["Central Processing Unit", "Central Program Utility", "Computer Personal Unit", "Central Peripheral Unit"], answer: 0 },
  { id: "2", course: "COM 111", question: "Which of the following is an input device?", options: ["Monitor", "Printer", "Keyboard", "Speaker"], answer: 2 },
  { id: "3", course: "COM 112", question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], answer: 0 },
  { id: "4", course: "COM 112", question: "Which language is used for web styling?", options: ["Python", "CSS", "Java", "C++"], answer: 1 },
  { id: "5", course: "COM 121", question: "What is an algorithm?", options: ["A programming language", "A step-by-step procedure", "A type of computer", "A data structure"], answer: 1 },
];

const defaultPastQuestions: PastQuestion[] = [
  { id: "1", title: "COM 111 - 2023/2024 Exam", course: "COM 111", type: "PDF", url: "#" },
  { id: "2", title: "COM 112 - 2023/2024 Exam", course: "COM 112", type: "PDF", url: "#" },
  { id: "3", title: "COM 121 - 2022/2023 Exam", course: "COM 121", type: "Web", url: "#" },
];

const defaultTutorials: Tutorial[] = [
  { id: "1", title: "Introduction to Programming with Python", description: "Learn the basics of programming using Python", category: "Programming", link: "#" },
  { id: "2", title: "Web Development Fundamentals", description: "HTML, CSS, and JavaScript essentials", category: "Web Dev", link: "#" },
  { id: "3", title: "Database Management with SQL", description: "Understanding relational databases and SQL queries", category: "Database", link: "#" },
];

const defaultAnnouncements: Announcement[] = [
  { id: "1", title: "Semester Exam Timetable Released", content: "The exam timetable for 2024/2025 session has been released. Please check the departmental notice board.", priority: "high", date: "2026-02-15" },
  { id: "2", title: "Hackathon Registration Open", content: "Register for the upcoming departmental hackathon. Teams of 3-5 members.", priority: "medium", date: "2026-02-10" },
];

function load<T>(key: string, defaults: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaults;
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new Event("datastore-update"));
}

export const dataStore = {
  getCBT: () => load<CBTQuestion>(KEYS.cbt, defaultCBT),
  setCBT: (data: CBTQuestion[]) => save(KEYS.cbt, data),

  getPastQuestions: () => load<PastQuestion>(KEYS.pastQuestions, defaultPastQuestions),
  setPastQuestions: (data: PastQuestion[]) => save(KEYS.pastQuestions, data),

  getTutorials: () => load<Tutorial>(KEYS.tutorials, defaultTutorials),
  setTutorials: (data: Tutorial[]) => save(KEYS.tutorials, data),

  getAnnouncements: () => load<Announcement>(KEYS.announcements, defaultAnnouncements),
  setAnnouncements: (data: Announcement[]) => save(KEYS.announcements, data),

  getQA: () => load<QAQuestion>(KEYS.qa, defaultQA),
  setQA: (data: QAQuestion[]) => save(KEYS.qa, data),

  getProjects: () => load<Project>(KEYS.projects, defaultProjects),
  setProjects: (data: Project[]) => save(KEYS.projects, data),
};

