import mongoose, { Schema } from "mongoose";

export interface RoundData {
  name: string;
  editId: string; // This differentiation might only need to exist in the backend
  created: Date;
  answers: UserResponse[];
  templateData?: TemplateData;
  templateId: string;
  authorizedUsers: User[];
  authorizedUserIds: string[];
}

export interface User {
  userId: string;
  userName: string;
}

export interface UserResponse {
  userName: string;
  answers: Answer;
}
export interface Answer {
  [questionId: string]: {
    score: number;
    motivation: string;
  };
}

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
const AnswerSchema = new Schema(
  {
    userName: String,
    answers: Schema.Types.Mixed,
  },
  { _id: false }
);

const RoundListSchema = new Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "templates", // This should match the name you used when creating the TemplateModel
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    editId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: false,
    },
    authorizedUsers: [
      {
        userName: String,
        userId: String,
      },
    ],
    authorizedUserIds: [String],
    answers: [AnswerSchema],
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

export const RoundListModel = mongoose.model("rounds", RoundListSchema);

// module.exports = RoundListModel;
