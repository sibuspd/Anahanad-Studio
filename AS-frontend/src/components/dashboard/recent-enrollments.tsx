import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentEnrollment } from "./dashboard-types";

interface Props {
  enrollments: RecentEnrollment[];
}

const RecentEnrollments = ({ enrollments }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Enrollments</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {enrollments.length === 0 ? (
          <p className="text-muted-foreground">
            No enrollments yet.
          </p>
        ) : (
          enrollments.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-3 last:border-none"
            >
              <div>
                <p className="font-medium">
                  {item.student.name}
                </p>

                <p className="text-sm text-muted-foreground">
                  {new Date(item.enrolledAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentEnrollments;