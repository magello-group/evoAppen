import * as z from 'zod';

export const NewFeedbackroundSchema = z.object({
    name: z.string().min(2, {
        message: "Var god skriv ditt namn."
    }),
    template: z.string().min(2, {
        message: "Var god skriv mallens namn."
    }),
    coworkers: z.string({
        required_error: "Välj medarbetare.",
      }),
    lastdate: z.coerce.date({
        required_error: "Välj sista svarsdatum."
      }),
      identification: z.enum(["anonyma svar", "namngivna svar", "valfritt"], {
    required_error:"Var god och välj identiferings typ."
})
    })