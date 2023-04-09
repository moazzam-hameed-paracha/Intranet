import useUserFirebaseActions from "../../hooks/useUserFirebaseActions";
import { User } from "../../modals/fireStoreUserConverter";
import { convertedPhoneNumber } from "../../utils/convertedPhoneNumber";
import useGroupFirebaseActions from "../../hooks/useGroupFirebaseActions";
import { useGroupState } from "../../slices/groupSlice";
import { View, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import { useTheme, Appbar, Button, Menu, Title } from "react-native-paper";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";
import SubmitButton from "../../components/SubmitButton";
import Text from "./../../components/Text/Text";
export default function ModalPage(props) {
  const [checkedusersmodal, setcheckedusers] = useState([]);
  const designation = [];
  useEffect(() => {
    setMenuVisible([...props.route.params.limiter]);
    console.log("Menu Visible", menuvisible);
  }, [props.route.params]);
  const { addUser } = useUserFirebaseActions();
  const { addMemberToGroup } = useGroupFirebaseActions();
  const groupState = useGroupState();
  const { colors } = useTheme();

  //starting things for menu
  const [menuvisible, setMenuVisible] = React.useState([]);
  const [defvalue, setvalue] = useState("Select Designation");
  //ending things for menu
  const handleOnPress = async () => {
    for (let i = 0; i < props.length; i++) {
      try {
        await addUser(
          new User(
            convertedPhoneNumber(props[i].phoneNumber),
            props.name,
            null,
            designation[i], // desgination here
            false,
            "invited",
            null
          )
        );
      } catch (e) {
        console.log(e);
      }
    }

    for (let i = 0; i < props.length; i++) {
      try {
        addMemberToGroup(groupState.uid, props[i], "user");
      } catch (e) {
        console.log(e);
      }
    }
  };
  return (
    <View>
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
      </Appbar.Header>
      <ScrollView>
        {props.route.params.checkedusers.map((user, index) => {
          return (
            <View key={index}>
              <Title style={styles.Text}>{user.name}</Title>
              <Menu
                visible={menuvisible[index]}
                onDismiss={() => (menuvisible[index] = false)}
                anchor={
                  <Button
                    labelStyle={{
                      color: colors.text,
                      fontFamily: "Poppins_400Regular",
                      fontSize: 16,
                      letterSpacing: 0.7,
                    }}
                    contentStyle={{
                      justifyContent: "center",
                      paddingTop: 4,
                    }}
                    style={{
                      backgroundColor: colors.background,
                      width: getScreenPercentageSize(70).width,
                      height: 50,
                      borderWidth: 1,
                      borderColor: colors.palette.lightGray,
                      justifyContent: "center",
                      alignSelf: "center",
                    }}
                    uppercase={false}
                    onPress={() => setMenuVisible(true)}
                  >
                    {defvalue}
                  </Button>
                }
                style={{
                  width: getScreenPercentageSize(70).width,
                }}
              >
                <Menu.Item
                  style={{
                    maxWidth: "100%",
                  }}
                  onPress={() => {
                    designation.push("Manager");
                    setvalue("Manager");
                    setMenuVisible(false);
                  }}
                  title="Manager"
                />
                <Menu.Item
                  style={{
                    maxWidth: "100%",
                  }}
                  onPress={() => {
                    designation.push("Assistant Manager");
                    setvalue("Assistant Manager");
                    setMenuVisible(false);
                  }}
                  title="Assistant Manager"
                />
              </Menu>
            </View>
          );
        })}

        <SubmitButton
          onPress={() => {
            handleOnPress;
          }}
          width={getScreenPercentageSize(70).width}
          labelStyle={{ fontSize: 18, letterSpacing: 0.7 }}
          style={{
            alignSelf: "center",
            marginVertical: 15,
            elevation: 0,
            marginTop: 35,
          }}
        >
          Invite
        </SubmitButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  Text: {
    justifyContent: "center",
    alignSelf: "center",
  },
});
