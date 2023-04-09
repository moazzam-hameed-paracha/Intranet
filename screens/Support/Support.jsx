/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/indent */
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useState } from "react";

import { useTheme, Appbar, IconButton, Button, List } from "react-native-paper";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";
import SubmitButton from "../../components/SubmitButton";

function Support(props) {
  // Initializing theme context as colors object - used to get theme to work here and to use theme colors
  const { colors } = useTheme();

  // Stylesheet for this function/Complete Profile screen. Many other styles are inline as well.
  const styles = StyleSheet.create({
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
    btnNormal: {
      backgroundColor: colors.lighterBlue,
    },
    btnPress: {
      backgroundColor: colors.gray,
    },
    listTab: {
      padding: 15,
      flexDirection: "row",
      alignSelf: "center",
    },
    btnTab: {
      width: getScreenPercentageSize(50).width,
      flexDirection: "row",
      paddingHorizontal: 15,
      paddingVertical: 10,
      justifyContent: "center",
      backgroundColor: "#F8F8F8",
    },
  });

  const [page, setPage] = useState("ContactUs");

  const ContactUs = () => {
    setPage("ContactUs");
  };

  const FAQs = () => {
    setPage("FAQs");
  };

  // Function rendering the JSX for this screen.
  return (
    // Using ScrollView to dismiss keyboard when user clicks anywhere on the screen.
    <View style={[styles.body]}>
      <Appbar.Header
        style={{
          width: "100%",
          height: 70,
          backgroundColor: colors.palette.white,
          zIndex: 2,
        }}
      >
        <Appbar.BackAction
          color={colors.palette.darkGray}
          onPress={() => props.navigation.goBack()}
        />
        <Appbar.Content
          title="Support"
          titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}
          color={colors.palette.darkGray}
          style={{
            ...Platform.select({
              ios: {
                marginTop: 0,
                marginLeft: -4,
              },
              android: {
                marginTop: 4,
                marginLeft: -4,
              },
            }),
          }}
        />
      </Appbar.Header>

      <View style={[styles.row, { elevation: 2 }]}>
        <TouchableOpacity
          onPress={ContactUs}
          style={[
            styles.btnTab,
            { borderRightWidth: 1, borderRightColor: "#D3D3D3" },
          ]}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: "#707070",
            }}
          >
            Contact Us
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={FAQs}
          style={[
            styles.btnTab,
            { borderRightWidth: 1, borderRightColor: "#D3D3D3" },
          ]}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: "#707070",
            }}
          >
            FAQs
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        {page === "ContactUs" && (
          <>
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
                padding: 20,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  color: "#999999",
                }}
              >
                EMAIL US
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL("mailto:contact@intranet.com")}
                style={[
                  {
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <View
                  style={[
                    styles.row,
                    {
                      marginTop: 10,
                      marginBottom: 10,
                      paddingTop: 5,
                      paddingBottom: 5,
                      borderRadius: 5,
                      width: "100%",
                      justifyContent: "flex-start",
                      alignSelf: "center",
                    },
                  ]}
                >
                  <IconButton
                    icon="email"
                    color="#909090"
                    size={20}
                    style={{
                      backgroundColor: "#EDEDED",
                      borderWidth: 0,
                      borderColor: colors.palette.white,
                    }}
                  />
                  <View
                    style={{
                      marginLeft: 12,
                      flexDirection: "column",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        fontSize: 15,
                        color: colors.text,
                      }}
                    >
                      contact@intranet.com
                    </Text>
                  </View>
                  <IconButton
                    icon="chevron-right"
                    color="#C8C8C8"
                    size={25}
                    style={{
                      marginLeft: "auto",
                      margin: 0,
                      marginRight: 10,
                      padding: 0,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
                padding: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  color: "#999999",
                }}
              >
                Call US
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel:${"+923441234567"}`);
                }}
                style={[
                  {
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <View
                  style={[
                    styles.row,
                    {
                      marginTop: 10,
                      marginBottom: 10,
                      paddingTop: 5,
                      paddingBottom: 5,
                      borderRadius: 5,
                      width: "100%",
                      justifyContent: "flex-start",
                      alignSelf: "center",
                    },
                  ]}
                >
                  <IconButton
                    icon="phone"
                    color="#909090"
                    size={20}
                    style={{
                      backgroundColor: "#EDEDED",
                      borderWidth: 0,
                      borderColor: colors.palette.white,
                    }}
                  />
                  <View
                    style={{
                      marginLeft: 12,
                      flexDirection: "column",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        fontSize: 15,
                        color: colors.text,
                      }}
                    >
                      +92 34 1234567
                    </Text>
                  </View>
                  <IconButton
                    icon="chevron-right"
                    color="#C8C8C8"
                    size={25}
                    style={{
                      marginLeft: "auto",
                      margin: 0,
                      marginRight: 10,
                      padding: 0,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 30 }}>
              <SubmitButton
                width={getScreenPercentageSize(50).width}
                labelStyle={{ fontSize: 18, letterSpacing: 0.7 }}
                style={{
                  alignSelf: "center",
                  borderRadius: 8,
                  backgroundColor: "#4582C3",
                }}
              >
                Chat Admin
              </SubmitButton>
            </View>
            <View
              style={{
                backgroundColor: "#E4F1FF",
                marginHorizontal: 20,
                padding: 25,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                  color: "#707070",
                }}
              >
                We will respond to emails in 24 hours. It might take 1 week
                because of COVID. We are doing our best to serve you. Thank you
                for your patience.
              </Text>
            </View>
          </>
        )}

        {page === "FAQs" && (
          <View
            style={{
              flex: 1,

              flexDirection: "column",
              width: "100%",
            }}
          >
            <List.AccordionGroup>
              <List.Accordion
                title=" What do you mean by a Service Provider?"
                id="1"
                style={{
                  width: getScreenPercentageSize(90).width,
                  alignSelf: "center",
                  marginBottom: 10,
                  marginTop: 25,
                  backgroundColor: "#f8f8f8",
                  borderRadius: 10,
                }}
                titleStyle={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                  color: "#777777",
                }}
              >
                <List.Item
                  title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                  titleNumberOfLines={16}
                  titleStyle={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                  }}
                  style={{ padding: 20, paddingVertical: 0 }}
                />
              </List.Accordion>
              <List.Accordion
                title=" What do you mean by a Service Provider?"
                id="2"
                style={{
                  width: getScreenPercentageSize(90).width,
                  alignSelf: "center",
                  marginVertical: 10,
                  backgroundColor: "#f8f8f8",
                  borderRadius: 10,
                }}
                titleStyle={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                  color: "#777777",
                }}
              >
                <List.Item
                  title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                  titleNumberOfLines={16}
                  titleStyle={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                  }}
                  style={{ padding: 20, paddingVertical: 0 }}
                />
              </List.Accordion>
              <List.Accordion
                title=" What do you mean by a Service Provider?"
                id="3"
                style={{
                  width: getScreenPercentageSize(90).width,
                  alignSelf: "center",
                  marginVertical: 10,
                  backgroundColor: "#f8f8f8",
                  borderRadius: 10,
                }}
                titleStyle={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                  color: "#777777",
                }}
              >
                <List.Item
                  title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                  titleNumberOfLines={16}
                  titleStyle={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                  }}
                  style={{ padding: 20, paddingVertical: 0 }}
                />
              </List.Accordion>
              <List.Accordion
                title=" What do you mean by a Service Provider?"
                id="4"
                style={{
                  width: getScreenPercentageSize(90).width,
                  alignSelf: "center",
                  marginVertical: 10,
                  backgroundColor: "#f8f8f8",
                  borderRadius: 10,
                }}
                titleStyle={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                  color: "#777777",
                }}
              >
                <List.Item
                  title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                  titleNumberOfLines={16}
                  titleStyle={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                  }}
                  style={{ padding: 20, paddingVertical: 0 }}
                />
              </List.Accordion>
              <List.Accordion
                title=" What do you mean by a Service Provider?"
                id="5"
                style={{
                  width: getScreenPercentageSize(90).width,
                  alignSelf: "center",
                  marginVertical: 10,
                  backgroundColor: "#f8f8f8",
                  borderRadius: 10,
                }}
                titleStyle={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                  color: "#777777",
                }}
              >
                <List.Item
                  title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                  titleNumberOfLines={16}
                  titleStyle={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                  }}
                  style={{ padding: 20, paddingVertical: 0 }}
                />
              </List.Accordion>
              <List.Accordion
                title=" What do you mean by a Service Provider?"
                id="6"
                style={{
                  width: getScreenPercentageSize(90).width,
                  alignSelf: "center",
                  marginVertical: 10,
                  backgroundColor: "#f8f8f8",
                  borderRadius: 10,
                }}
                titleStyle={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                  color: "#777777",
                }}
              >
                <List.Item
                  title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                  titleNumberOfLines={16}
                  titleStyle={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                  }}
                  style={{ padding: 20, paddingVertical: 0 }}
                />
              </List.Accordion>
              <List.Accordion
                title=" What do you mean by a Service Provider?"
                id="7"
                style={{
                  width: getScreenPercentageSize(90).width,
                  alignSelf: "center",
                  marginVertical: 10,
                  backgroundColor: "#f8f8f8",
                  borderRadius: 10,
                }}
                titleStyle={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                  color: "#777777",
                }}
              >
                <List.Item
                  title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                  titleNumberOfLines={16}
                  titleStyle={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                  }}
                  style={{ padding: 20, paddingVertical: 0 }}
                />
              </List.Accordion>
            </List.AccordionGroup>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
export default Support;
