import express, { Request } from "express";
import { RoundListModel } from "../models/round";
import mongoose from "mongoose";
import { TemplateModel } from "../models/template";

const router = express.Router();

type ViewParams = {
  id: string;
};
router.get("/", async (req: Request, res) => {
  try {
    const userId = (req as any).preferedUserId;
    const list = await RoundListModel.find({ authorizedUsersIds: userId })
      .orFail()
      .exec();

    res.status(200).json(list);
  } catch (err: any) {
    switch (err.constructor) {
      case mongoose.Error.CastError:
      case mongoose.Error.DocumentNotFoundError:
        return res.status(404).send();
      default:
        return res.status(500).send(); // Send a 500 status code for other errors
    }
  }
});

router.get("/view/:id", async (req: Request<ViewParams>, res) => {
  try {
    const list = await RoundListModel.findById(req.params.id).orFail().exec();
    if (!list.templateId) {
      return res.status(404).send("Template not found");
    }
    const template = await TemplateModel.findById(list.templateId).exec();
    if (!template) {
      return res.status(404).send("Template not found");
    }
    const roundDoc = list.toObject();
    // remove _id to mask viewChart
    res.json({ ...roundDoc, templateData: template });
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
