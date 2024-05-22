"use client";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcnComponents/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcnComponents/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shadcnComponents/ui/accordion";
import { Input } from "@/shadcnComponents/ui/input";

import { Button } from "@/shadcnComponents/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/shadcnComponents/ui/label";
import { useState } from "react";
import { Textarea } from "@/shadcnComponents/ui/textarea";

interface Statement {
  id: number;
  text: string;
}

interface Category {
  id: number;
  name: string;
  statements: Statement[];
}

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Namnet måste bestå av minst 2 tecken.",
  }),
  size: z
    .number({
      message: "Hej Storlek på skala är oblikatorisk.",
    })
    .int(),
  categoryname: z.string().min(1, "Kategorinamn är obligatorisk."),
  statements: z.array(
    z.object({
      text: z.string().min(1, "Påstående är obligatorisk."),
    })
  ),
  heading: z.string().min(2, "Rubrik är obligatorisk."),
  description: z.string().min(2, "Description är oblikagorisk."),
});

type FormValues = {
  name: string;
};

const NewTemplateForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [scaleSize, setScaleSize] = useState<number>(0);
  const [scaleInputs, setScaleInputs] = useState<
    { input: string; textarea: string }[]
  >([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",

      categoryname: "",
    },
  });
  console.log(form);
  const addCategory = () => {
    if (!categoryName.trim()) {
      setCategoryError("Kategorinamn är obligatorisk.");
      return;
    }
    setCategories([
      ...categories,
      { id: Date.now(), name: categoryName, statements: [] },
    ]);
    setCategoryName("");
    setCategoryError("");
  };

  const addStatement = (categoryId: number) => {
    const newCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          statements: [...category.statements, { id: Date.now(), text: "" }],
        };
      }
      return category;
    });
    setCategories(newCategories);
  };

  const updateStatementText = (
    categoryId: number,
    statementId: number,
    text: string
  ) => {
    const newCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          statements: category.statements.map((statement) =>
            statement.id === statementId ? { ...statement, text } : statement
          ),
        };
      }
      return category;
    });
    setCategories(newCategories);
  };

  const onScaleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    setScaleSize(size);
    setScaleInputs(Array(size).fill({ input: "", textarea: "" }));
  };

  const updateScaleInput = (
    index: number,
    value: string,
    type: "input" | "textarea"
  ) => {
    const newScaleInputs = [...scaleInputs];
    newScaleInputs[index] = {
      ...newScaleInputs[index],
      [type]: value,
    };
    setScaleInputs(newScaleInputs);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="w-11/12 border-none">
      <CardHeader>
        <CardTitle>Konfiguration</CardTitle>
        <CardDescription>Hur ska mallen fungera.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-start items-start">
                  <div className="flex flex-row justify-start items-center">
                    <FormLabel className="pr-4 mr-4 w-[90px]">Namn</FormLabel>
                    <FormControl>
                      <Input
                        className="w-[200px]"
                        placeholder="magello default"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Accordion type="single" collapsible>
              <AccordionItem value="scoringscale">
                <AccordionTrigger>Poängskala</AccordionTrigger>
                <AccordionContent>
                  <Card className="pt-6">
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem className="flex flex-col justify-start items-start">
                            <div className="flex flex-row justify-start items-center">
                              <FormLabel className="pr-4 mr-4 w-[90px]">
                                Poängsskalans storlek
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...form.register("size")}
                                  /* {...field} */
                                  value={scaleSize}
                                  type="number"
                                  className="w-[200px]"
                                  placeholder="positiv tal"
                                  onChange={onScaleSizeChange}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {scaleInputs.map((scaleInput, index) => (
                        <Card className="pt-2 my-2 w-2/3">
                          <CardContent>
                            <div
                              key={index}
                              className="flex justify-start items-start space-x-2 mt-2"
                            >
                              <div className="flex flex-col items-start">
                                <div className="flex flex-row justify-start items-center my-2">
                                  <div>
                                    <Label className="pr-4 mr-12 w-[90px]">
                                      Poäng
                                    </Label>
                                  </div>
                                  <div>
                                    <Label className="font-medium w-[200px]">{`${
                                      index + 1
                                    }p`}</Label>
                                  </div>
                                </div>
                                <FormField
                                  control={form.control}
                                  name="heading"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-col justify-start items-start my-2">
                                      <div className="flex flex-row justify-start items-center">
                                        <FormLabel className="pr-4 mr-4 w-[90px]">
                                          Rubrik
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            type="text"
                                            value={scaleInput.input}
                                            onChange={(e) =>
                                              updateScaleInput(
                                                index,
                                                e.target.value,
                                                "input"
                                              )
                                            }
                                            className="border p-2 rounded w-[200px]"
                                          />
                                        </FormControl>
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-col justify-start items-start">
                                      <div className="flex flex-row justify-start items-center">
                                        <FormLabel className="pr-4 mr-4 w-[90px]">
                                          Beskrivning
                                        </FormLabel>
                                        <FormControl>
                                          <Textarea
                                            {...field}
                                            value={scaleInput.textarea}
                                            onChange={(e) =>
                                              updateScaleInput(
                                                index,
                                                e.target.value,
                                                "textarea"
                                              )
                                            }
                                            className="flex w-[200px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                                          />
                                        </FormControl>
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="category">
                <AccordionTrigger>Lägg till kategori</AccordionTrigger>
                <AccordionContent>
                  <Card className="pt-6">
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="categoryname"
                        render={({ field }) => (
                          <FormItem className="flex flex-col justify-start items-start">
                            <div className="flex flex-row justify-start items-center w-full">
                              <FormControl>
                                <Input
                                  {...field}
                                  value={categoryName}
                                  onChange={(e) =>
                                    setCategoryName(e.target.value)
                                  }
                                  placeholder="Kategorinamn"
                                />
                              </FormControl>
                              <PlusCircledIcon
                                className="ml-4"
                                onClick={addCategory}
                              />
                            </div>
                            {categoryError ? (
                              <p className="text-red-500">{categoryError}</p>
                            ) : (
                              <FormMessage />
                            )}
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col justify-start items-center mt-4">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className="border my-2 p-4 rounded space-y-2  w-full"
                          >
                            <div className="flex justify-start items-start">
                              <Label htmlFor="terms">Lägg till påstående</Label>
                              <PlusCircledIcon
                                className="h-4 w-4 ml-2"
                                onClick={() => addStatement(category.id)}
                              />
                            </div>
                            <h2 className="font-bold">{category.name}</h2>
                            {category.statements.map((statement) => (
                              <div
                                key={statement.id}
                                className="flex space-x-2 my-2"
                              >
                                <Textarea
                                  value={statement.text}
                                  onChange={(e) => {
                                    updateStatementText(
                                      category.id,
                                      statement.id,
                                      e.target.value
                                    );
                                  }}
                                  placeholder="Statement"
                                  className="flex w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <CardFooter className="flex justify-end">
              <Button
                variant="link"
                asChild
                className="border-2 border-solid- border-slate-200 mr-2"
              >
                <a href="/">Avbryt</a>
              </Button>
              <Button type="submit">Skapa</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewTemplateForm;
