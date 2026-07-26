import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";


const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },

    session: {
        fields: {
            user: ["role", "phone", "address"]
        }
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
            },
            phone: {
                type: "string",
                defaultValue: "",
            },
            address: {
                type: "string",
                defaultValue: "",
            },
        },
    },

    database: mongodbAdapter(db, {
        client
    }),
});