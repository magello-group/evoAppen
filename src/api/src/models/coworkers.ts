
import { Schema, model } from "mongoose";

export interface User {
  userId: string;
  userName: string;
}
const CoWorker = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "coworkers", // This should match the name you used when creating the TemplateModel
  },
  userId: {
    type: String,
    required: true,
  },

  userName: {
    type: String,
    required: true,
  },
});

export const CoWorkerModel = model("coWorkers", CoWorker);


