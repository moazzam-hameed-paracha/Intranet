import { StyleSheet } from "react-native";
import { theme } from "../../../../theme";

// Stylesheet for this function/Complete Profile screen. Many other styles are inline as well.
export const useStyles = () => {
  const { colors } = theme;

  return StyleSheet.create({
    badgeStyle: {
      position: "absolute",
      left: 46,
      top: 42,
      backgroundColor: colors.palette.green,
    },
    // use this attribute with View to create a new row
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
  });
};
