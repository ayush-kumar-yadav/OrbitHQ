import { Schema, model, Types, Document } from "mongoose";
import { UserRole } from "../constants/roles";
export interface IOrganizationMember {
  user: Types.ObjectId;
  role: UserRole;
}

export interface IOrganization extends Document {
  name: string;
  slug: string;
  owner: Types.ObjectId;
  members: IOrganizationMember[];
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        role: {
          type: String,
          enum: Object.values(UserRole),
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Organization = model<IOrganization>(
  "Organization",
  organizationSchema
);