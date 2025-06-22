import { IUser } from "../../models/User";

export function validateUser(user: Partial<IUser>): string[] {
  const errors: string[] = [];

  if (!user.name || user.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!user.email || !user.email.includes("@")) {
    errors.push("Valid email is required");
  }

  if (!user.age || user.age < 1 || user.age > 120) {
    errors.push("Age must be between 1 and 120");
  }

  if (!user.department || user.department.trim().length < 2) {
    errors.push("Department must be at least 2 characters long");
  }

  if (!user.role || user.role.trim().length < 2) {
    errors.push("Role must be at least 2 characters long");
  }

  return errors;
}
