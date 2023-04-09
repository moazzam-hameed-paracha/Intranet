import React from "react";
import { Button } from "react-native-paper";
import { theme } from "../../theme";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";
import { useStyles } from "./styles";

type ButtonProps = React.ComponentProps<typeof Button> & {
  width?: number;
  height?: number;
  borderRadius?: number;
  size?: "large";
  error?: boolean;
};

const SubmitButton = ({
  width = getScreenPercentageSize(45).width,
  height = 55,
  borderRadius = 5,
  size,
  style,
  labelStyle,
  uppercase = false,
  mode = "contained",
  error,
  ...otherProps
}: ButtonProps) => {
  if (size === "large") {
    width = getScreenPercentageSize(80).width;
  }

  const styles = useStyles();

  return (
    <Button
      mode={mode}
      contentStyle={{ height: height, width: width }}
      uppercase={uppercase}
      labelStyle={[
        labelStyle ? labelStyle : styles.defaultLabelStyle,
        { fontFamily: "Poppins_600SemiBold" },
      ]}
      style={[
        styles.default,
        { width: width, height: height, borderRadius: borderRadius },
        style,
      ]}
      {...otherProps}
      {...(error && { mode: "outlined", color: theme.colors.error })}
    />
  );
};

export default SubmitButton;
