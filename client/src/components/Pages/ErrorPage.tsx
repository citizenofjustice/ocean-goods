import { AxiosError } from "axios";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/UI/shadcn/alert";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/components/UI/shadcn/accordion";
import { observer } from "mobx-react-lite";
import { AlertCircle } from "lucide-react";

const ErrorPage: React.FC<{
  error: Error | null;
  customMessage: string;
}> = observer(({ error, customMessage }) => {
  return (
    <Alert variant="destructive" className="m-auto max-w-2xl">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Ошибка</AlertTitle>
      <Accordion type="single" collapsible>
        <AccordionItem className="border-0" value="item-1">
          <AccordionTrigger>
            <AlertDescription>{customMessage}</AlertDescription>
          </AccordionTrigger>
          <AccordionContent className="bg-white">
            <AlertDescription>
              {error instanceof AxiosError
                ? error.response?.data.error.message
                : error?.message}
            </AlertDescription>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Alert>
  );
});

export default ErrorPage;
