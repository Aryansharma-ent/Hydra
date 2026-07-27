import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string; // Optional because OAuth users don't have passwords
  name?: string;
  avatarUrl?: string;
  googleId?: string;
  githubId?: string;
  tier: 'FREE' | 'PRO'
  createdAt: Date;
  
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
    trim: true,
  },
  avatarUrl: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, 
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true,
  },
  tier: {
  type: String,
  enum: ['FREE', 'PRO'],
  default: 'FREE'
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<IUser>("User", UserSchema);