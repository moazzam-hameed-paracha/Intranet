// get with of screen for react native
import { Dimensions } from "react-native";

export const getScreenPercentageSize = (percentage: number) => {
  const { width, height } = Dimensions.get("window");
  return {
    width: width * (percentage * 0.01),
    height: height * (percentage * 0.01),
  };
};
