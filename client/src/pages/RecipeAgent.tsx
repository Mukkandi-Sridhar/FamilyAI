import { useState, type KeyboardEvent } from "react";
import { ChefHat, Clock, Flame, ShoppingCart, Wand2, X } from "lucide-react";
import { Button, Card, EmptyState, ErrorBanner, Input, Label, Spinner, Tag, Textarea } from "../components/ui";
import { generateRecipes, MEAL_TYPES, type MealType, type RecipeResult } from "../lib/api";

const DEFAULT_INGREDIENTS = ["half tomato", "2 onions", "some spinach", "3 eggs", "rice", "wheat", "bread"];

const DIFFICULTY_TONE = { Easy: "good", Mid: "warn", Hard: "bad" } as const;

export default function RecipeAgent() {
  const [ingredients, setIngredients] = useState<string[]>(DEFAULT_INGREDIENTS);
  const [ingredientDraft, setIngredientDraft] = useState("");
  const [servings, setServings] = useState(4);
  const [mealType, setMealType] = useState<MealType>("Breakfast");
  const [mode, setMode] = useState<"simple" | "family">("simple");
  const [adults, setAdults] = useState(5);
  const [children, setChildren] = useState(2);
  const [diet, setDiet] = useState("Non-Vegetarian");
  const [allergies, setAllergies] = useState("Tomato");
  const [healthConditions, setHealthConditions] = useState("Sugar – Type 2");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecipeResult | null>(null);

  function addIngredient() {
    const value = ingredientDraft.trim();
    if (!value) return;
    setIngredients((prev) => [...prev, value]);
    setIngredientDraft("");
  }
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  }
  function removeIngredient(i: number) {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const data = await generateRecipes({
        ingredients,
        servings,
        mode,
        mealType,
        family:
          mode === "family"
            ? { adults, children, diet, allergies, healthConditions }
            : undefined,
      });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium" style={{ color: "var(--color-recipe)" }}>
        Recipe Coach
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight animate-fade-up">What should we cook today?</h1>
      <p className="mt-2 max-w-2xl text-[var(--color-text-dim)]">
        List what's in the kitchen. Switch to Family + Health mode to account for allergies, diet, and conditions
        like diabetes or BP.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <Label>Ingredients on hand</Label>
          <div className="mb-2 flex flex-wrap gap-2">
            {ingredients.map((ing, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1 text-xs"
              >
                {ing}
                <button onClick={() => removeIngredient(i)} aria-label={`Remove ${ing}`}>
                  <X size={12} className="text-[var(--color-text-dim)] hover:text-rose-600" />
                </button>
              </span>
            ))}
          </div>
          <Input
            value={ingredientDraft}
            onChange={(e) => setIngredientDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type an ingredient, press Enter"
            className="mb-5"
          />

          <Label>Servings</Label>
          <Input
            type="number"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value) || 1)}
            className="mb-5"
          />

          <Label>Meal</Label>
          <div className="mb-5 grid grid-cols-4 gap-1.5">
            {MEAL_TYPES.map((m) => (
              <Button key={m} variant={mealType === m ? "primary" : "outline"} className="px-2 text-xs" onClick={() => setMealType(m)}>
                {m}
              </Button>
            ))}
          </div>

          <Label>Mode</Label>
          <div className="mb-5 grid grid-cols-2 gap-2">
            <Button variant={mode === "simple" ? "primary" : "outline"} onClick={() => setMode("simple")}>
              Simple
            </Button>
            <Button variant={mode === "family" ? "primary" : "outline"} onClick={() => setMode("family")}>
              Family + Health
            </Button>
          </div>

          {mode === "family" && (
            <div className="mb-5 flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Adults</Label>
                  <Input type="number" value={adults} onChange={(e) => setAdults(Number(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Children</Label>
                  <Input type="number" value={children} onChange={(e) => setChildren(Number(e.target.value) || 0)} />
                </div>
              </div>
              <div>
                <Label>Dietary preference</Label>
                <Input value={diet} onChange={(e) => setDiet(e.target.value)} />
              </div>
              <div>
                <Label>Allergies</Label>
                <Input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="None" />
              </div>
              <div>
                <Label>Health conditions</Label>
                <Textarea
                  value={healthConditions}
                  onChange={(e) => setHealthConditions(e.target.value)}
                  placeholder="e.g. Sugar – Type 2, BP"
                  rows={2}
                />
              </div>
            </div>
          )}

          <Button className="w-full" onClick={handleGenerate} disabled={loading || ingredients.length === 0}>
            {loading ? <Spinner /> : <Wand2 size={14} />}
            {loading ? "Cooking up ideas..." : "Suggest recipes"}
          </Button>

          {error && (
            <div className="mt-3">
              <ErrorBanner message={error} />
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-3">
          {!result && !loading && (
            <EmptyState
              title="No recipes yet"
              detail="Add your ingredients and hit Suggest recipes — three tailored ideas will show up here."
            />
          )}

          {loading && (
            <Card className="flex items-center justify-center gap-2 p-16 text-[var(--color-text-dim)]">
              <Spinner /> Thinking of what to make...
            </Card>
          )}

          {result && (
            <div className="animate-pop-in flex flex-col gap-6">
              {result.recipes.map((r, i) => (
                <Card key={i} className="p-6">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ChefHat size={18} style={{ color: "var(--color-recipe)" }} />
                      <h3 className="text-base font-semibold">{r.title}</h3>
                    </div>
                    <Tag tone={DIFFICULTY_TONE[r.difficulty]}>{r.difficulty}</Tag>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-4 text-xs text-[var(--color-text-dim)]">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} /> Prep {r.prepTimeMinutes}m · Cook {r.cookTimeMinutes}m
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Flame size={13} /> ~{r.caloriesPerServing} kcal / serving
                    </span>
                  </div>
                  <ol className="mb-4 flex flex-col gap-1.5 text-sm">
                    {r.steps.map((s, si) => (
                      <li key={si} className="flex gap-2.5">
                        <span className="shrink-0 font-medium text-[var(--color-text-dim)]">{si + 1}.</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                  {r.substitutions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {r.substitutions.map((s, si) => (
                        <Tag key={si}>{s}</Tag>
                      ))}
                    </div>
                  )}
                </Card>
              ))}

              <Card className="p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <ShoppingCart size={16} /> Shopping list for tomorrow
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.shoppingList.map((item, i) => (
                    <Tag key={i} tone="brand">
                      {item}
                    </Tag>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
