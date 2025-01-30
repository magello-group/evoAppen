import express, { Request } from "express";
import mongoose from "mongoose";
import { TemplateModel } from "../models/template";

interface ScoreDescription {
  label: string;
  heading: string;
  description: string;
}

interface Statement {
  id: string;
  text: string;
}

interface InputCategory {
  id: string;
  name: string;
  statements: Statement[];
}

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

router.post("/", async (req: Request, res) => {
  try {
    const templateBody = req.body;

    // Validate required fields
    if (
      !templateBody.name ||
      !templateBody.scale ||
      !templateBody.scaleDetails ||
      !templateBody.categories
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new template document
    const newTemplate = new TemplateModel({
      templateName: templateBody.name,
      scoreScale: {
        start: 1,
        end: templateBody.scale,
        descriptions: templateBody.scaleDetails.map(
          (detail: ScoreDescription, index: number) => ({
            score: index + 1,
            title: detail.heading,
            description: detail.description,
          })
        ),
      },
      categories: templateBody.categories.map((cat: InputCategory) => ({
        categoryName: cat.name,
        questions: cat.statements.map((stmt) => ({
          id: stmt.id,
          text: stmt.text,
        })),
      })),
      colorScale: {
        colorName: "Sample Color Scale",
        hexValues: ["#FF5733", "#33FF57", "#3357FF", "#5733FF", "#57FF33"],
      },
    });

    const savedTemplate = await newTemplate.save();

    res.status(201).json(savedTemplate);
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

router.delete("/:id", async (req: Request, res) => {
  try {
    const { id } = req.params;
    const deletedTemplate = await TemplateModel.findByIdAndDelete(id);
    if (!deletedTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Fetch updated list after deletion
    const updatedList = await TemplateModel.find({}, "_id templateName").exec();

    return res.status(200).json({
      message: "Template deleted successfully",
      templates: updatedList,
    });
  } catch (err: any) {
    switch (err.constructor) {
      case mongoose.Error.CastError:
        return res.status(400).json({ error: "Invalid template ID format" });
      default:
        return res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.put("/:id", async (req: Request, res) => {
  try {
    const { id } = req.params;
    const templateBody = req.body;

    // Validate required fields
    if (
      !templateBody.name ||
      !templateBody.scale ||
      !templateBody.scaleDetails ||
      !templateBody.categories
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedTemplate = await TemplateModel.findByIdAndUpdate(
      id,
      {
        templateName: templateBody.name,
        scoreScale: {
          start: 1,
          end: templateBody.scale,
          descriptions: templateBody.scaleDetails.map(
            (detail: ScoreDescription, index: number) => ({
              score: index + 1,
              title: detail.heading,
              description: detail.description,
            })
          ),
        },
        categories: templateBody.categories.map((cat: InputCategory) => ({
          categoryName: cat.name,
          questions: cat.statements.map((stmt) => ({
            id: stmt.id,
            text: stmt.text,
          })),
        })),
      },
      { new: true, runValidators: true }
    ).orFail();

    res.json(updatedTemplate);
  } catch (err: any) {
    switch (err.constructor) {
      case mongoose.Error.ValidationError:
        return res.status(400).json({ error: err.message });
      case mongoose.Error.CastError:
        return res.status(400).json({ error: "Invalid template ID format" });
      case mongoose.Error.DocumentNotFoundError:
        return res.status(404).json({ error: "Template not found" });
      default:
        return res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.get("/:id", async (req: Request, res) => {
  try {
    const { id } = req.params;
    const template = await TemplateModel.findById(id).orFail();
    res.json(template);
  } catch (err: any) {
    switch (err.constructor) {
      case mongoose.Error.CastError:
        return res.status(400).json({ error: "Invalid template ID format" });
      case mongoose.Error.DocumentNotFoundError:
        return res.status(404).json({ error: "Template not found" });
      default:
        return res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default router;
