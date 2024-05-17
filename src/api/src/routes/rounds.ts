import express, { Request } from "express";

import { RoundListModel } from "../models/round";
import { TemplateModel } from "../models/template"; // Import the TemplateModel
import mongoose from "mongoose";

const router = express.Router();

type EditParams = {
  editId: string;
};
type ViewParams = {
  viewId: string;
};

router.get("/edit/:editId", async (req: Request<EditParams>, res) => {
  try {
    const list = await RoundListModel.findOne({ editId: req.params.editId })
      .orFail()
      .exec();

    if (!list.templateId) {
      return res.status(404).send("Template not found");
    }

    const template = await TemplateModel.findById(list.templateId).exec();
    if (!template) {
      return res.status(404).send("Template not found");
    }
    const doc = list.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = doc;
    res.json({ ...rest, templateData: template });
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

router.get("/view/:viewId", async (req: Request<ViewParams>, res) => {
  try {
    const list = await RoundListModel.findById(req.params.viewId)
      .orFail()
      .exec();

    if (!list.templateId) {
      return res.status(404).send("Template not found");
    }

    const template = await TemplateModel.findById(list.templateId).exec();
    if (!template) {
      return res.status(404).send("Template not found");
    }
    const doc = list.toObject();
    // remove _id to mask viewChart
    res.json({ ...doc, templateData: template });
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
