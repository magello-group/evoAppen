import { Header } from "@/components/Header";
import { NewOrEditTemplate } from "@/components/NewOrEditTemplate";

export const Template = () => {
  return (
    <main className="flex flex-col justify-center items-between">
      <Header
        title="Skapa mall"
        titleSize="l"
        description=""
        hideLogin={false}
      />
      <NewOrEditTemplate />
    </main>
  );
}
