import { sortedLastIndex } from "lodash";
import { StyleSheet } from "react-native";
import { theme } from "../../theme";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";

// Stylesheet for this function/Complete Profile screen. Many other styles are inline as well.
export const useStyles = () => {
  return StyleSheet.create({
    body: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    // use this attribute with View to create a new row
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    singleInput: {
      borderRadius: 5,

      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 4,

      width: getScreenPercentageSize(78).width,
      paddingVertical: 4,
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors.palette.white,
      fontFamily: "Poppins_400Regular",
      letterSpacing: 1,
    },
    iconButton: {
      position: "absolute",
      left: "55%",
      top: "70%",
      borderWidth: 5,
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.palette.white,
    },
    avatarImage: {
      alignSelf: "center",
      width: 200,
      height: 200,
      margin: getScreenPercentageSize(10).width,
      borderRadius: 150,
    },
  });
};
