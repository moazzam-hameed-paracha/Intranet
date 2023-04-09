import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

// Stylesheet for this function/Complete Profile screen. Many other styles are inline as well.
export const useStyles = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    body: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    imageView: { marginTop: "-5%", flexDirection: "row" },
    signInButtonStyle: {
      borderRadius: 5,

      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,

      width: 320,
      paddingHorizontal: 20,

      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.palette.white,
      fontFamily: "Poppins_400Regular",
      letterSpacing: 1,
    },
    otpView: {
      width: "70%",
    },
    singleInput: {
      width: 50,
      height: 50,
      borderWidth: 0,
      backgroundColor: colors.palette.white,
      color: colors.text,
      borderRadius: 5,
      fontFamily: "Poppins_700Bold",
      fontSize: 20,
      fontWeight: "bold",
      shadowColor: colors.palette.black,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
  });
};
