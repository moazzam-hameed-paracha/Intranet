/* eslint-disable no-unused-vars */
import { firebase } from "../firebase";

export enum DefaultImages {
  PROFILE_IMAGE = "profile.png",
  GROUP_IMAGE = "group.png",
  LOGO_SMALL = "logo-small.png",
  LOGO = "logo.png",
  TEXT_LOGO = "logo-text.png",
}

export const getDefaultImages = (
  imageName: DefaultImages | DefaultImages[],
): Promise<string[]> => {
  const images = Array.isArray(imageName) ? imageName : [imageName];
  return Promise.all(
    images.map(async (image) => {
      const imageRef = firebase.storage().ref().child(`default/${image}`);
      const url = await imageRef.getDownloadURL();
      return url;
    }),
  ).then((urls) => {
    return urls;
  });
};
