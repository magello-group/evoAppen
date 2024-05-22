import { Header } from "@/components/Header";
import Feedbackrounds from "@/components/feedbackrounds";


export default function Home() {

  return (
    <>
      <Header title="Magello Feedback 2.0" titleSize="l" description="" hideLogin={false} />
      <div className="flex items-center">
        <div className="flex flex-col items-start">
          <Feedbackrounds />
        </div>
      </div>
    </>
  );
}
