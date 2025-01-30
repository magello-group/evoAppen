import express, { Request } from "express";

import { RoundListModel } from "../models/round";

import mongoose from "mongoose";
import { TemplateModel } from "../models/template";

const router = express.Router();

router.get("/", async (req: Request, res) => {
  try {
    const userId = (req as any).preferredUserId;
    // Assuming the user ID is stored in req.preferedUserUd
    // Query to find all rounds where authorizedUsersIds contains the userId
    const list = await RoundListModel.find({
      authorizedUsersIds: { $in: [userId] },
    }).exec();

    if (!list || list.length === 0) {
      return res.status(200).json([]); // Return empty array if no rounds found
    }

    const roundsWithTemplateNames = await Promise.all(
      list.map(async (round) => {
        const template = await TemplateModel.findById(
          round.templateId,
          "templateName"
        ).exec(); // Fetch only the name field
        const roundObj = round.toObject();
        const numberOfRespondents = roundObj.answers.length;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { answers, ...rest } = roundObj;
        return {
          ...rest,
          templateName: template?.toObject()?.templateName ?? "",
          numberOfRespondents: numberOfRespondents,
        };
      })
    );

    res.status(200).json(roundsWithTemplateNames); // Send the list of rounds as JSON response
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

export default router;
