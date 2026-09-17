import { Schema, model, Document } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description?: string;
    completed: boolean;
    dateTime?: Date;
    deadline?: Date;
    priority?: string;
    category?: string;
    userId: string;
    createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    dateTime: { type: Date }, // Fixes missing start date
    deadline: { type: Date }, // Fixes blank due date
    priority: { type: String, default: 'medium' }, // Fixes missing colors
    category: { type: String, default: 'personal' },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Task = model<ITask>('Task', TaskSchema);