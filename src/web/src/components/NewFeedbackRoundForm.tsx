import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Card, CardContent, CardFooter } from "@/shadcnComponents/ui/card";

import { Button } from "@/shadcnComponents/ui/button";
import { useForm, Controller } from "react-hook-form";
import { CalendarIcon, CaretSortIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/shadcnComponents/ui/scroll-area";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcnComponents/ui/popover";
import { Textarea } from "@/shadcnComponents/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import config from "@/config/config";
import { loginRequest } from "@/misc/authConfig";
import { useMsal } from "@azure/msal-react";
import { User } from "@/misc/RoundDataTypes";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/shadcnComponents/ui/skeleton";
import { Checkbox } from "@/shadcnComponents/ui/checkbox";

const FormComponent = () => {
  const { instance, accounts } = useMsal();

  // coworkers in own state
  const {
    watch,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      template: "",
      lastDate: null,
      nameIsMandatory: "ANONYMT",
      motivationsAreMandatory: false,
    },
    mode: "onSubmit", // Ensures validation runs on submit, not on component mount
  });
  const [selectedCoWorkers, setSelectedCoWorkers] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const identification = watch("nameIsMandatory");
  const [messageState, setMessageState] = useState("");
  const [motivationsAreMandatory, setMotivationsAreMandatory] = useState(false);

  useEffect(() => {
    function newText() {
      switch (identification) {
        case "ANONYMT":
          return "Dina svar kommer bli anonyma.";
        case "NAMNGIVET":
          return "Dina svar kommer bli publika.";
        case "VALFRITT":
          return "Dina svar kommer bli publika.";
        default:
          return "";
      }
    }
    setMessageState(newText());
  }, [identification]);

  // Fetch data using useQuery
  const { data, isLoading } = useQuery({
    queryKey: ["newOrEditRound"],
    queryFn: async () => {
      const temp = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const headers = new Headers();
      const bearer = "Bearer " + temp.accessToken;
      headers.append("Authorization", bearer);

      const options = {
        method: "GET",
        headers: headers,
      };

      const [coWorkerList, templateList] = await Promise.all([
        fetch(`${config.api.baseUrl}/newfeedbackround/coworkers`, options).then(
          (res) => res.json()
        ),
        fetch(`${config.api.baseUrl}/newfeedbackround/templates`, options).then(
          (res) => res.json()
        ),
      ]);

      return { coWorkerList, templateList };
    },
  });

  // Define the mutation using useMutation
  const mutation = useMutation({
    mutationFn: async (newData) => {
      const temp = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const headers = new Headers();
      const bearer = "Bearer " + temp.accessToken;
      headers.append("Authorization", bearer);
      headers.append("Content-Type", "application/json");
      const response = await fetch(`${config.api.baseUrl}/newfeedbackround/`, {
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

  const { mutate, isPending, error: mutationError } = mutation;
  const navigate = useNavigate();

  const onSubmit = (inData) => {
    const coWorkersObjectArray = selectedCoWorkers.map((elem: string) =>
      data?.coWorkerList?.find((user: User) => user.userName === elem)
    );
    mutate(
      {
        ...inData,
        authorizedUsers: coWorkersObjectArray,
        description: messageState,
        motivationsAreMandatory: motivationsAreMandatory,
      },
      {
        onSuccess() {
          navigate("/");
        },
      }
    );
  };

  const toggleOption = (e) => {
    const value = e.target.value;
    setSelectedCoWorkers((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  if (isLoading)
    return (
      <Card className="w-full p-10">
        <div className="flex flex-col space-y-12">
          <Skeleton className="h-10  w-3/4" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10  w-3/4" />
          <Skeleton className="h-10  w-3/4" />
          <Skeleton className="h-10  w-3/4" />
          <Skeleton className="h-10  w-3/4" />
        </div>
      </Card>
    );

  return (
    <Card className="w-full p-10">
      <CardContent>
        <form id="nyfeedbackform" onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="flex gap-2 flex-col">
            <div className="flex flex-col justify-between">
              <div className="flex flex-row justify-start items-center">
                <label htmlFor="name" className="pr-4 mr-4 w-1/4">
                  Namn
                </label>
                <input
                  {...register("name", {
                    required: { value: true, message: "Namn är obligatorisk" },
                  })}
                  className="flex  w-1/2 h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                />
              </div>
              <div className="flex flex-row justify-start items-center w-[300px] h-10">
                <p className="text-sm font-medium text-red-500 dark:text-red-900">
                  {errors.name?.message as string}
                </p>
              </div>
            </div>

            {/* Template Field */}
            <div className="flex flex-col justify-between">
              <div className="flex flex-row justify-start items-center">
                <label htmlFor="template" className="pr-4 mr-4 w-1/4">
                  Mall
                </label>
                <Controller
                  name="template"
                  control={control}
                  defaultValue=""
                  rules={{
                    validate: (value) => value.length > 0 || "Välj en mall!",
                  }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="h-10  w-1/2 py-2 px-4 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 "
                    >
                      <option value="" disabled>
                        Välj en mall
                      </option>
                      {data?.templateList?.map((elem) => (
                        <option
                          key={elem.id}
                          value={elem.id}
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-slate-100 focus:text-slate-900 dark:focus:bg-slate-800 dark:focus:text-slate-50"
                        >
                          {elem.templateName}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div className="flex flex-row justify-start items-center w-[300px] h-10">
                <p className="text-sm font-medium text-red-500 dark:text-red-900">
                  {errors?.template?.message as string}
                </p>
              </div>
            </div>
            {/* Coworkers Field */}
            <div className="flex flex-col justify-between">
              <div className="flex flex-row justify-start">
                <label htmlFor="coworkers" className="pr-4 mr-4 w-1/4">
                  Kollega som kan granska
                </label>

                <div className="flex flex-col justify-center w-1/2">
                  <div
                    className={`flex justify-start  flex-wrap text-[12px] pb-2 ${selectedCoWorkers.length > 0 ? "border-gray-300" : ""
                      }`}
                  >
                    {selectedCoWorkers.map((option) => (
                      <span
                        key={option}
                        className="px-[1px] py-[1px] m-[2px] flex  bg-gray-100 border-gray-300"
                      >
                        {option}
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
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        className="flex justify-between pr-1"
                        variant={"outline"}
                      >
                        Välj kollega
                        <span>
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <ScrollArea className="max-h-96">
                        {data?.coWorkerList?.map((coworker: User) => (
                          <label
                            key={coworker.userName}
                            className="block px-4 py-2  w-full hover:bg-gray-100"
                          >
                            <input
                              type="checkbox"
                              value={coworker.userName}
                              checked={selectedCoWorkers.includes(
                                coworker.userName
                              )}
                              onChange={toggleOption}
                              className="mr-2 leading-tight"
                            />
                            <span className="w-full">{coworker.userName}</span>
                          </label>
                        ))}
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex flex-row justify-start w-[300px] h-10">
                <p className="text-sm font-medium text-red-500 dark:text-red-900"></p>
              </div>
            </div>

            <div className="flex flex-col justify-between ">
              <div className="flex flex-row justify-start ">
                <label className="pr-4 mr-4 w-1/4">Identifiering</label>
                <div className="flex flex-col space-y-1 w-[240px] mb-4">
                  <div className="flex items-center space-x-3 space-y-0">
                    <input
                      className="aspect-square h-4 w-4 rounded-full border border-slate-900 text-slate-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                      {...register("nameIsMandatory")}
                      type="radio"
                      value="ANONYMT"
                      id="ANONYMT"
                    />
                    <label htmlFor="ANONYMT" className="font-normal">
                      Anonymt
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 space-y-0">
                    <input
                      className="aspect-square h-4 w-4 rounded-full border border-slate-900 text-slate-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                      {...register("nameIsMandatory")}
                      type="radio"
                      value="NAMNGIVET"
                      id="NAMNGIVET"
                    />
                    <label htmlFor="NAMNGIVET" className="font-normal">
                      Kräv namn
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 space-y-0">
                    <input
                      className="aspect-square h-4 w-4 rounded-full border border-slate-900 text-slate-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                      {...register("nameIsMandatory")}
                      type="radio"
                      value="VALFRITT"
                      id="VALFRITT"
                    />

                    <label htmlFor="VALFRITT" className="font-normal">
                      Valfritt
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between ">
              <div className="flex flex-row justify-start ">
                <label htmlFor="name" className="pr-4 mr-4 w-1/4">
                  Meddelande
                </label>
                <Textarea
                  value={messageState}
                  onChange={(e) => {
                    setMessageState(e.target.value);
                  }}
                  placeholder="Meddelande"
                  className="flex w-1/2 h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                />
              </div>
            </div>
            {/* Last Date Field */}
            <div className="flex flex-col justify-between pt-4">
              <div className="flex flex-row justify-start items-center ">
                <label htmlFor="lastDate" className="pr-4 mr-4 w-1/4">
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
                        className="h-10 p-4 text-gray-900 bg-white border border-gray-300 rounded-md w-full"
                        selected={field.value}
                        onChange={field.onChange}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Välj datum"
                        autoComplete="off"
                      />
                      <CalendarIcon
                        className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                />
              </div>
              <div className="flex flex-row justify-start  w-[300px] h-10 pt-2">
                <p className="text-sm font-medium text-red-500 dark:text-red-900">
                  {errors?.lastDate?.message as string}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between pt-4">
              <div className="flex flex-row justify-start items-center ">
                <label htmlFor="" className="pr-4 mr-4 w-1/4">
                  Motiveringar är obligatoriska
                </label>
                <Checkbox
                  checked={motivationsAreMandatory}
                  onCheckedChange={(value) =>
                    setMotivationsAreMandatory(!!value)
                  }
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="link"
          asChild
          className="border-2 border-solid border-slate-200 mr-2 hover:no-underline hover:bg-slate-100"
        >
          <a href="/">Avbryt</a>
        </Button>
        <Button type="submit" form="nyfeedbackform">
          {isPending ? "Skapar..." : "Skapa"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FormComponent;
