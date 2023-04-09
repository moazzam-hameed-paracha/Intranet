import { StyleSheet } from "react-native";
import { theme } from "../../theme";

// Stylesheet for this function/Complete Profile screen. Many other styles are inline as well.
export const useStyles = () => {
  const { colors } = theme;
  
  return StyleSheet.create({
    body: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    // use this attribute with View to create a new row
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
  });
};
