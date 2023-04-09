import { extractFilenameFromUrl } from "./extractFilenameFromUrl";

export const extractFileTypeFromUrl = (url: string): string => {
  return extractFilenameFromUrl(url).split(".").pop();
};
