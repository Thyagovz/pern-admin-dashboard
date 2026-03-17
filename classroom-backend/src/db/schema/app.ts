import {relations, type InferInsertModel, type InferSelectModel} from "drizzle-orm";
import {index, integer, jsonb, pgEnum, pgTable, text, timestamp, unique, varchar} from "drizzle-orm/pg-core";
import {user} from "./auth.js";

const timestamps = {
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
}

export const departments = pgTable("departments", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    code: varchar("code", {length: 50}).notNull().unique(),
    name: varchar("name", {length: 255}).notNull(),
    description: varchar("description", {length: 255}),
    ...timestamps
});

export const subjects = pgTable("subjects", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    departmentId: integer("department_id").notNull().references(() => departments.id, {onDelete: "restrict"}),
    name: varchar("name", {length: 255}).notNull(),
    code: varchar("code", {length: 50}).notNull().unique(),
    description: varchar("description", {length: 255}),
    ...timestamps
});

export const classStatusEnum = pgEnum("class_status", ["active", "inactive", "archived"]);

export const classes = pgTable("classes", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    subjectId: integer("subject_id").notNull().references(() => subjects.id, {onDelete: "cascade"}),
    teacherId: text("teacher_id").notNull().references(() => user.id, {onDelete: "restrict"}),
    inviteCode: varchar("invite_code", {length: 50}).notNull().unique(),
    name: varchar("name", {length: 255}).notNull(),
    bannerCldPubId: text("bannerCldPubId"),
    bannerUrl: text("bannerUrl"),
    description: text("description"),
    capacity: integer("capacity").default(50),
    status: classStatusEnum("status").default("active"),
    schedules: jsonb("schedules").$type<any[]>().notNull().default([]),
    ...timestamps
}, (t) => [
    index("classes_subjectId_idx").on(t.subjectId),
    index("classes_teacherId_idx").on(t.teacherId)
]);

export const enrollments = pgTable("enrollments", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    studentId: text("student_id").notNull().references(() => user.id, {onDelete: "cascade"}),
    classId: integer("class_id").notNull().references(() => classes.id, {onDelete: "cascade"}),
    ...timestamps
}, (t) => [
    index("enrollments_studentId_idx").on(t.studentId),
    index("enrollments_classId_idx").on(t.classId),
    unique("enrollments_studentId_classId_unique").on(t.studentId, t.classId)
]);

export const departmentRelations = relations(departments, ({many}) => ({
    subjects: many(subjects)
}));

export const subjectRelation = relations(subjects, ({one, many}) => ({
    department: one(departments, {
        fields: [subjects.departmentId],
        references: [departments.id]
    }),
    classes: many(classes)
}));

export const classesRelations = relations(classes, ({one, many}) => ({
    subject: one(subjects, {
        fields: [classes.subjectId],
        references: [subjects.id]
    }),
    teacher: one(user, {
        fields: [classes.teacherId],
        references: [user.id]
    }),
    enrollments: many(enrollments)
}));

export const enrollmentsRelations = relations(enrollments, ({one}) => ({
    student: one(user, {
        fields: [enrollments.studentId],
        references: [user.id]
    }),
    class: one(classes, {
        fields: [enrollments.classId],
        references: [classes.id]
    })
}));

export type Department = InferSelectModel<typeof departments>;
export type NewDepartment = InferInsertModel<typeof departments>;

export type Subject = InferSelectModel<typeof subjects>;
export type NewSubject = InferInsertModel<typeof subjects>;

export type Class = InferSelectModel<typeof classes>;
export type NewClass = InferInsertModel<typeof classes>;

export type Enrollment = InferSelectModel<typeof enrollments>;
export type NewEnrollment = InferInsertModel<typeof enrollments>;