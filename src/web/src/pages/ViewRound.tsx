// import { Header } from "@/components/Header";

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shadcnComponents/ui/resizable";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shadcnComponents/ui/accordion";
import {
  Category,
  ChartData,
  DropDownSettings,
  RoundData,
  UserResponse,
} from "@/misc/RoundDataTypes";

import { Card } from "@/shadcnComponents/ui/card";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ScrollArea } from "@/shadcnComponents/ui/scroll-area";
import {
  transposeToAcculatedData,
  transposeToChartDataforView,
} from "@/misc/CommonRoundsFunctions";
import {
  ScoreDescriptions,
  SettingsDropDown,
} from "@/misc/CommonRoundsComponents";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcnComponents/ui/table";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/shadcnComponents/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useMsal } from "@azure/msal-react";
import { Header } from "@/components/Header";
import config from "@/config/config";
import { colorSchme1 } from "@/misc/colors";
import { loginRequest } from "@/misc/authConfig";

export const ViewRound = () => {
  const { name = "" } = useParams();
  const { instance, accounts } = useMsal();

  const { data } = useQuery({
    queryKey: ["viewData"],
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
      return fetch(config.api.baseUrl + `/view/${name}`, options).then(
        (res) => res.json()
      );
    },
  });
  const apiData = data;
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [accumulatedData, setAccumulatedData] = useState<ChartData[]>([]);
  const [dropDownSettings, setDropDownSettings] = useState<DropDownSettings>({
    dataIsAcc: false,
    chartIsSticky: false,
    sideBySide: true,
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const categories: Category[] = useMemo(
    () => apiData?.templateData?.categories ?? [],
    [apiData]
  );

  // Effect for data manipulation after fetch
  useEffect(() => {
    if (apiData) {
      const tempData: ChartData[] = transposeToChartDataforView(
        apiData?.answers,
        apiData?.templateData?.categories ?? []
      );
      setSelectedUsers(
        apiData?.answers.map((answer: UserResponse) => answer.userName) ?? []
      );
      setChartData(tempData);
    }
  }, [apiData, categories]);

  // Effect for dropdown summarize categories data manipulation
  useEffect(() => {
    if (dropDownSettings.dataIsAcc)
      setAccumulatedData(transposeToAcculatedData(chartData, selectedUsers));
  }, [selectedUsers, dropDownSettings, chartData]);

  const isSmallDevice = window.innerWidth <= 768;

  return (
    <div className="flex flex-col text-xs pb-4">
      <Header
        title={apiData?.name ?? ""}
        titleSize="l"
        hideLogin={false}
        description={``}
      />
      <div className="flex justify-between mb-2">
        <Link to={`/`}>
          <Button variant={"outline"} className="no-underline hover:underline">
            {" "}
            <ArrowLeftIcon />
            <span className="text-xs ml-1">Tillbaka</span>
          </Button>
        </Link>
        <SettingsDropDown
          allUsers={
            apiData?.answers.map((answer: UserResponse) => answer.userName) ??
            []
          }
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          dropDownSettings={dropDownSettings}
          setDropDownSettings={setDropDownSettings}
          isSmallDevice={isSmallDevice}
        />
      </div>

      <>
        {isSmallDevice || !dropDownSettings.sideBySide ? (
          <>
            <Card
              className={`rounded-lg border min-h-[20rem] max-h-[25rem] w-auto h-10 ${dropDownSettings.chartIsSticky && "sticky"
                } top-0 !overflow-visible bg-white dark:bg-dark z-50 `}
            >
              <ViewChart
                apiData={apiData}
                chartData={
                  dropDownSettings.dataIsAcc ? accumulatedData : chartData
                }
                dataIsAcc={dropDownSettings.dataIsAcc}
                selectedUsers={selectedUsers}
                isSmallDevice={isSmallDevice}
                categories={categories}
              />
            </Card>
            <Card className="my-4">
              <ScoreDescriptions
                scoreDescriptions={
                  apiData?.templateData?.scoreScale?.descriptions ?? []
                }
              />
            </Card>
          </>
        ) : (
          <ResizablePanelGroup
            direction={dropDownSettings.sideBySide ? "horizontal" : "vertical"}
            className={`rounded-lg border md:min-h-[20rem] md:max-h-[20rem] min-h-[30rem] max-h-[30rem] ${dropDownSettings.chartIsSticky && "sticky"
              } top-0 !overflow-visible bg-white dark:bg-dark z-50`}
          >
            <ResizablePanel defaultSize={62} className="!overflow-visible">
              <ViewChart
                apiData={apiData}
                chartData={
                  dropDownSettings.dataIsAcc ? accumulatedData : chartData
                }
                dataIsAcc={dropDownSettings.dataIsAcc}
                selectedUsers={selectedUsers}
                isSmallDevice={isSmallDevice}
                categories={categories}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={38}>
              <ScrollArea className="h-full">
                <ScoreDescriptions
                  scoreDescriptions={
                    apiData?.templateData?.scoreScale?.descriptions ?? []
                  }
                />
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </>
      <Card className="mb-8 mt-4 pt-2">
        {categories.map((category, index) => (
          <div key={category?.categoryName} className="px-4 md:px-12">
            <Accordion type="single" collapsible defaultValue={`item-${index}`}>
              <AccordionItem
                value={`item-${index}`}
                className={`${index === categories?.length - 1 ? "border-none" : ""
                  }`}
              >
                <AccordionTrigger className="pb-6 text-lg">
                  {category?.categoryName}
                </AccordionTrigger>
                <AccordionContent className="py-1">
                  <ContentAsTable
                    category={category}
                    answers={apiData?.answers ?? []}
                    selectedUsers={selectedUsers}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </Card>
    </div>
  );
};
const ContentAsTable = ({
  category,
  answers,
  selectedUsers,
}: {
  category: Category;
  answers: UserResponse[];
  selectedUsers: string[];
}) => {

  return category.questions.map((question, index) => (
    <div key={question.id}>
      <p className="my-4 font-bold">
        {index + 1}. {question.text}
      </p>
      <Table className="rounded-lg border">
        {answers.length > 0 ? (
          <>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Namn</TableHead>
                <TableHead className="font-bold">Poäng</TableHead>
                <TableHead className="font-bold">Motivering</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {answers.map((userResponse: UserResponse) => {
                const isSelected = selectedUsers.includes(
                  userResponse.userName
                );
                if (!isSelected) return null;
                const answer = userResponse.answers[question.id];
                if (!answer) return null;
                const score = answer.score ?? 0;
                const motivation = answer.motivation ?? "";

                return (
                  <TableRow key={userResponse.userName}>
                    <TableCell className="">{userResponse?.userName}</TableCell>
                    <TableCell className="font-bold">{score}</TableCell>
                    <TableCell className="italic ">{motivation}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </>
        ) : (
          <TableCaption className="italic mb-4">
            Inga registrerade svar
          </TableCaption>
        )}
      </Table>
    </div>
  ));
};

const ViewChart = ({
  apiData,
  chartData,
  dataIsAcc = false,
  selectedUsers,
  isSmallDevice = false,
}: {
  apiData: RoundData | undefined;
  chartData: ChartData[];
  dataIsAcc: boolean;
  selectedUsers: string[];
  isSmallDevice: boolean;
  categories: Category[];
}) => {

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center italic">Inga svar registrerade</p>
      </div>
    );
  }
  return (
    <ResponsiveContainer width="99%" height="99%">
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="80%"
        data={chartData}
        margin={{ top: 0, left: 50, right: 50, bottom: 0 }}
      >
        <defs>
          <radialGradient
            id="radarchartColorToRed"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="95%" stopColor="#1e40af" />
          </radialGradient>
        </defs>
        <PolarGrid />
        <Tooltip
          accessibilityLayer={true}
          allowEscapeViewBox={{
            x: true,
            y: true,
          }}
          wrapperStyle={{
            zIndex: 1000,
            maxWidth: isSmallDevice ? "15rem" : "30rem",
            textWrap: "wrap",
          }}
          labelFormatter={(_, b) => (
            <>
              <span className="font-bold pb-1 inline-block">
                {b[0]?.payload?.subject}
              </span>
              <br />
              <span
                className="italic"
                style={{ maxWidth: "30rem", textWrap: "wrap" }}
              >
                {b[0]?.payload?.text}
              </span>
            </>
          )}
          formatter={(a, _, c) => {
            return (
              <>
                <span className="font-bold">{a}</span>
                <span style={{ maxWidth: "30rem", textWrap: "wrap" }}>
                  {" "}
                  - {c.payload[`${c.dataKey}-motivation`]}
                </span>
              </>
            );
          }}
        />

        <PolarAngleAxis
          orientation="outer"
          dataKey="id"
          tickFormatter={(_, b) => {
            const index =
              chartData
                .filter((item) => item.subject === chartData[b].subject)
                .findIndex((elem) => elem.id === chartData[b].id) + 1;
            return `${chartData[b].subject} ${!dataIsAcc ? index : ""}`;
          }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[-1, apiData?.templateData?.scoreScale.end ?? 6]}
        />
        {selectedUsers.map((user, index) => (
          <Radar
            key={user + index}
            name={user}
            dataKey={user}
            stroke={colorSchme1[index]}
            fill={colorSchme1[index]}
            fillOpacity={0.3}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
};
