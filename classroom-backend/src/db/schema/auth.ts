import {relations} from "drizzle-orm";
import {boolean, index, pgEnum, pgTable, text, timestamp, unique} from "drizzle-orm/pg-core";

const timestamps = {
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
}

export const roleEnum = pgEnum("role", ["student", "teacher", "admin"]);

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    role: roleEnum("role").default("student").notNull(),
    imageCldPubId: text("imageCldPubId"),
    ...timestamps
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => user.id, {onDelete: "cascade"}),
    ...timestamps
}, (t) => [
    index("session_userId_idx").on(t.userId)
]);

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => user.id),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    ...timestamps
}, (t) => [
    index("account_userId_idx").on(t.userId),
    unique("account_accountId_providerId_unique").on(t.accountId, t.providerId)
]);

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    ...timestamps
}, (t) => [
    index("verification_identifier_idx").on(t.identifier)
]);

export const userRelations = relations(user, ({many}) => ({
    sessions: many(session),
    accounts: many(account),
}));

export const sessionRelations = relations(session, ({one}) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id]
    }),
}));

export const accountRelations = relations(account, ({one}) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id]
    }),
}));
