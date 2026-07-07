import { Subject } from "@/types";

export const MOCK_SUBJECTS: Subject[] = [
    {
    id: 1,
    code: 'CS101',
    name: 'Introduction to Computer Science',
    department: 'Computer Science', // Department is a string here
    description: 'This course provides an introduction to the principles and practices of computer science, including algorithms, data structures, and programming.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: 'MATH101',
    name: 'Calculus',
    department: 'Mathematics',
    description: 'This course provides an introduction to calculus, including limits, derivatives, and integrals.',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    code: 'HIST101',
    name: 'World History',
    department: 'History',
    description: 'This course provides an overview of world history from ancient times to the present day.',
    createdAt: new Date().toISOString()
  }
];