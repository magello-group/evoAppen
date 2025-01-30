import express, { Request } from "express";
import mongoose from "mongoose";
import { TemplateModel } from "../models/template";

const router = express.Router();
router.get("/", async (req: Request, res) => {
  try {
    const list = await TemplateModel.find({}, "_id templateName")
      .orFail()
      .exec();
    res.json(list);
  } catch (err: any) {
    switch (err.constructor) {
      case mongoose.Error.CastError:
      case mongoose.Error.DocumentNotFoundError:
        return res.status(404).send();
      default:
        throw err;
    }
  }
});

export default router;
