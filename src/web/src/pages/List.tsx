import { Header } from "@/components/Header";
import Feedbackrounds from "@/components/feedbackrounds";

export default function List() {
  return (
    <>
      <Header
        title="Magello Feedback 2.0"
        titleSize="l"
        description=""
        hideLogin={false}
      />
      <div className="flex items-center w-full">
        <div className="flex flex-col items-start w-full">
          <Feedbackrounds />
        </div>
      </div>
    </>
  );
}
