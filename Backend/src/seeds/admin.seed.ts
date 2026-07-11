import bcrypt from "bcryptjs";
import { connectDatabase, disconnectDatabase } from "@config/database";
import { AdminModel } from "@models/admin.model";
import { env } from "@config/env";

async function seedAdmin() {
    await connectDatabase();

    await AdminModel.deleteMany({});

    const hashedPassword = await bcrypt.hash(env.adminPassword, 10);

    await AdminModel.create({
        email: env.adminEmail,
        password: hashedPassword,
    });

    console.log(`[seed] Admin created with email: ${env.adminEmail}`);

    await disconnectDatabase();
    process.exit(0);
}

seedAdmin().catch((error) => {
    console.error("[seed] Failed:", error);
    process.exit(1);
});
