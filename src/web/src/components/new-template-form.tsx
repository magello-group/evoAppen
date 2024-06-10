"use client";
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/shadcnComponents/ui/button";
import { Card, CardContent, CardFooter } from "@/shadcnComponents/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shadcnComponents/ui/accordion";
import { Label } from "@/shadcnComponents/ui/label";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/misc/authConfig";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import config from "@/config/config";

type Statement = {
  id: string;
  text: string;
};

type Category = {
  id: string;
  name: string;
  statements: Statement[];
};

type FormValues = {
  name: string;
  scale: number;
  scaleDetails: { label: string; heading: string; description: string }[];
  categories: Category[];
};

const NewTemplateForm: React.FC = () => {
  const { instance, accounts } = useMsal();
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      scale: 0,
      scaleDetails: [],
      categories: [],
    },
  });

  const {
    fields: scaleFields,
    append: appendScaleField,
    remove: removeScaleField,
  } = useFieldArray({
    control,
    name: "scaleDetails",
  });

  const {
    fields: categoryFields,
    append: appendCategoryField,
    remove: removeCategoryField,
  } = useFieldArray({
    control,
    name: "categories",
  });

  const scale = watch("scale");
  const categories = watch("categories");

  useEffect(() => {
    const currentLength = scaleFields.length;
    if (currentLength < scale) {
      for (let i = currentLength; i < scale; i++) {
        appendScaleField({ label: "", heading: "", description: "" });
      }
    } else if (currentLength > scale) {
      for (let i = currentLength; i > scale; i--) {
        removeScaleField(i - 1);
      }
    }
  }, [scale, appendScaleField, removeScaleField, scaleFields.length]);

  useEffect(() => {
    clearErrors("categories");
  }, [categories, clearErrors]);

  const handleAddStatement = (cIndex: number) => {
    const updatedCategories = categories.map((category, index) => {
      if (index === cIndex) {
        return {
          ...category,
          statements: [...category.statements, { id: uuidv4(), text: "" }],
        };
      }
      return category;
    });
    setValue("categories", updatedCategories);
  };

  const handleRemoveStatement = (cIndex: number, sIndex: number) => {
    const updatedCategories = categories.map((category, index) => {
      if (index === cIndex) {
        const updatedStatements = category.statements.filter(
          (_, idx) => idx !== sIndex
        );
        return {
          ...category,
          statements: updatedStatements,
        };
      }
      return category;
    });
    setValue("categories", updatedCategories);
  };

  const validateForm = (data: FormValues) => {
    let valid = true;

    clearErrors();

    if (data.categories.length === 0) {
      setError("categories", {
        type: "manual",
        message: "Minst en kategori krävs",
      });
      valid = false;
    } else {
      data.categories.forEach((category, index) => {
        if (category.name.trim() === "") {
          setError(`categories.${index}.name`, {
            type: "manual",
            message: "Kategorinamn är obligatorisk",
          });
          valid = false;
        }
        if (category.statements.length === 0) {
          setError(`categories.${index}.statements`, {
            type: "manual",
            message: "Minst ett påstående krävs",
          });
          valid = false;
        }
      });
    }

    return valid;
  };

  // Define the mutation using useMutation
  const mutation = useMutation({
    mutationFn: async (newData: FormValues) => {
      const temp = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const headers = new Headers();
      const bearer = "Bearer " + temp.accessToken;
      headers.append("Authorization", bearer);
      headers.append("Content-Type", "application/json");

      const response = await fetch(`${config.api.baseUrl}/newtemplate/`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const { mutate } = mutation;
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    if (validateForm(data)) {
      try {
        await mutate(data, {
          onSuccess: () => {
            navigate("/");
          },
        });
      } catch (error) {
        console.error("Error submitting the form:", error);
      }
    }
  };
  return (
    <Card className="w-11/12 border-none">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="flex gap-2 flex-col">
          <div className="flex flex-col justify-between">
            <div className="flex flex-row justify-start items-center">
              <Label htmlFor="name" className="pr-4 mr-4 w-[90px]">
                Namn
              </Label>
              <input
                {...register("name", {
                  required: { value: true, message: "Namn är obligatorisk" },
                })}
                className="flex w-[240px] h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              />
            </div>
            <div className="flex flex-row justify-start items-center w-[300px] h-10">
              <p className="text-sm font-medium text-red-500 dark:text-red-900">
                {errors.name?.message as string}
              </p>
            </div>
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="scoringscale">
              <AccordionTrigger>
                <Label htmlFor="name" className="w-[90px]">
                  Poängskala
                </Label>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="pt-6">
                  <CardContent>
                    <div className="flex flex-col justify-between mb-4">
                      <div className="flex flex-row justify-start items-center">
                        <Label className="pr-4 mr-4 w-[90px]">
                          Poängsskalans storlek
                        </Label>
                        <input
                          type="number"
                          {...register("scale", {
                            required: "Scale is required",
                            min: {
                              value: 1,
                              message: "Poängsskala måste vara minst 1",
                            },
                          })}
                          className="border p-2 rounded w-[240px]"
                          placeholder="positiv tal"
                        />
                      </div>
                      {(errors.scale || (isSubmitted && scale === 0)) && (
                        <div className="flex flex-row justify-start items-center w-[300px] h-10">
                          <p className="text-sm font-medium text-red-500 dark:text-red-900">
                            {errors.scale
                              ? errors.scale.message
                              : "Poängsskalans är obligatorisk."}
                          </p>
                        </div>
                      )}
                    </div>

                    {scaleFields.map((field, index) => (
                      <div key={index} className="space-y-2 border p-2">
                        <div className="flex flex-col justify-start items-start">
                          <div
                            key={field.id}
                            className="flex justify-start items-start space-x-2 mt-2 w-full"
                          >
                            <div className="flex flex-col items-start w-full">
                              <div className="flex flex-row justify-start items-center my-2 w-full">
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
                              <div className="flex flex-col justify-between">
                                <div className="flex flex-row justify-start items-start my-2 w-full">
                                  <Label className="pr-4 mr-4 w-[90px]">
                                    Rubrik
                                  </Label>
                                  <input
                                    type="text"
                                    {...register(
                                      `scaleDetails.${index}.heading` as const,
                                      {
                                        required: "Rubrik är obligatorisk.",
                                      }
                                    )}
                                    className="border p-2 rounded w-[240px] ]"
                                  />
                                </div>
                                {errors.scaleDetails?.[index]?.heading && (
                                  <div className="flex flex-row justify-start items-center w-[300px] h-10">
                                    <p className="text-sm font-medium text-red-500 dark:text-red-900">
                                      {
                                        errors?.scaleDetails[index]?.heading
                                          ?.message
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col justify-start items-start">
                                <div className="flex flex-row justify-start items-center my-2">
                                  <Label className="pr-4 mr-4 w-[90px]">
                                    Beskrivning
                                  </Label>
                                  <textarea
                                    {...register(
                                      `scaleDetails.${index}.description` as const,
                                      {
                                        required:
                                          "Beskrivning är obligatorisk.",
                                      }
                                    )}
                                    className="flex w-[240px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                                  />
                                </div>
                                {errors.scaleDetails?.[index]?.description && (
                                  <div className="flex flex-row justify-start items-center w-[300px] h-10">
                                    <p className="text-sm font-medium text-red-500 dark:text-red-900">
                                      {
                                        errors?.scaleDetails[index]?.description
                                          ?.message
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="category">
              <AccordionTrigger>
                <Label htmlFor="name" className="pr-4 mr-4 w-[140px]">
                  Lägg till kategori
                </Label>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="pt-6">
                  <CardContent>
                    <div className="flex flex-col justify-start items-start">
                      <div className="flex flex-row justify-start items-center w-full">
                        <Label className="pr-4 mr-4 w-[140px]">
                          Lägg till Kategori
                        </Label>

                        <PlusCircledIcon
                          className="ml-4"
                          onClick={() =>
                            appendCategoryField({
                              id: uuidv4(),
                              name: "",
                              statements: [],
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-row justify-start items-center w-[300px] h-10">
                        {categoryFields.length === 0 && isSubmitted && (
                          <p className="text-red-500 text-sm">
                            Minst en kategori krävs
                          </p>
                        )}
                      </div>
                    </div>

                    {categoryFields.map((category, cIndex) => (
                      <div key={category.id} className="space-y-2 border p-2">
                        <div className="flex flex-col justify-start items-start">
                          <div className="flex flex-row justify-start items-center w-full">
                            <Label className="py-2 w-[140px]">
                              Kategori namn
                            </Label>
                            <input
                              type="text"
                              {...register(`categories.${cIndex}.name`, {
                                required: "Kategori namn är obligatorisk",
                              })}
                              className="flex w-[240px] h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                            />
                            <div className="flex justify-center items-center ml-4">
                              <Label htmlFor="terms">Ta bort kategori</Label>
                              <Trash
                                className="h-4 w-4 ml-2"
                                onClick={() => removeCategoryField(cIndex)}
                              />
                            </div>
                          </div>
                          {errors.categories?.[cIndex]?.name && (
                            <div className="flex flex-row justify-start items-center w-[300px] h-10">
                              <p className="text-red-500 text-sm">
                                {errors?.categories[cIndex]?.name?.message}
                              </p>
                            </div>
                          )}
                        </div>
                        {category.statements.map((statement, sIndex) => (
                          <div
                            key={statement.id}
                            className="flex flex-col justify-start items-start"
                          >
                            <div className="flex flex-row justify-start items-center w-full">
                              <Label className="py-2 w-[140px]">
                                Påstående {sIndex + 1}
                              </Label>
                              <textarea
                                {...register(
                                  `categories.${cIndex}.statements.${sIndex}.text`,
                                  { required: "Påstående är obligatorisk" }
                                )}
                                className="flex w-[240px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                              />
                              <div className="flex justify-center items-center ml-4">
                                <Label htmlFor="terms">Ta bort påstående</Label>
                                <Trash
                                  className="h-4 w-4 ml-2"
                                  onClick={() =>
                                    handleRemoveStatement(cIndex, sIndex)
                                  }
                                />
                              </div>
                            </div>

                            {errors.categories?.[cIndex]?.statements?.[
                              sIndex
                            ] && (
                              <div className="flex flex-row justify-start items-center w-[300px] h-10">
                                <p className="text-red-500 text-sm">
                                  {
                                    errors?.categories[cIndex]?.statements[
                                      sIndex
                                    ]?.text?.message
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="flex justify-start items-start gap-x-6">
                          <div className="flex justify-center items-center">
                            <Label htmlFor="terms">Lägg till påstående</Label>
                            <PlusCircledIcon
                              className="h-4 w-4 ml-2"
                              onClick={() => handleAddStatement(cIndex)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
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
        </div>
      </form>
    </Card>
  );
};

export default NewTemplateForm;
