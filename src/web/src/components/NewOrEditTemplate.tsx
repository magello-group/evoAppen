import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/shadcnComponents/ui/button";
import { Card } from "@/shadcnComponents/ui/card";

import { Label } from "@/shadcnComponents/ui/label";
import { ArrowLeftIcon, Trash } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { loginRequest } from "@/misc/authConfig";
import { Link, useNavigate, useParams } from "react-router-dom";
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

export const NewOrEditTemplate = () => {
  const { instance, accounts } = useMsal();
  const { id } = useParams();
  const isEditMode = !!id

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

  // Add query to fetch template data in edit mode
  const { data: templateData } = useQuery({
    queryKey: ["template", id],
    queryFn: async () => {
      if (!isEditMode || !id) return null;

      const temp = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const headers = new Headers();
      const bearer = "Bearer " + temp.accessToken;
      headers.append("Authorization", bearer);

      const response = await fetch(`${config.api.baseUrl}/template/${id}`, {
        headers: headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch template");
      }
      return response.json();
    },
    enabled: isEditMode && !!id,
  });

  // Set form values when template data is loaded
  useEffect(() => {
    if (templateData) {
      setValue("name", templateData.templateName);
      setValue("scale", templateData.scoreScale.end);
      setValue("scaleDetails", templateData.scoreScale.descriptions.map((desc: any) => ({
        label: String(desc.score),
        heading: desc.title,
        description: desc.description,
      })));
      setValue("categories", templateData.categories.map((cat: any) => ({
        id: uuidv4(),
        name: cat.categoryName,
        statements: cat.questions.map((q: any) => ({
          id: q.id || uuidv4(),
          text: q.text,
        })),
      })));
    }
  }, [templateData, setValue]);

  // Add mutation for updating templatef
  const updateMutation = useMutation({
    mutationFn: async (updateData: FormValues) => {
      const temp = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const headers = new Headers();f
      const bearer = "Bearer " + temp.accessToken;
      headers.append("Authorization", bearer);
      headers.append("Content-Type", "application/json");

      const response = await fetch(`${config.api.baseUrl}/template/${id}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

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


      const response = await fetch(`${config.api.baseUrl}/template/`, {
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


  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
  
    if (validateForm(data)) {
      try {
        const submissionData = {
          ...data,
        };

        if (isEditMode) {
          await updateMutation.mutateAsync(submissionData, {
            onSuccess: () => {
              navigate("/");
            },
          });
        } else {
          await mutation.mutate(submissionData, {
            onSuccess: () => {
              navigate("/?tab=templates");
            },
          });
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
      }
    }
  };

  return (
    <>
      <Link to={`/`}>
        <Button variant={"outline"} className="no-underline hover:underline mb-4">
          <ArrowLeftIcon />
          <span className="text-xs ml-1">Tillbaka</span>
        </Button>
      </Link>
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}


          <div className="flex gap-2 flex-col">
            <div className="flex gap-2 flex-col">
              <div className="flex flex-col justify-between pb-4 ">
                <div className="flex flex-row items-center w-full pb-4 gap-x-6">
                  <Label className="w-1/4">Mallnamn</Label>
                  <input

                    {...register("name", {
                      required: { value: true, message: "Namn är obligatorisk" },
                    })}
                    className="w-2/4 border py-2 rounded text-sm px-4"
                  />
                  <div className="w-1/4">
                    
                  </div>
                </div>
                <div className={`flex flex-row  items-center w-[300px] h-10 ${errors.name?.message ? "" : "hidden"}`} >
                  <p className="text-sm font-medium text-red-500 dark:text-red-900">
                    {errors.name?.message as string}
                  </p>
                </div>
              </div>
            </div>

            {/* Scale section */}

            <div className="flex gap-2 flex-col">
              <div className="flex flex-col justify-between pb-4 ">
                <div className="flex flex-row items-center w-full pb-4 gap-x-6">
                  <Label className="w-1/4">Poäng</Label>
                  <input
                    type="number"
                    {...register("scale", {
                      required: "Scale is required",
                      min: { value: 1, message: "Poängsskala måste vara minst 1" },
                    })}
                    className="w-1/4 border py-2 rounded text-sm px-4"
                  />
                  <div className="w-2/4">
                    
                  </div>
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
            </div>




            {/* Scale details fields */}
            {scaleFields.map((_, index) => (
              <div key={index} className="space-y-2 animate-slide-down">
                <div className="flex flex-col w-full">
                  <div className="flex flex-row items-center w-full my-2 gap-x-6">
                    <Label className="w-1/4">Rubrik {index + 1} Poäng</Label>
                    <input
                      type="text"
                      {...register(`scaleDetails.${index}.heading` as const, {
                        required: "Rubrik är obligatorisk.",
                      })}
                      className="w-3/4 border p-2 rounded  text-sm"
                    />
                  </div>

                  <div className="flex flex-row items-start w-full my-2 gap-x-6">
                    <Label className="w-1/4">Beskrivning</Label>
                    <textarea
                      {...register(`scaleDetails.${index}.description` as const, {
                        required: "Beskrivning är obligatorisk.",
                      })}
                      className="w-3/4 rounded-md border px-3 py-2  text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Categories section */}

            <div className="flex flex-col justify-start items-start">
              <Button
                variant={"outline"} className="flex cursor-pointer flex-row justify-start items-center hover:underline mb-4"
                onClick={() => {
                  // e.preventDefault()
                  appendCategoryField({
                    id: uuidv4(),
                    name: "",
                    statements: [],
                  })
                }
                }>
                <Label className="w-[140px] ">
                  Lägg till Kategori
                </Label>
                <PlusCircledIcon
                  className="ml-4"
                />
              </Button>
              {categoryFields.length === 0 && isSubmitted && (
                <div className="flex flex-row justify-start items-center w-[300px] h-10">
                  <p className="text-red-500 text-sm">
                    Minst en kategori krävs
                  </p>
                </div>
              )}
            </div>

            {categoryFields.map((category, cIndex) => (
              <div key={category.id} className="pb-4">
                {/* <div key={category.id} className={cIndex === categoryFields.length - 1 ? `animate-slide-down` : ""}> */}
                <div className="flex flex-row items-center w-full pb-4  gap-x-6">
                  <Label className="w-1/4">Namn</Label>
                  <input
                    type="text"
                    {...register(`categories.${cIndex}.name`, {
                      required: "Kategori namn är obligatorisk",
                    })}
                    className="w-4/6 h-10 rounded-md border px-3 py-2  text-sm "
                  />

                  <div className="flex-1 flex justify-center">
                    <Button
                      variant={"destructive"}
                      className="w-fit"
                      onClick={() => removeCategoryField(cIndex)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Statements */}
                {category.statements.map((statement, sIndex) => (
                  <div key={statement.id} className="flex flex-row items-center w-full pb-4 gap-x-6">
                    <Label className="w-1/4">Påstående {sIndex + 1}</Label>
                    <textarea
                      {...register(`categories.${cIndex}.statements.${sIndex}.text`, {
                        required: "Påstående är obligatorisk"
                      })}
                      className="w-4/6 rounded-md border px-3 py-2 text-sm"
                    />
                    <div className="flex-1 flex justify-center">
                      <Button
                        variant={"destructive"}
                        className="w-fit"
                        onClick={() => handleRemoveStatement(cIndex, sIndex)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}





                <div className="flex justify-start items-start gap-x-6">
                  <Button
                    variant={"outline"} className="flex cursor-pointer flex-row justify-start items-center hover:underline mb-4"
                    onClick={() => {
                      handleAddStatement(cIndex)
                    }
                    }>
                    <Label htmlFor="terms">Lägg till påstående</Label>
                    <PlusCircledIcon
                      className="h-4 w-4 ml-2"

                    />
                  </Button>
                </div>
              </div>

            ))}



            <div className="flex justify-end">
              <Button
                variant="link"
                asChild
                className="border-2 border-solid- border-slate-200 mr-2"
              >
                <a href="/">Avbryt</a>
              </Button>
              <Button type="submit">
                {isEditMode ? "Uppdatera" : "Skapa"}
              </Button>
            </div>

          </div>
        </form>
      </Card>
    </>

  );
}


