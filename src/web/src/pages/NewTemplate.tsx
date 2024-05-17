import { Header } from "@/components/Header";
import NewTemplateForm from "@/components/new-template-form";

export default function NewTemplate() {
  return (
    <main className="flex flex-col justify-center items-between">
      <Header title="Ny mall" titleSize="l" description="" hideLogin={false} />
      <NewTemplateForm />
    </main>
  );
}
