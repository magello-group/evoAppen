import express, { Request } from "express";
import { CoWorkerModel } from "../models/coworkers";

import mongoose from "mongoose";
import { RoundListModel, User } from "../models/round";

const router = express.Router();

router.get("/coworkers", async (req: Request, res) => {
  try {
    const list = await CoWorkerModel.find().orFail().exec();
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

router.post("/", async (req: Request, res) => {
  try {
    const roundBody = req.body;

    // Validate required fields
    if (
      !roundBody.name ||
      !roundBody.template ||
      !roundBody.nameIsMandatory ||
      !roundBody.authorizedUsers
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate a unique editId using Mongoose
    const editId = new mongoose.Types.ObjectId();

    const authorizedUsers = roundBody.authorizedUsers;
    const alreadyExists = authorizedUsers.some(
      (user: User) => user.userId === (req as any)?.preferredUserId
    );
    if (!alreadyExists)
      authorizedUsers.push({
        userId: (req as any)?.preferredUserId,
        userName: (req as any)?.preferredUserName,
        id: new mongoose.Types.ObjectId(),
      });
    const userIdsArray = authorizedUsers.map((elem: User) => elem.userId);

    // Create a new round document
    const newRound = new RoundListModel({
      name: roundBody.name,
      templateId: roundBody.template,
      lastDate: roundBody.lastDate ?? null,
      nameIsMandatory: roundBody.nameIsMandatory,
      motivationsAreMandatory: roundBody.motivationsAreMandatory,
      authorizedUsers: authorizedUsers,
      authorizedUsersIds: userIdsArray,
      description: roundBody.description ?? "",
      editId: editId.toString(), // Add editId to the new round object
      created: new Date(),
    });

    // Save the new round to the database
    const savedRound = await newRound.save();

    // Return the saved round
    res.status(201).json(savedRound);
  } catch (err: any) {
    switch (err.constructor) {
      case mongoose.Error.ValidationError:
        return res.status(400).json({ error: err.message });
      case mongoose.Error.CastError:
      case mongoose.Error.DocumentNotFoundError:
        return res.status(404).send();
      default:
        return res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const userId = (req as any).preferredUserId;

  const { id } = req.params;
  try {
    const deletedRound = await RoundListModel.findByIdAndDelete(id);

    if (!deletedRound) {
      return res.status(404).json({ error: "Round not found" });
    }

    const list = await RoundListModel.find({
      authorizedUsersIds: { $in: [userId] },
    }).exec();

    if (!list || list.length === 0) {
      return res.status(200).json([]); // Return empty array if no rounds found
    }

    return res.status(200).json({
      message: "Round deleted successfully",
      rounds: list,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
