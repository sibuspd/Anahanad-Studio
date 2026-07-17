import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TodaySession } from "./dashboard-types";

interface Props {
  sessions: TodaySession[];
}

const TodaysSessions = ({ sessions }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Sessions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-muted-foreground">
            No sessions scheduled today.
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between border-b pb-3 last:border-none"
            >
              <div>
                <p className="font-medium">{session.name}</p>

                <p className="text-sm text-muted-foreground">
                  {session.startTime} — {session.endTime}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysSessions;