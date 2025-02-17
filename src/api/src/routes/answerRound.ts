import express, { Request } from "express";

import { RoundListModel } from "../models/round";
import { TemplateModel } from "../models/template"; // Import the TemplateModel
import mongoose from "mongoose";
import { animals, attributes } from "../models/randomNameList";

const router = express.Router();

type EditParams = {
  editId: string;
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

router.get("/:editId", async (req: Request<EditParams>, res) => {
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
    let userName = "";
    if (doc.nameIsMandatory !== "NAMNGIVET") {
      const rand1 = getRandomInt(attributes.length);
      const rand2 = getRandomInt(animals.length);
      userName = `${attributes[rand1]} ${animals[rand2]}`;
    }

    const { ...rest } = doc;
    delete (rest as any)._id;
    delete (rest as any).answers;

    res.json({ ...rest, userName, templateData: template }); // Send the response without answers and id
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

router.put("/:editId", async (req, res) => {
  try {
    const { editId } = req.params;
    const newAnswer = req.body;
    // Find the document with the given editId
    const existingRound = await RoundListModel.findOne({ editId: editId });

    if (!existingRound) {
      return res.status(404).send("RoundData not found");
    }

    // Check for duplicate userName and handle it by appending a suffix
    const existingUserNames = existingRound.answers.map(
      (answer) => answer.userName
    );
    let userNameToAdd = newAnswer.userName;
    let suffix = 1;

    while (existingUserNames.includes(userNameToAdd)) {
      userNameToAdd = `${newAnswer.userName}(${suffix})`;
      suffix++;
    }

    newAnswer.userName = userNameToAdd;
    existingRound.answers.push(newAnswer);
    await existingRound.save();

    res.status(200).send("Round answers updated successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

export default router;
