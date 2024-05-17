import EditNewFeedbackRoundForm from "@/components/edit-new-feedbackround-form";
import { Header } from "../components/Header";

export default function NewFeedbackRound() {
  return (
    <main className="flex flex-col justify-center items-between">
      <Header title="Ny feedbackomgång" titleSize="l" description="" />
      <EditNewFeedbackRoundForm />
    </main>
  );
}
