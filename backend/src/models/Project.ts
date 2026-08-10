import { Document, Schema, model } from "mongoose";

export interface IProject extends Document {
    name: string;
    stagingUrl: string;
    productionUrl: string;
    createdAt: Date;
    apikey?: string;
    geminiApiKey?: string;
    owner: Schema.Types.ObjectId;
    tier: 'FREE' | 'PRO';       
}

const ProjectModel = new Schema<IProject>({
    name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true,
    },
    stagingUrl: {
        type: String,
        required: [true,"Staging URL is required"],
        trim: true
    },
    productionUrl: {
        type: String,
        required: [true,"Production URL is required"],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    apikey: {
        type: String,
        trim: true,
    },
    geminiApiKey: {
        type: String,
        trim: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tier: {
        type: String,
        enum: ["FREE", "PRO"],
        default: "FREE",
    }
});

export default model<IProject>('Project', ProjectModel);