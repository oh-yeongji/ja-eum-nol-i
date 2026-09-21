import mongoose, { Schema, Document } from "mongoose";

export interface WordDocument extends Document {
  word: string;
  definition: string;
  exist: boolean;
  createdAt: Date;
}

const WordSchema: Schema = new Schema({
  word: { type: String, required: true, unique: true, index: true },
  definition: { type: String, default: "" },
  exist: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const WordModel = mongoose.model<WordDocument>("Word", WordSchema);
