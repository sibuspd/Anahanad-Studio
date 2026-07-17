import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
}

const StatsCard = ({ title, value, icon: Icon }: Props) => (
  <Card>
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className="mt-2 text-3xl font-bold">{value}</h2>
      </div>

      <Icon className="h-8 w-8 opacity-70" />
    </CardContent>
  </Card>
);

export default StatsCard;