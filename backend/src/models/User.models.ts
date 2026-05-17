import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: 'Admin' | 'Sales';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthToken(): string;
}

// User Schema
const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        passwordHash: { type: String, required: true },
        role: {
            type: String,
            enum: ['Admin', 'Sales'],
            default: 'Sales',
            required: true
        },
    },
    { timestamps: true }
);

UserSchema.pre('save', async function () {
    if (!this.isModified('passwordHash')) return;

    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});


UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};

UserSchema.methods.generateAuthToken = function (): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(
        {
            id: this._id,
            role: this.role
        },
        secret,
        { expiresIn: '1d' }
    );
};

export const User = mongoose.model<IUser>('User', UserSchema);