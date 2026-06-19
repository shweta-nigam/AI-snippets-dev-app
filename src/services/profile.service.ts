import { db } from "../db/db";

export interface IUserProfile {
  id: number;
  name: string;
  role: string;
  avatarUrl: string;
  createdAt: string;
}

export const getUserProfile = async (): Promise<IUserProfile | null> => {
  try {
    const result = await db.getFirstAsync("SELECT * FROM user_profile LIMIT 1");
    return result as IUserProfile | null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (
  name: string,
  role: string,
  avatarUrl: string
): Promise<boolean> => {
  try {
    await db.runAsync(
      "UPDATE user_profile SET name = ?, role = ?, avatarUrl = ? WHERE id = 1",
      [name, role, avatarUrl]
    );
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};
