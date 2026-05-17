import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
    name: string;
    email: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
    source: 'Website' | 'Instagram' | 'Referral';
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Lead Schema
const LeadSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        status: {
            type: String,
            enum: ['New', 'Contacted', 'Qualified', 'Lost'],
            default: 'New',
            required: true
        },
        source: {
            type: String,
            enum: ['Website', 'Instagram', 'Referral'],
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

LeadSchema.index({ name: 'text', email: 'text' });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);