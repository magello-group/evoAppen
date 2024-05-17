"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcnComponents/ui/card";

import { Button } from "@/shadcnComponents/ui/button";
import { useForm } from "react-hook-form";

import { useCallback, useEffect } from "react";

type FormValues = {
  name: string;
  radio: string;
  message: string;
};

const NewTemplateForm = () => {
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<FormValues>();

  const identification = watch("radio");

  const onSubmit = async (data: FormValues) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const writeMessage = useCallback((): string => {
    switch (identification) {
      case "anonyma svar":
        return "Dina svar kommer bli anonyma.";
        break;

      case "namngivna svar":
        return "Dina svar kommer bli publika.";
        break;

      case "valfritt":
        return "Dina svar kommer bli publika.";
        break;

      default:
        return "";
    }
  }, [identification]);

  useEffect(() => {
    setValue("message", writeMessage());

    setFocus("message");
  }, [setValue, writeMessage, setFocus]);

  return (
    <Card className="w-11/12">
      <CardHeader>
        <CardTitle>Du skapar nu en ny mall</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="nyfeedbackform" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-between items-center">
            <div className="flex flex-row justify-start items-center">
              <label htmlFor="name" className="pr-4 mr-4 w-[90px]">
                Namn
              </label>
              <input
                {...register("name", {
                  required: { value: true, message: "Namn är obligatorisk" },
                })}
                className="flex h-10 rounded-md border border-slate-200 bg-white px-3 mx-1 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 w-[240px]"
              />
            </div>
            <div className="flex flex-row justify-start items-center w-[300px] h-10">
              <p className="text-sm font-medium text-red-500 dark:text-red-900">
                {errors.name?.message}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center">
            <div className="flex flex-row justify-start items-center">
              <label className="pr-4 mr-4 w-[90px]">Identifiering</label>

              <div className="flex flex-col space-y-1 w-[240px]">
                <div className="flex items-center space-x-3 space-y-0">
                  <input
                    className="aspect-square h-4 w-4 rounded-full border border-slate-900 text-slate-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                    {...register("radio")}
                    type="radio"
                    value="anonyma svar"
                    onClick={() => setValue("message", writeMessage())}
                  />
                  <label className="font-normal">Anonyma svar</label>
                </div>

                <div className="flex items-center space-x-3 space-y-0">
                  <input
                    className="aspect-square h-4 w-4 rounded-full border border-slate-900 text-slate-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                    {...register("radio")}
                    type="radio"
                    value="namngivna svar"
                    onClick={() => setValue("message", writeMessage())}
                  />
                  <label className="font-normal">Namngivna svar</label>
                </div>

                <div className="flex items-center space-x-3 space-y-0">
                  <input
                    className="aspect-square h-4 w-4 rounded-full border border-slate-900 text-slate-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                    {...register("radio")}
                    type="radio"
                    value="valfritt"
                    onClick={() => setValue("message", writeMessage())}
                  />
                  <label className="font-normal">Valfritt</label>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-start items-center w-[300px] h-10">
              <p className="text-sm font-medium text-red-500 dark:text-red-900">
                {errors.radio?.message}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center">
            <div className="flex flex-row justify-start items-center">
              <label htmlFor="name" className="pr-4 mr-4 w-[90px]">
                Meddelande
              </label>
              <input
                value={writeMessage()}
                {...register("message", { required: true })}
                placeholder="Meddelande"
                className="flex h-10 rounded-md border border-slate-200 bg-white px-3 mx-1 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 w-[240px]"
              />
            </div>
            <div className="flex flex-row justify-start items-center w-[300px] h-10">
              <p className="text-sm font-medium text-red-500 dark:text-red-900">
                {errors.message?.message}
              </p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="link"
          asChild
          className="border-2 border-solid- border-slate-200 mr-2"
        >
          <a href="/">Avbryt</a>
        </Button>
        <Button type="submit" form="nyfeedbackform">
          Skapa
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewTemplateForm;
