import { Schema, model, Document, Types } from "mongoose";
export enum UserRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    Manager = "MANAGER",
    DEVELOPER = "DEVELOPER",
    VIEWER = "VIEWER",
}
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organizationId?: Types.ObjectId | null;
  isEmailVerified: boolean;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.OWNER,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
  type: String,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);

    