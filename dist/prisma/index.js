"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./generated/prisma");
const prisma = new prisma_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || "",
        },
    },
    log: process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
    transactionOptions: {
        isolationLevel: prisma_1.Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
    },
});
prisma
    .$connect()
    .then(() => {
    console.log("Successfully connected to the database");
})
    .catch((error) => {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
});
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});
process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    process.exit(0);
});
exports.default = prisma;
