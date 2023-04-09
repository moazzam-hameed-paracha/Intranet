import { StyleProp, ViewStyle } from "react-native";

export type GroupAccordionRowProps = {
  photo: {
    uri: string;
    width?: number;
    height?: number;
  };
  name: string;
  designation: string;
  title: string;
  onPress: (() => void)
};

export type GroupAccordionActionButtonProps = {
  style?: StyleProp<ViewStyle>;
  label: string;
  onPress?: (() => void)
}
