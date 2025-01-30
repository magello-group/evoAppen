import { Header } from "@/components/Header";
import NewOrEditRound from "@/components/NewOrEditRound"


export const Round = () => {
  return (
    <main className="flex flex-col justify-center items-between">
      <Header title="Ny feedbackomgång" titleSize="l" description="" hideLogin={false} />
      <NewOrEditRound />
    </main>
  );
}
