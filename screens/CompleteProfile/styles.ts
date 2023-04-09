import { StyleSheet } from "react-native";
import { theme } from "../../theme";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";

// Stylesheet for this function/Complete Profile screen. Many other styles are inline as well.
export const useStyles = () => {

  return StyleSheet.create({
    body: {
      justifyContent: "center",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    singleInput: {
      borderRadius: 5,

      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,

      width: getScreenPercentageSize(80).width,
      paddingHorizontal: 20,

      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors.palette.white,
      fontFamily: "Poppins_400Regular",
      letterSpacing: 1,
    },
    iconButton: {
      position: "absolute",
      left: "55%",
      top: "69%",
      borderWidth: 5,
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.palette.white,
    }
  });
};
