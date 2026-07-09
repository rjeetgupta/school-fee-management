import { Schema, model, Document } from "mongoose";

export interface CounterDocument extends Omit<Document, "_id"> {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<CounterDocument>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const CounterModel = model<CounterDocument>("Counter", counterSchema);
