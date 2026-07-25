import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpcomingSession } from "./dashboard-types";

interface Props {
  sessions: UpcomingSession[];
}

const UpcomingSessions = ({ sessions }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-muted-foreground">
            No upcoming sessions.
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between border-b pb-3 last:border-none"
            >
              <div>
                <p className="font-medium">
                  {session.name}
                </p>

                <p className="text-sm text-muted-foreground">
                  {session.sessionDate}
                </p>
              </div>

              <p className="font-medium">
                {session.startTime}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingSessions;