import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcnComponents/ui/card";
import { Button } from "@/shadcnComponents/ui/button";
import { Input } from "@/shadcnComponents/ui/input";
import { Label } from "@radix-ui/react-label";

export default function LogIn() {
  return (
    <main className="flex flex-col justify-around items-center gap-5">
      <h1 className="text-3xl font-bold mt-10">Magello Feedback</h1>
      <Card className="w-[500px]">
        <CardHeader className="flex flex-col items-start">
          <CardTitle>Logga in</CardTitle>
          <CardDescription>AD-inloggning</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="w-2/3">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col items-start  space-y-1.5">
                <Label className="font-semibold" htmlFor="name">
                  Mail
                </Label>
                <Input id="name" placeholder="Skriv ditt emailadress" />
              </div>
              <div className="flex flex-col items-start space-y-1.5">
                <Label className="font-semibold" htmlFor="framework">
                  Lösenord
                </Label>
                <Input id="name" placeholder="Skriv ditt lösenord" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="w-2/3">
          <Button className="w-[100px] mx-auto">Logga in</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
