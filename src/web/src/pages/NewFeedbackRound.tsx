import { Header } from "@/components/Header";
import NewFeedbackRoundForm from "@/components/new-feedbackround-form";


export default function NewFeedbackRound() {
  return (
    <main className="flex flex-col justify-center items-between">
      <Header title="Ny feedbackomgång" titleSize="l" description="" hideLogin={false} />
      <NewFeedbackRoundForm />
    </main>
  );
}
