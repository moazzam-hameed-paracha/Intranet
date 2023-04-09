import { Button, List } from "react-native-paper";
import React from "react";
import Text from "../../../../components/Text";
import { ButtonProps, StyleProp, TextStyle, ViewProps, ViewStyle } from "react-native";
import { GroupAccordionActionButtonProps } from "../GroupAccordionRow/types";

export type GroupAccordionProps<T> = {
  AccordionTitle: string;
  AccordionStyle?: StyleProp<ViewStyle>;
  AccordionTitleStyle?: StyleProp<TextStyle>;
  AccordionData: T[];
  // eslint-disable-next-line no-unused-vars
  AccordionContent?: (option: T) => React.ReactElement;
  ActionButton: GroupAccordionActionButtonProps;
  AccordionProps?: Omit<
  React.ComponentProps<typeof List.Accordion>,
  "title" | "styles" | "titleStyle" | "children"
  >;
}

const GroupAccordion = <T extends unknown>({
  AccordionTitle = "",
  AccordionStyle,
  AccordionTitleStyle,
  AccordionData = [],
  AccordionContent,
  AccordionProps,
  ActionButton,
}: GroupAccordionProps<T>) => {
  return (
    <List.Accordion
      title={AccordionTitle}
      style={AccordionStyle}
      titleStyle={AccordionTitleStyle}
      {...AccordionProps}
    >
      <Button  style={ActionButton.style} onPress={ActionButton.onPress}>{ActionButton.label}</Button>
      {AccordionData.map((content, index) => {
        if (AccordionContent) {
          return <AccordionContent {...content} key={index} />;
        }

        let data = "";
        for (const key in content) {
          data += `${key}: \t${content[key]}\n`;
        }

        return <Text key={index}>{data}</Text>;
      })}
    </List.Accordion>
  );
};

export default GroupAccordion;
