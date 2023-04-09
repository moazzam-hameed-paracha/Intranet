import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export const useStyles = () => {
  return StyleSheet.create({
    default: {
      borderRadius: 8,
      shadowColor: theme.colors.palette.black,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 0,
      maxWidth: "100%",
    },
    defaultLabelStyle: {
      fontSize: 18,
      fontFamily: "Poppins_700Bold",
      fontWeight: "bold",
      color: theme.colors.palette.white,
    },
  });
};
