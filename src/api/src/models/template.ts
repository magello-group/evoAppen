import mongoose from "mongoose";

export interface TemplateData {
  _id: string;
  templateName: string;
  scoreScale: scoreScale;
  categories: Category[];
  colorScale: Color;
}
export interface scoreScale {
  start: number;
  end: number;
  descriptions: scoreDescription[];
}

export interface scoreDescription {
  score: string | number;
  title: string;
  description: string;
}
export interface Category {
  categoryName: string;
  questions: Question[];
}
export interface Color {
  colorName: string;
  hexValues: string[];
}

export interface Question {
  id: string;
  text: string;
}

// Define the schema for ScoreDescription
const scoreDescriptionSchema = new mongoose.Schema({
  score: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

// Define the schema for ScoreScale
const scoreScaleSchema = new mongoose.Schema({
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  descriptions: [scoreDescriptionSchema],
});

// Define the schema for Question
const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
});

// Define the schema for Category
const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  questions: [questionSchema],
});

// Define the schema for ColorScale
const colorScaleSchema = new mongoose.Schema({
  colorName: { type: String, required: true },
  hexValues: { type: [String], required: true },
});

// Define the schema for NewTemplateModel
const NewTemplateSchema = new mongoose.Schema({
  templateName: { type: String, required: true },
  scoreScale: scoreScaleSchema,
  categories: [categorySchema],
  colorScale: colorScaleSchema,
});

export const TemplateModel = mongoose.model<TemplateData>(
  "templates",
  NewTemplateSchema,
  "templates"
);
