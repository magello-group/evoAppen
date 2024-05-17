import { Answer, Category, ChartData, Question, TemplateData, UserResponse } from "@/misc/RoundDataTypes"



export const initializeFormData = (templateData: TemplateData): Answer => {
    const allQuestions: Question[] = templateData.categories.flatMap(category => category.questions);
    const formData: Answer = {}
    allQuestions.forEach(elem => {
        formData[elem.id] = {
            score: templateData.scoreScale.start,
            motivation: "",
        }
    })
    return formData
}


export const transposeToChartDataForEdit = (categories: Category[], startScore: number): ChartData[] => {
    const chartData: ChartData[] = [];
    const allQuestions: Question[] = categories.flatMap(category => category.questions);
    allQuestions.forEach(question => {
        const category = categories.find(c => c.questions.some(q => q.id === question.id));
        if (category) {
            chartData.push({
                id: question.id,
                text: question.text,
                subject: category.categoryName,
                user1: startScore,
            });
        }
    })
    return chartData;
}



export const transposeToChartDataforView = (answers: UserResponse[], categories: Category[]) => {
    const chartData: ChartData[] = [];
    const allQuestions: Question[] = categories.flatMap(category => category.questions);
    answers?.forEach(answer => {
        Object.entries(answer.answers).forEach(([questionId, ans]) => {
            const question = allQuestions.find(q => q.id === questionId);
            if (question) {
                const existingData = chartData.find(data => data.id === questionId);
                if (!existingData) {
                    const category = categories.find(category => category.questions.some(q => q.id === questionId));
                    const newChartDataEntry: ChartData = {
                        id: questionId,
                        text: question.text,
                        subject: category?.categoryName || "",
                    };
                    newChartDataEntry[answer.userName] = ans.score; // Initialize user's score
                    newChartDataEntry[answer.userName + "-motivation"] = ans.motivation
                    chartData.push(newChartDataEntry);
                } else {
                    existingData[answer.userName] = ans.score; // Update user's score
                    existingData[answer.userName + "-motivation"] = ans.motivation
                }
            }
        });
    });
    return chartData
}

export const transposeToAcculatedData = (chartData: ChartData[], users: string[]) => {
    const categoryData: { [key: string]: { [key: string]: { sum: number, count: number } } } = {};
    chartData.forEach(item => {
        if (!categoryData[item.subject]) {
            categoryData[item.subject] = {};
        }
        users.forEach(user => {
            if (item[user] !== undefined) {
                if (!categoryData[item.subject][user]) {
                    categoryData[item.subject][user] = { sum: 0, count: 0 };
                }
                categoryData[item.subject][user].sum += item[user] as number;
                categoryData[item.subject][user].count++;
            }
        });
    });
    const result: ChartData[] = Object.keys(categoryData).map(category => {
        const obj: ChartData = { id: category, subject: category, text: "" };
        for (const user in categoryData[category]) {
            obj[user] = parseFloat((categoryData[category][user].sum / categoryData[category][user].count).toFixed(2));
        }
        return obj;
    });
    return result;
}
