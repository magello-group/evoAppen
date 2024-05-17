import express, { Request } from "express";

import { RoundListModel, UserResponse } from "../models/round";
import { TemplateModel } from "../models/template"; // Import the TemplateModel
import mongoose from "mongoose";

const router = express.Router();

type EditParams = {
  editId: string;
};
type ViewParams = {
  id: string;
};

router.get("/edit/:editId", async (req: Request<EditParams>, res) => {
  try {
    const list = await RoundListModel.findOne({ editId: req.params.editId })
      .select({ _id: 0 }) // Exclude the _id field from the returned document
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

    /**
     * Behöver sätta ett namn här om användaren än anonym, värdet ska ligga i templateData
     *
     */
    const { _id, answers, ...rest } = doc;
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

// router.put(
//   "/edit/:editId",
//   async (req, res) => {
//     try {
//       const { editId } = req.params;

//       // Find the document with the given editId
//       const existingRound = await RoundListModel.findOne({ editId: editId });

//       if (!existingRound) {
//         return res.status(404).send("RoundData not found");
//       }

//       // Update the name of the round
//       existingRound.name = "test1234";

//       // Save the updated document
//       const updatedRound = await existingRound.save();

//       res.status(200).send("Round name updated successfully");
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

router.put(
  "/edit/:editId",
  async (req: Request<EditParams, string, UserResponse>, res) => {
    try {
      const { editId } = req.params;

      // Find the document with the given editId
      const existingRound = await RoundListModel.findOne({ editId: editId });

      if (!existingRound) {
        return res.status(404).send("RoundData not found");
      }

      const bla = await RoundListModel.updateOne(
        { _id: existingRound._id },
        { $push: { answers: req.body } }
      );

      res.status(200).send("OK");
    } catch (err: any) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

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
