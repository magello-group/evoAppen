import { Header } from "@/components/Header";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,

} from "@/shadcnComponents/ui/resizable"
import { Input } from "@/shadcnComponents/ui/input"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/shadcnComponents/ui/accordion"
import { Answer, Category, ChartData, DropDownSettings, RoundData, RoundInsertType } from "@/misc/RoundDataTypes";

import { Card } from "@/shadcnComponents/ui/card";
import { Button } from "@/shadcnComponents/ui/button";
import { Minus, Plus } from "lucide-react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ScrollArea } from "@/shadcnComponents/ui/scroll-area";

import { initializeFormData, transposeToAcculatedData, transposeToChartDataForEdit } from "@/misc/CommonRoundsFunctions";
import { ScoreDescriptions, SettingsDropDown } from "@/misc/CommonRoundsComponents";
import { Label } from "@/shadcnComponents/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { roundInsert } from '@/data/sampleData'
import config from "@/config/config";


const baseUrl = 'http://localhost:8080/api/v1/feedback/';

// const response = await fetch(config.api.baseUrl + '/lists');
// const getList = await response.json();

const mutationFn = (newData: RoundInsertType): Promise<Response> => {
    return fetch(config.api.baseUrl + 'rounds', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    });
};

export const EditRound = () => {
    const { name = "" } = useParams();
    // const { apiData } = useApiFetch<RoundData>(`rounds/edit/${name}`, false)

    const { isPending, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: () => {
            console.log("här")
            return fetch(config.api.baseUrl + `/edit/${name}`).then((res) =>
                res.json(),
            )
        },
    })

    const mutation = useMutation({ mutationFn });



    const apiData = data
    const [chartData, setChartData] = useState<ChartData[]>([])
    const [accumulatedData, setAccumulatedData] = useState<ChartData[]>([])
    const [formState, setFormState] = useState<Answer>({})
    const [userName, setUserName] = useState<string>("")
    const [dropDownSettings, setDropDownSettings] = useState<DropDownSettings>({ dataIsAcc: false, chartIsSticky: false, sideBySide: true })
    const [shouldValidate, setShouldValidate] = useState<boolean>(false)

    const categories: Category[] = useMemo(() => apiData?.templateData?.categories ?? [], [apiData]);
    const formHasError = shouldValidate && (Object.values(formState).some(elem => elem.motivation === "") || userName === "")



    // Effect for data manipulation after fetch
    useEffect(() => {
        if (apiData) {
            setFormState(initializeFormData(apiData.templateData))
            setChartData(transposeToChartDataForEdit(categories, apiData?.templateData?.scoreScale?.start))
        }
    }, [apiData, categories])

    // Effect for dropdown summarize categories data manipulation
    useEffect(() => {
        if (dropDownSettings.dataIsAcc) {
            setAccumulatedData(transposeToAcculatedData(chartData, ["user1"]))
        }
    }, [dropDownSettings, chartData])

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message
    const onChange = (newValue: number | string, id: string, type: 'score' | 'text') => {
        setFormState(prevState => {
            const obj: Answer = { ...prevState };
            const answer = obj[id];
            if (answer) {
                obj[id] = type === 'score' ? { ...answer, score: newValue as number } : { ...answer, motivation: newValue as string };
            }
            return obj;
        });
        setChartData(prevState =>
            prevState.map(elem => {
                if (elem.id === id) {
                    return type === 'score' ? { ...elem, user1: newValue as number } : { ...elem, ["user1-motivation"]: newValue as string };
                } else {
                    return elem;
                }
            })
        );
    }

    const submitRound = () => {
        let formOk = true
        if (apiData?.templateData.mandatoryMotivations) {
            setShouldValidate(true)
            if (Object.values(formState).some(elem => elem.motivation === ""))
                formOk = false
        }
        if (formOk) {
            console.log(`${userName} - submitting`)
            console.log(formState)
        }
    }
    const isSmallDevice = window.innerWidth <= 768

    return (
        <div id="wrapper" className="flex flex-col text-xs pb-4">
            <Header title={apiData?.name ?? ""} titleSize="l" description={"Du har blivit inbjuden att ge feedback. Dina svar är anonyma. Du svarar genom att betygsätta "} hideLogin={true} />
            <Button onClick={() => {
                mutation.mutate(roundInsert as RoundInsertType);
            }}> Add Reound</Button>
            <div className="mb-4">
                <div className="flex justify-between">
                    <>
                        <Label htmlFor="name" >Namn</Label>
                        <Input id="name" className="mt-1" placeholder="Namn" onChange={(e) => setUserName(e.target.value)} />
                    </>
                    <div className="flex items-end">
                        <SettingsDropDown allUsers={[]} selectedUsers={[]} setSelectedUsers={() => { }} dropDownSettings={dropDownSettings} setDropDownSettings={setDropDownSettings} isSmallDevice={isSmallDevice} />
                    </div>
                </div>
                {(formHasError && userName === "") && <ErrorP text="Namn är obligatoriskt" />}
            </div>
            <>
                {isSmallDevice || !dropDownSettings.sideBySide ? (
                    <>
                        <Card className={`rounded-lg border min-h-[20rem] max-h-[25rem] w-auto h-10 ${dropDownSettings.chartIsSticky && 'sticky'} top-0 !overflow-visible bg-white dark:bg-dark z-50`}>
                            <EditChart
                                apiData={apiData}
                                chartData={dropDownSettings.dataIsAcc ? accumulatedData : chartData}
                                dataIsAcc={dropDownSettings.dataIsAcc}
                                isSmallDevice={isSmallDevice}
                            />
                        </Card>
                        <Card className="my-4">
                            <ScoreDescriptions
                                scoreDescriptions={apiData?.templateData?.scoreScale?.descriptions ?? []}
                            />
                        </Card>
                    </>
                ) : (
                    <ResizablePanelGroup
                        direction={dropDownSettings.sideBySide ? "horizontal" : "vertical"}
                        className={`rounded-lg border md:min-h-[20rem] md:max-h-[20rem] min-h-[30rem] max-h-[30rem] ${dropDownSettings.chartIsSticky && 'sticky'} top-0 !overflow-visible bg-white dark:bg-dark z-50`}
                    >
                        <ResizablePanel defaultSize={62} className="!overflow-visible">
                            <EditChart
                                apiData={apiData}
                                chartData={dropDownSettings.dataIsAcc ? accumulatedData : chartData}
                                dataIsAcc={dropDownSettings.dataIsAcc}
                                isSmallDevice={isSmallDevice}
                            />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={38}>
                            <ScrollArea>
                                <ScoreDescriptions
                                    scoreDescriptions={apiData?.templateData?.scoreScale?.descriptions ?? []}
                                />
                            </ScrollArea>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                )}
            </>
            <Card className="mb-8 md:mt-4">
                {categories.map((category, index) =>
                    <div key={category?.categoryName} className="md:px-12 px-6">
                        <Accordion type="single" collapsible defaultValue="item-0" >
                            <AccordionItem value={`item-${index}`} className={`${index === categories?.length - 1 ? "border-none" : ""}`}>
                                <AccordionTrigger className="md:pb-6 text-lg">{category?.categoryName}</AccordionTrigger>
                                <AccordionContent>
                                    {category.questions.map((question, ii) =>
                                        <div key={ii} className="flex flex-col mb-8">
                                            <div className="md:flex md:flex-row md:justify-between">
                                                <div className="mt-3" key={question.id}>{ii + 1}. {question.text}</div>
                                                <ScoreComponent id={question.id} start={apiData?.templateData.scoreScale.start ?? 0} end={apiData?.templateData.scoreScale.end ?? 6} formState={formState} onScoreChange={onChange} />
                                            </div>
                                            <Input className="mt-2 mb-2" placeholder="Varför gav du betyget?" onChange={(e) => onChange(e.target.value, question.id, 'text')} />
                                            {(shouldValidate && formState[question.id].motivation === "") && <ErrorP text="Fältet är obligatoriskt" />}
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                )}
            </Card>

            <div className="flex justify-end">
                <div className="flex flex-col items-end">
                    <Button className="w-fit " onClick={() => submitRound()}>Skicka in</Button>
                    {
                        formHasError && <ErrorP text={`Det saknas motiveringar ${userName === "" ? " och namn" : ""}`} />
                    }
                </div>
            </div>

        </div >
    )
}

const EditChart = ({ apiData, chartData, dataIsAcc = false, isSmallDevice = false }: { apiData: RoundData | undefined, chartData: ChartData[], dataIsAcc: boolean, isSmallDevice: boolean }) => {
    return (
        <ResponsiveContainer width="99%" height="99%" >
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData} margin={{ top: 0, left: 65, right: 65, bottom: 0 }}>
                <defs>
                    <radialGradient id="radarchartColorToRed" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#93c5fd" />
                        <stop offset="95%" stopColor="#1e40af" />
                    </radialGradient>
                </defs>
                <PolarGrid />
                <Tooltip
                    itemStyle={{ color: "#1e40af" }}
                    wrapperStyle={{ zIndex: 1000, maxWidth: isSmallDevice ? "15rem" : "30rem", textWrap: "wrap" }}
                    labelFormatter={(_, b) =>
                        <>
                            <span className="font-bold pb-1 ">{b[0]?.payload?.subject}</span>
                            <br />
                            <span className="italic text-wrap" style={{ maxWidth: isSmallDevice ? "15rem" : "30rem", textWrap: "wrap", whiteSpace: "normal" }}>
                                {b[0]?.payload?.text}
                            </span>
                        </>
                    }
                    formatter={(a, _, c) => {
                        return <>
                            <span className="font-bold">
                                {a}
                            </span>
                            <span style={{ maxWidth: isSmallDevice ? "15rem" : "30rem", textWrap: "wrap" }}> {c.payload[`${c.dataKey}-motivation`]}</span>
                        </>
                    }
                    }
                />
                <PolarAngleAxis orientation="outer" dataKey="id" tickFormatter={(_, b) => `${chartData[b].subject} ${!dataIsAcc ? (b + 1) : ''}`} />
                <PolarRadiusAxis angle={30} domain={[- 1, apiData?.templateData.scoreScale.end ?? 6]} />
                <Radar name={dataIsAcc ? "Medelvärde" : "Ditt svar"} dataKey={"user1"} stroke="#dbeafe" fill="url(#radarchartColorToRed)" fillOpacity={0.8} />
            </RadarChart>
        </ResponsiveContainer>)
}

const ScoreComponent = ({ id, start, end, formState, onScoreChange }: { id: string, start: number, end: number, formState: Answer, onScoreChange: (newScore: number, id: string, type: 'score' | 'text') => void }) => {
    const score = formState[id]?.score ?? 1
    return (
        <div className="flex items-center justify-center space-x-2">
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onScoreChange(score - 1, id, 'score')}
                disabled={(score <= start)}
            >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Lägg till poäng</span>
            </Button>
            <div className="flex-1 text-center">
                <div className="text-2xl font-bold tracking-tighter">{score}</div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                    Poäng
                </div>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onScoreChange(score + 1, id, 'score')}
                disabled={(score >= end)}
            >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Ta bort poäng</span>
            </Button>
        </div>
    )
}

const ErrorP = ({ text }: { text: string }) => {
    return (
        <p className={"text-sm font-medium text-red-500 dark:text-red-900"}>{text}</p>)
}