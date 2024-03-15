import { Loader2 } from "lucide-react";
import { Button } from "@/components/UI/shadcn/button";

export const ButtonLoading: React.FC<{
  children?: string;
}> = ({ children = "идет обработка" }) => {
  return (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {children}
    </Button>
  );
};
