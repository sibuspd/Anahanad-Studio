import { useShow } from "@refinedev/core";
import {ClassDetails} from "@/types"
import { ShowView } from "@/components/refine-ui/views/show-view";

const Show = () => {

    const { query } = useShow<ClassDetails>( { resource: "classes" });

    const classDetails = query.data?.data;

    console.log(classDetails);

    const { isLoading, isError } = query;

    if(isLoading || isError || !classDetails) {
        console.log("ClassDetails not fetched");
        return (
            <ShowView className="class-view class-show">
                Helloooooo Bacchon
            </ShowView>
        );
    }


  return (
    <div>show individual session details</div>
  ) 
}

export default Show