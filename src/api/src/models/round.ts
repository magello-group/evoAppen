import mongoose, { Schema } from "mongoose";

export interface RoundData {
  name: string;
  editId: string; // This differentiation might only need to exist in the backend
  created: Date;
  answers: UserResponse[];
  templateData?: TemplateData;
  templateId: string;
  authorizedUsers: User[];
  authorizedUsersIds: string[];
  lastDate: Date;
  nameIsMandatory: NameIsMandatory;
}

export interface User {
  userId: string;
  userName: string;
  id?: string;
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

export enum NameIsMandatory {
  ANONYMT = "ANONYMT",
  NAMNGIVET = "NAMNGIVET",
  VALFRITT = "VALFRITT",
}
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
      ref: "templates",
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
        _id: String,
      },
    ],
    authorizedUsersIds: [String],
    answers: [AnswerSchema],
    lastDate: Date,
    motivationsAreMandatory: {
      required: true,
      type: Boolean,
    },
    nameIsMandatory: {
      type: String,
      required: true,
    },
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
