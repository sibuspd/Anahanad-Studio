import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
  onClick?: () => void;
}

const StatsCard = ({ title, value, icon: Icon, onClick, }: Props) => (
  <Card onClick={onClick} className={cn("transition-all duration-200",
    onClick && "cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-primary/40"
  )}>
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className="mt-2 text-3xl font-bold">{value}</h2>
      </div>

      <Icon className="h-8 w-8 opacity-70 transition-transform duration-200 group-hover:scale-110" />
    </CardContent>
  </Card>
);

export default StatsCard;