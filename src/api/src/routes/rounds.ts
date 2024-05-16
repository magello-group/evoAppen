import express, { Request } from "express";

import { RoundListModel } from "../models/round";
import mongoose from "mongoose";

const router = express.Router();

type TodoListPathParams = {
  editId: string;
};

router.get("/:editId", async (req: Request<TodoListPathParams>, res) => {
  try {
    const list = await RoundListModel.findOne({ editId: req.params.editId })
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

// router.get("/:editId", async (req: Request, res: Response) => {
//   const editId: string = req.params.editId; // Ensure editId is treated as a string
//   try {
//     const round = await RoundListModel.findOne({ editId }).exec();
//     if (!round) {
//       return res.status(404).json({ error: "Round not found" });
//     }
//     res.json(round);
//   } catch (error) {
//     console.error("Error fetching round:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

export default router;
