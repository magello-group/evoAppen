import { useRouteError } from "react-router-dom";

interface RouteError {
  data: string;
  error: {
    columnNumber: number;
    fileName: string;
    lineNumber: number;
    message: string;
    stack: string;
  };
  internal: boolean;
  status: number;
  statusText: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;

  return (
    <main className="flex flex-col justify-center items-center my-6">
      <h1 className="font-semibold text-red-800">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.error.message}</i>
      </p>
    </main>
  );
}
