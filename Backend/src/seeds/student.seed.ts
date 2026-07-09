import { connectDatabase, disconnectDatabase } from "@config/database";
import { StudentModel } from "@models/student.model";
import { studentSeedData } from "./student.data";

async function seedStudents() {
  await connectDatabase();

  await StudentModel.deleteMany({});
  await StudentModel.insertMany(studentSeedData);

  console.log(`[seed] Inserted ${studentSeedData.length} students across classes 1-5`);

  await disconnectDatabase();
  process.exit(0);
}

seedStudents().catch((error) => {
  console.error("[seed] Failed:", error);
  process.exit(1);
});
