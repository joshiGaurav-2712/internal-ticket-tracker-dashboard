
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <h1 className="text-xl font-semibold">Troopod</h1>
      <Button className="bg-blue-500 hover:bg-blue-600">
        <Plus className="w-4 h-4 mr-2" />
        CREATE NEW TICKET
      </Button>
    </nav>
  );
};
