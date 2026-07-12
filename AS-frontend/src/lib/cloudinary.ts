import { Cloudinary } from "@cloudinary/url-gen";
import { format, quality, dpr } from "@cloudinary/url-gen/actions/delivery";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { text } from "@cloudinary/url-gen/qualifiers/source";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import { Position } from "@cloudinary/url-gen/qualifiers/position";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { CLOUDINARY_CLOUD_NAME } from "@/constants";

const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME,
  },
}); // Creating Cloudinary instance
export const bannerPhoto = (imageCldPubId: string, name: string) => {
  return cld
    .image(imageCldPubId)
    .resize(fill())
    .delivery(format("auto"))
    .delivery(quality("auto"))
    .delivery(dpr("auto"))
    .overlay(
      source(
        text(name, new TextStyle("roboto", 42).fontWeight("bold")).textColor(
          "white",
        ),
      ) // Renders the name of the class in a specific chosen Text style
        .position(
          new Position()
            .gravity(compass("south_west"))
            .offsetY(0.2)
            .offsetX(0.02),
        ),
    );
};
