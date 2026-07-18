import type { StudentSession } from "./studentAuth";

export interface StudentLoginResult {
  token: string;
  student: StudentSession;
}
