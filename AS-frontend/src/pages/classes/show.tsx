import { useShow } from "@refinedev/core";
import { ClassDetails } from "@/types";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AdvancedImage } from "@cloudinary/react";
import { bannerPhoto } from "@/lib/cloudinary";

const Show = () => {
  const { query } = useShow<ClassDetails>({ resource: "classes" });

  const classDetails = query.data?.data;

  console.log(classDetails);

  const { isLoading, isError } = query;

  if (isLoading || isError || !classDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Session Details" />
        <p className="state-message">
          {isLoading
            ? "Loading session details..."
            : isError
            ? "Failed to load session Details..."
            : "Session details  not found"}
        </p>
      </ShowView>
    );
  }

  const teacherName = classDetails.teacher?.name ?? "Unknown";
  const teachersInitials = teacherName
    .split(" ")
    .filter(Boolean) // Boolean removes empty spaces
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join(""); // Capitalize the first letter of each word

  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    teachersInitials || "NA",
  )}`;

  const {
    name,
    description,
    bannerCldPubId,
    teacher,
    course,
    batch,
    startTime,
    endTime,
    inviteCode,
    sessionDate,
    status,
  } = classDetails;

  const subject = course.subject;
  const department = course.subject.department;

  return (
    <ShowView className="class-view class-show">
      <ShowViewHeader resource="classes" title="Class Details" />

      <div className="banner">
        {classDetails.bannerCldPubId ? (
          <AdvancedImage
            alt="Session Banner"
            cldImg={bannerPhoto(bannerCldPubId ?? "", name)}
          />
        ) : (
          <div className="placeholder" />
        )}
      </div>

      <Card className="details-card">
        <div className="details-header">
          <div>
            <h1>{name}</h1>
            <p>{description}</p>
          </div>

          <div>
            <Badge variant="outline">{department?.code}</Badge>
            <Badge
              variant={status === "scheduled" ? "default" : "secondary"}
              data-status={status}
            >
              {status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="details-grid">
          <div className="instructor">
            <p>Instructor</p>
            <div>
              <img src={teacher?.image ?? placeholderUrl} alt={teacher?.name} />
              <div>
                <p>{teacher?.name}</p>
                <p>{teacher?.email}</p>
              </div>
            </div>
          </div>

          <div className="department">
            <p>Department</p>
            <div>
              <p>{department?.name}</p>
              <p>{department?.description}</p>
            </div>
          </div>
        </div>
        <Separator />

        <div className="subject">
          <p>Subject</p>
          <div>
            <Badge variant="outline">{subject?.name}</Badge>
            <p>{subject?.description}</p>
          </div>
        </div>
        <Separator />

        <div className="join">
          <h2>Join Class</h2>
          <ol>
            <li>Ask your teacher for the invite code</li>
            <li>Click on the "Join Session" Button </li>
            <li>Paste the code and click "join"</li>
          </ol>
        </div>

        <Button size="lg" className="w-full">
          Join Class
        </Button>
      </Card>
    </ShowView>
  );
};

export default Show;
