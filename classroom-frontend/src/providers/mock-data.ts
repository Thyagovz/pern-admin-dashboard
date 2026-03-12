import {Subject} from "@/types";

export const MOCK_SUBJECTS: Subject[] = [
    {
        id: 1,
        code: "CS101",
        name: "Introduction to Computer Science",
        department: "CS",
        description: "A foundational course covering the basics of programming, algorithms, and data structures using Python.",
        createdAt: "2024-01-15T10:00:00Z"
    },
    {
        id: 2,
        code: "MATH201",
        name: "Linear Algebra",
        department: "Math",
        description: "An in-depth study of vectors, matrices, systems of linear equations, and vector spaces.",
        createdAt: "2024-01-20T11:00:00Z"
    },
    {
        id: 3,
        code: "ENG305",
        name: "Contemporary English Literature",
        department: "English",
        description: "Exploring modern literary movements and significant English works from the 20th and 21st centuries.",
        createdAt: "2024-02-01T09:00:00Z"
    }
];
