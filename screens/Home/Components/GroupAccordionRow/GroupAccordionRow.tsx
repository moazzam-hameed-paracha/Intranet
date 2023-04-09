import { View } from "react-native";
import React from "react";
import { theme } from "../../../../theme";
import { Avatar, Badge } from "react-native-paper";
import { useStyles } from "./styles";
import { GroupAccordionRowProps } from "./types";
import Text from "../../../../components/Text";
import { TouchableOpacity } from "react-native-gesture-handler";

const GroupAccordionRow = ({
  designation,
  name,
  photo,
  title,
  onPress,
}: GroupAccordionRowProps) => {
  const { colors } = theme;
  const styles = useStyles();

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.row,
          {
            marginTop: 20,
            marginLeft: "5%",
            width: "90%",
            justifyContent: "flex-start",
          },
        ]}
      >
        <Avatar.Image source={photo} />
        <View
          style={{
            marginLeft: 12,
            flexDirection: "column",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: colors.text,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              color: colors.text,
            }}
          >
            {title}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 11,
            color: colors.text,
            marginLeft: "auto",
          }}
        >
          {designation}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default GroupAccordionRow;
