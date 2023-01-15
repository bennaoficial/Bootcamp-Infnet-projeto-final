import { model, Schema, Types } from "mongoose";

export interface TDocument {
    title: string;
    content: string;
    user_id: number;
};

export const DocumentSchema = new Schema <TDocument>({
    title: { type: 'string', required: true},
    content: {type: 'string', required: true},
    user_id: {type: 'number', required: true},
},
{timestamps: true},
);

export const Document =  model <TDocument> ('documents', DocumentSchema);