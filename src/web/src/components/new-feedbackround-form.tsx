"use client";
import {
  Card,
  CardContent,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcnComponents/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shadcnComponents/ui/command";
import { sampleDataCoworkers } from "@/data/sampleData";

import { Button } from "@/shadcnComponents/ui/button";
import { Input } from "@/shadcnComponents/ui/input";
import { Calendar } from "@/shadcnComponents/ui/calendar";
import { NewFeedbackroundSchema } from "../../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/shadcnComponents/ui/radio-group";
import { z } from "zod";

const NewFeedbackRoundForm = () => {
  const form = useForm<z.infer<typeof NewFeedbackroundSchema>>({
    resolver: zodResolver(NewFeedbackroundSchema),
  });

  const onSubmit = (data: z.infer<typeof NewFeedbackroundSchema>) => {
    try {
      //
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(sampleDataCoworkers);
  return (
    <Card className="w-11/12 border-none">
      <CardHeader>
        <CardTitle>Du skapar nu en ny feedbackomgång</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="nyfeedbackform"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="flex justify-start items-center ml-10">
              <div className="flex flex-col justify-center items-start space-y-4 w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-between items-center">
                      <div className="flex flex-row justify-start items-center">
                        <FormLabel className="pr-4 w-[90px]">Namn</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Feedbackomgångs namn"
                            className="w-[200px]"
                          />
                        </FormControl>
                      </div>
                      <div className="p-2 w-full">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-between items-center">
                      <div className="flex flex-row justify-start items-center">
                        <FormLabel className="pr-4 w-[90px]">Mall</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Mall namn"
                            className="w-[200px]"
                          />
                        </FormControl>
                      </div>
                      <div className="p-2 w-full">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coworkers"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex flex-row justify-start items-center">
                        <FormLabel className="pr-4 w-[90px]">
                          Kollega som kan granska
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? sampleDataCoworkers.find(
                                      (coworker) =>
                                        coworker.name === field.value
                                    )?.name
                                  : "Välj kollega"}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Sök kollega..."
                                className="h-9"
                              />
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {sampleDataCoworkers.map((coworker) => (
                                    <CommandItem
                                      value={coworker.name}
                                      key={coworker.name}
                                      onSelect={() => {
                                        form.setValue(
                                          "coworkers",
                                          coworker.name
                                        );
                                      }}
                                    >
                                      {coworker.name}
                                      <CheckIcon
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          coworker.name === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="p-2 w-full">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastdate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-between items-center">
                      <div className="flex flex-row justify-start items-center">
                        <FormLabel className="pr-4 w-[90px]">
                          Sista svarsdatum
                        </FormLabel>

                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[200px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "yyyy-MM-dd")
                                ) : (
                                  <span>Sista svarsdatum</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="p-2 w-full">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="identification"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-centar items-center space-y-3">
                      <div className="flex flex-row justify-start items-center">
                        <FormLabel className="pr-4 w-[90px]">
                          Identifiering
                        </FormLabel>
                        <FormControl className="flex flex-row ">
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="anonyma svar" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Anonyma svar
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="namngivna svar" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Namngivna svar
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="valfritt" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Valfritt
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <div className="p-2 w-full">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
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
          Skapa
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewFeedbackRoundForm;
