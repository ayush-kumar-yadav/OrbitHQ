import { IUser, User } from "../models/user.model";

class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return User.create(userData);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { refreshToken },
      { new: true }
    );
  }
}

export const userRepository = new UserRepository();