export interface RoundData {
  name: string;
  editId: string; // This differentiation might only need to exist in the backend
  created: Date;
  answers: UserResponse[];
  templateData?: TemplateData;
  templateId: string;
  authorizedUsers: User[];
  authorizedUserIds: string[];
  userName?: string;
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
export interface ChartData {
  id: string;
  text: string; // Optional text property
  subject: string;
  [userId: string]: number | string;
}
export interface DropDownSettings {
  dataIsAcc: boolean;
  chartIsSticky: boolean;
  sideBySide: boolean;
}

export interface RoundInsertType {
  lastDateToAnswer: string;
  name: string;
  authorizedUsers: {
    userName: string;
    userId: string;
  }[];
  templateId: string;
}

export interface RoundSubmit {
  userName: string;
  answers: Answer;
}
