import mongoose, { Schema } from "mongoose";

export enum NameIsAnonymous {
  ANONYMT,
  NAMNGIVET,
  VALFRITT,
}

export interface TemplateData {
  _id: string;
  templateName: string;
  scoreScale: scoreScale;
  mandatoryMotivations: boolean;
  nameIsAnonymous: NameIsAnonymous;
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

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

export const TemplateModel = mongoose.model<TemplateData>(
  "templates",
  schema,
  "templates"
);
