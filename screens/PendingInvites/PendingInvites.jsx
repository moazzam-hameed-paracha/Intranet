/* eslint-disable @typescript-eslint/indent */
import { View, Text, ScrollView, StyleSheet, Platform } from "react-native";
import React, { useState } from "react";
import { useTheme, Appbar, Button, Modal, Portal } from "react-native-paper";
import { useGroupState } from "../../slices/groupSlice";
import Dataex from "../Chat/Components/ChatScreenHeader/DataExtractor";
import * as lodash from "lodash";
import { db } from "../../firebase";
function PendingInvites(props) {
  const theme = useTheme();
  const { colors } = useTheme();
  const groupState = useGroupState();

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
      backgroundColor: theme.colors.primary,
    },
    btnPress: {
      backgroundColor: theme.colors.background,
    },
  });

  const [members, setmembers] = useState([]);
  const DataGetter = (props) => {
    setmembers([...props]);
  };

  const pendingMembers = lodash.filter(members, { status: "active" });

  const handlecancel = async (props) => {
    setmembers([
      members.filter((member) => {
        return member.phoneNumber !== props;
      }),
    ]);
    console.log("These are props", props);
    try {
      await db
        .collection("groups")
        .doc(groupState.uid)
        .update({
          members: [
            ...groupState.members.filter((member) => {
              return member.uid !== props;
            }),
          ],
        });
    } catch (e) {
      console.log(e);
    }
    alert("members have been removed");
  };
  return (
    <View style={[styles.body]}>
      <Dataex members={groupState.members} Data={DataGetter} />
      <Appbar.Header
        style={{
          width: "100%",
          height: 70,
          backgroundColor: theme.colors.background,
          zIndex: 2,
        }}
      >
        <Appbar.BackAction
          color={theme.colors.text}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
        <Appbar.Content
          title={"Pending Invitations"}
          titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}
          color={theme.colors.text}
          style={{
            ...Platform.select({
              ios: {
                marginTop: 0,
              },
              android: {
                marginTop: 4,
              },
            }),
          }}
        />
      </Appbar.Header>
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        <View
          style={[
            {
              marginTop: 20,
              marginBottom: 20,
            },
          ]}
        >
          {pendingMembers.map((member, index) => {
            return (
              <View
                key={(member, index)}
                style={[
                  styles.row,
                  {
                    paddingHorizontal: 10,
                    backgroundColor: colors.palette.almostWhite,
                    width: "93%",
                    alignSelf: "center",
                    borderRadius: 7,
                    paddingVertical: 6,
                    marginVertical: 7,
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontFamily: "Poppins_500Medium",
                    color: "#606060",
                    flex: 1,
                  }}
                >
                  {member.phoneNumber}
                  <Text
                    style={{
                      color: "#909090",
                      fontSize: 12,
                    }}
                  >
                    {"   ~ "}
                    {member.displayName}
                  </Text>
                </Text>
                <Button
                  // onPressIn={() => removeItem(index)}
                  onPress={() => {
                    //onToggleDisband();
                    handlecancel(member.phoneNumber, index);
                    //  removeItem(index);
                    // handleOnCheck(member);
                  }}
                  uppercase={false}
                  mode="contained"
                  style={{
                    marginLeft: "auto",
                    borderRadius: 25,
                    backgroundColor: "#E4F1FF",
                    elevation: 0,
                  }}
                  contentStyle={{ paddingHorizontal: 3, height: 35 }}
                  labelStyle={{
                    color: "#4582C3",
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 12,
                  }}
                >
                  {" "}
                  Cancel
                </Button>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
export default PendingInvites;
