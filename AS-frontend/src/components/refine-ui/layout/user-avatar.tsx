import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetIdentity } from "@refinedev/core";

type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  // avatar?: string;
  // lastName: string;
  // fullName: string;
};

export function UserAvatar() {
  const { data: user, isLoading: userIsLoading } = useGetIdentity<User>();

  if (userIsLoading || !user) {
    return <Skeleton className={cn("h-10", "w-10", "rounded-full")} />;
  }

  const { name, image } = user;
  // const { fullName, avatar } = user;

  return (
    <Avatar className={cn("h-10", "w-10")}>
      {image && <AvatarImage src={image} alt={name}/>}
      {/* {avatar && <AvatarImage src={avatar} alt={fullName} />}
      <AvatarFallback>{getInitials(fullName)}</AvatarFallback> */}
    </Avatar>
  );
}

const getInitials = (name = "") => {
  return name
  .split(" ")
  .map( (word)=> word[0]?.toUpperCase())
  .slice(0, 2)
  .join("");
};

// const getInitials = (name = "") => {
//   const names = name.split(" ");
//   let initials = names[0].substring(0, 1).toUpperCase();

//   if (names.length > 1) {
//     initials += names[names.length - 1].substring(0, 1).toUpperCase();
//   }
//   return initials;
// };

UserAvatar.displayName = "UserAvatar";
