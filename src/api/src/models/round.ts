import mongoose, { Schema } from "mongoose";

export interface RoundData {
    name: string;
    roundId: string;
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
    userId: string;
    isAnonymous: boolean;
    answers: Answer;
  }
  export interface Answer {
    [questionId: string]: {
      score: number;
      motivation: string;
    };
  }
  
  export interface TemplateData {
    templateId: string;
    templateName: string;
    scoreScale: scoreScale;
    mandatoryMotivations: boolean;
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

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String
}, {
    timestamps: {
        createdAt: "createdDate",
        updatedAt: "updatedDate"
    }
});

export const RoundListModel = mongoose.model<RoundData>("rounds", schema, "rounds");