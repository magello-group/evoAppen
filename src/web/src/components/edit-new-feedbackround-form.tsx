"use client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcnComponents/ui/card";

import {
  sampleDataCoworkers,
  templateData,
  sampleData,
} from "@/data/sampleData";

import { Button } from "@/shadcnComponents/ui/button";
import { useForm, Controller } from "react-hook-form";
import { CalendarIcon, CaretSortIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/shadcnComponents/ui/scroll-area";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type FormValues = {
  name: string;
  template: string;
  coworkers: string[];
  lastDate: Date | null;
};

const NewFeedbackRoundForm = () => {
  const { name: paramName = "" } = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [coworkers, setSelectedOptions] = useState<string[]>([]);

  const {
    setValue,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const chosenRound = sampleData.filter((round) => round.name === paramName);
  const { coworker, lastresponsedate, name, template } = chosenRound[0];

  const onSubmit = async (data: FormValues) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  const toggleOption: ChangeEventHandler<HTMLInputElement> = (e) => {
    const option = e.target.value;

    const index = coworkers.indexOf(option);
    if (index === -1) {
      setSelectedOptions([...coworkers, option]);
    } else {
      const updatedOptions = [...coworkers];
      updatedOptions.splice(index, 1); // Remove the option
      setSelectedOptions(updatedOptions);
    }
  };

  useEffect(() => {
    setValue("name", name);
    setValue("template", template);
    setSelectedOptions(coworker);
    setValue("lastDate", new Date(lastresponsedate));
  }, [coworker, name, template, lastresponsedate, setValue]);

  useEffect(() => {
    setValue("coworkers", coworkers); // Update form value
  }, [coworkers, setValue]);

  return (
    <Card className="w-11/12">
      <CardHeader>
        <CardTitle>Du skapar nu en ny feedbackomgång</CardTitle>
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
              <label htmlFor="name" className="pr-4 mr-4 w-[90px]">
                Mall
              </label>
              <Controller
                name="template"
                control={control}
                defaultValue={""}
                rules={{
                  validate: (value) => value.length > 0 || "Välj en mall!",
                }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="h-10 py-2 px-4 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 w-[240px]"
                  >
                    <option value="" disabled>
                      Välj en mall
                    </option>
                    {templateData.map((template) => (
                      <option
                        key={template.id}
                        value={template.name}
                        className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-slate-100 focus:text-slate-900 data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50"
                      >
                        {template.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
            <div className="flex flex-row justify-start items-center w-[300px] h-10">
              <p className="text-sm font-medium text-red-500 dark:text-red-900">
                {errors.template?.message}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center">
            <div className="flex flex-row justify-start items-center">
              <label htmlFor="coworkers" className="pr-4 mr-4 w-[90px]">
                Kollega som kan granska
              </label>
              <Controller
                name="coworkers"
                control={control}
                defaultValue={[]}
                render={() => (
                  <div className="flex flex-col justify-center items-center w-[240px]">
                    <div
                      className={`flex justify-start items-center flex-wrap w-[240px] text-[12px] ${
                        coworkers.length > 0
                          ? "border-gray-300 rounded-md shadow-md"
                          : ""
                      }`}
                    >
                      {coworkers.map((option) => (
                        <span
                          key={option}
                          className="px-[1px] py-[1px] m-[2px] flex items-center bg-gray-100 border-gray-300"
                        >
                          {option}{" "}
                          <button
                            className="ml-1 text-sm"
                            onClick={() =>
                              toggleOption({ target: { value: option } })
                            }
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="relative" onClick={handleDropdownClick}>
                      <button
                        className="flex justify-between items-center w-[240px] text-left  border border-gray-300 py-2 px-4 rounded-md focus:outline-none focus:bg-white"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        Välj kollega
                        <span className="ml-2">
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="absolute z-10 mt-2 w-[240px] bg-white border border-gray-300 rounded-md shadow-md">
                          <ScrollArea className="h-48 w-54 rounded-md border">
                            {sampleDataCoworkers.map((coworker) => (
                              <label
                                key={coworker.name}
                                className="block px-4 py-2 hover:bg-gray-100"
                              >
                                <input
                                  type="checkbox"
                                  value={coworker.name}
                                  checked={coworkers.includes(coworker.name)}
                                  onChange={toggleOption}
                                  className="mr-2 leading-tight"
                                />
                                <span className="text-sm">{coworker.name}</span>
                              </label>
                            ))}
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              />
            </div>
            <div className="flex flex-row justify-start items-center w-[300px] h-10">
              <p className="text-sm font-medium text-red-500 dark:text-red-900"></p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center">
            <div className="flex flex-row justify-start items-center">
              <label htmlFor="name" className="pr-4 mr-4 w-[90px]">
                Sista svarsdatum
              </label>
              <Controller
                name="lastDate"
                control={control}
                defaultValue={null}
                rules={{ required: "Sista svarsdatum är obligatorisk" }}
                render={({ field }) => (
                  <div className="relative">
                    <DatePicker
                      id="lastDate"
                      className="h-10 p-4 w-[240px] text-gray-900 bg-white border border-gray-300 rounded-md shadow-md"
                      selected={field.value}
                      onChange={field.onChange}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Välj datum"
                    />
                    <CalendarIcon
                      className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                )}
              />
            </div>
            <div className="flex flex-row justify-start items-center w-[300px] h-10">
              <p className="text-sm font-medium text-red-500 dark:text-red-900">
                {errors.lastDate?.message}
              </p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="fleax justify-end">
        <Button
          variant="link"
          asChild
          className="border-2 border-solid- border-slate-200 mr-2"
        >
          <a href="/">Avbryt</a>
        </Button>
        <Button type="submit" form="nyfeedbackform">
          Uppdatera
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewFeedbackRoundForm;
