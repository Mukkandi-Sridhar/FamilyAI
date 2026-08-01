import { Router } from "express";
import { askStructured } from "../openaiClient.js";

const router = Router();

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recipes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          prepTimeMinutes: { type: "number" },
          cookTimeMinutes: { type: "number" },
          difficulty: { type: "string", enum: ["Easy", "Mid", "Hard"] },
          caloriesPerServing: { type: "number" },
          steps: { type: "array", items: { type: "string" } },
          substitutions: { type: "array", items: { type: "string" } },
        },
        required: [
          "title",
          "prepTimeMinutes",
          "cookTimeMinutes",
          "difficulty",
          "caloriesPerServing",
          "steps",
          "substitutions",
        ],
      },
    },
    shoppingList: { type: "array", items: { type: "string" } },
  },
  required: ["recipes", "shoppingList"],
};

router.post("/generate", async (req, res, next) => {
  try {
    const { ingredients, servings, mode, family, mealType } = req.body;
    if (!Array.isArray(ingredients) || ingredients.length === 0 || !servings) {
      return res.status(400).json({ error: "ingredients[] and servings are required" });
    }

    const ingredientLine = ingredients.join(", ");
    const meal = mealType || "any meal";

    const system =
      mode === "family"
        ? "Act as an experienced Indian nutritionist and home chef. Customize recipes for the given family's dietary preference, allergies, and health conditions (e.g. avoid sugar-spiking ingredients for Type 2 diabetes, avoid allergens entirely). Use only the available ingredients as much as possible, suggesting the closest Indian-kitchen substitute for anything missing. Also produce a shopping list for tomorrow based on what's likely used up today."
        : "Act as a helpful home cooking assistant for an Indian household. Suggest healthy recipes using only the ingredients available, suggesting the closest Indian-kitchen substitute for anything missing.";

    const familyLines =
      mode === "family" && family
        ? `\nFamily Details:\nAdults: ${family.adults}\nChildren: ${family.children}\nDietary Preference: ${family.diet}\nAllergies: ${family.allergies || "None"}\nHealth Conditions: ${family.healthConditions || "None"}`
        : "";

    const result = await askStructured({
      schemaName: "recipe_suggestions",
      schema,
      system,
      user:
        `Available ingredients: ${ingredientLine}\nCooking for: ${servings} people\nMeal: ${meal}${familyLines}\n\n` +
        `Suggest exactly 3 healthy ${meal} recipes using only these ingredients. For each: prep time, cook time, difficulty (Easy/Mid/Hard), step-by-step instructions, approximate calories per serving, and closest Indian-kitchen substitutes for any missing ingredient. Then produce a shopping list.`,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
