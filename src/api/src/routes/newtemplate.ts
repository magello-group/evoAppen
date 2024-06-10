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
        templateName:templateBody.name,
        scoreScale: {
            start:1,
            end:templateBody.scale,
            descriptions: templateBody.scaleDetails.map((detail:ScoreDescription, index:number) => ({
                score: index+1,
                title: detail.heading,
                description: detail.description
              }))
        },
        mandatoryMotivations:false,
        nameIsMandatory: "MANDATORY",
        categories: templateBody.categories.map((cat:InputCategory) => ({
            categoryName: cat.name,
            questions: cat.statements.map((stmt) => ({
              id: stmt.id, // Generating question ID
              text: stmt.text
            }))
          })),
        colorScale: {
         colorName: "Sample Color Scale",
         hexValues: ["#FF5733", "#33FF57", "#3357FF", "#5733FF", "#57FF33"],
        },
    });
   
    // Save the new template to the database
    const savedTemplate = await newTemplate.save();

    // Return the saved template
    // res.status(201).json({});
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

export default router;
