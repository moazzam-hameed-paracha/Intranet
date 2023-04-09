import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";

import {
  useTheme,
  Appbar,
  Button,
  Snackbar,
  Portal,
  Modal,
  Menu,
  ActivityIndicator,
} from "react-native-paper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";
import * as Contacts from "expo-contacts";
import SubmitButton from "../../components/SubmitButton";

function ContactList(props) {

  const [showInviteSnackBar, setShowSnackbar1] = React.useState(true);

  const goToGroupSettings = () => {
    props.navigation.navigate("GroupSettings", { showInviteSnackBar });
   
  };
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
  });

  const [loading, setLoading] = React.useState(false);

  const [visible2, setVisible2] = React.useState(false);

  const showModal = () => setVisible2(true);
  const hideModal = () => setVisible2(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    width: "90%",
    marginLeft: "5%",
  };

  // showin and hiding menu values in modal. using states only to display front end values and changing them onclick.
  const [
    isLeaderDesignationSelectMenuVisible,
    setLeaderDesignationSelectMenuVisible,
  ] = React.useState(false);

  const openLeaderDesignationSelectMenu = () =>
    setLeaderDesignationSelectMenuVisible(true);
  const closeLeaderDesignationSelectMenu = () =>
    setLeaderDesignationSelectMenuVisible(false);

  const [leaderDesignation, setLeaderDesignation] = useState(
    "Please Select Designation",
  );

  const managerial = () => {
    setLeaderDesignation("Manager");
  };
  const assistant = () => {
    setLeaderDesignation("Assistant manager");
  };

  const reset = () => {
    setLeaderDesignation("Please Select Designation");
    setLeaderDesignation2("Please Select Designation");
  };

  // showin and hiding menu values in modal. using states only to display front end values and changing them onclick.
  const [
    isLeaderDesignationSelectMenuVisible2,
    setLeaderDesignationSelectMenuVisible2,
  ] = React.useState(false);

  const openLeaderDesignationSelectMenu2 = () =>
    setLeaderDesignationSelectMenuVisible2(true);
  const closeLeaderDesignationSelectMenu2 = () =>
    setLeaderDesignationSelectMenuVisible2(false);

  const [leaderDesignation2, setLeaderDesignation2] = useState(
    "Please Select Designation",
  );

  const managerial2 = () => {
    setLeaderDesignation2("Manager");
  };
  const assistant2 = () => {
    setLeaderDesignation2("Assistant manager");
  };

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const [contacts, setContacts] = useState([]);
  useLayoutEffect(() => {
    (async () => {
      setLoading(true);
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.PHONE_NUMBERS],
        });
        if (data.length > 0) {
          setContacts(data);
          setLoading(false);
          console.log(data[0]);
        }
      }
    })();
  }, []);
  const keyExtractor = (item, idx) => {
    return item?.id?.toString() || idx.toString();
  };
  const renderItem = ({ item, index }) => {
    return <Contact contact={item} />;
  };
  // FlatList listitem component

  const Contact = ({ contact }) => (
    <>
      <View
        style={{
          width: getScreenPercentageSize(100).width,
          paddingTop: 20,
          paddingBottom: 5,
          paddingHorizontal: 10,
        }}
      >
        <View style={[styles.row, { paddingHorizontal: 25, flex: 1 }]}>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              color: "#606060",
              flex: 1,
            }}
          >
            {contact?.name}
          </Text>
          <BouncyCheckbox
            size={25}
            fillColor="#4582C3"
            onPress={(isChecked: boolean) => {}}
            disableText={true}
          />
        </View>
      </View>
    </>
  );

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
          title="Add Participants"
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
        <Appbar.Content
          title="Invite"
          titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 12 }}
          color={"#4582C3"}
          onPress={showModal}
          style={{
            marginTop: 4,
            marginRight: 15,
            flexDirection: "row",
            justifyContent: "flex-end",
            flex: 0,
          }}
        />
      </Appbar.Header>
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{
          alignItems: "flex-start",
        }}
      >
        {loading ? (
          <View
            style={[
              styles.row,
              {
                height: getScreenPercentageSize(80).height,
                width: getScreenPercentageSize(100).width,
                alignSelf: "center",
              },
            ]}
          >
            <ActivityIndicator animating={true} color="#4582C3" size={50} />
          </View>
        ) : (
          <>
            <View
              style={{
                width: getScreenPercentageSize(100).width,
                paddingTop: 20,
                paddingBottom: 5,
                paddingHorizontal: 10,
              }}
            >
              <View style={[styles.row, { paddingHorizontal: 25, flex: 1 }]}>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    color: "#606060",
                    flex: 1,
                  }}
                >
                  Aashar
                </Text>
                <BouncyCheckbox
                  size={25}
                  fillColor="#4582C3"
                  onPress={(isChecked: boolean) => {}}
                  disableText={true}
                />
              </View>
            </View>
            <View
              style={{
                width: getScreenPercentageSize(100).width,
                paddingTop: 20,
                paddingBottom: 5,
                paddingHorizontal: 10,
              }}
            >
              <View style={[styles.row, { paddingHorizontal: 25, flex: 1 }]}>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    color: "#606060",
                    flex: 1,
                  }}
                >
                  Absar
                </Text>
                <BouncyCheckbox
                  size={25}
                  fillColor="#4582C3"
                  onPress={(isChecked: boolean) => {}}
                  disableText={true}
                />
              </View>
            </View>
            <FlatList
              data={contacts}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
          </>
        )}
        <Portal>
          <Modal
            visible={visible2}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: 15,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  color: "#707070",
                  alignSelf: "flex-start",
                }}
              >
                Aashar
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                paddingHorizontal: 15,
              }}
            >
              <View>
                <Menu
                  visible={isLeaderDesignationSelectMenuVisible}
                  onDismiss={closeLeaderDesignationSelectMenu}
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
                        // elevation: 4,
                        borderWidth: 1,
                        borderColor: colors.palette.lightGray,
                        justifyContent: "center",
                        alignSelf: "center",
                      }}
                      uppercase={false}
                      onPress={openLeaderDesignationSelectMenu}
                    >
                      {leaderDesignation}
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
                      managerial();
                      closeLeaderDesignationSelectMenu();
                    }}
                    title="Manager"
                  />
                  <Menu.Item
                    style={{
                      maxWidth: "100%",
                    }}
                    onPress={() => {
                      assistant();
                      closeLeaderDesignationSelectMenu();
                    }}
                    title="Assistant Manager"
                  />
                </Menu>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: 15,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  color: "#707070",
                  alignSelf: "flex-start",
                }}
              >
                Absar
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                paddingHorizontal: 15,
              }}
            >
              <View>
                <Menu
                  visible={isLeaderDesignationSelectMenuVisible2}
                  onDismiss={closeLeaderDesignationSelectMenu2}
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
                        // elevation: 4,
                        borderWidth: 1,
                        borderColor: colors.palette.lightGray,
                        justifyContent: "center",
                        alignSelf: "center",
                      }}
                      uppercase={false}
                      onPress={openLeaderDesignationSelectMenu2}
                    >
                      {leaderDesignation2}
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
                      managerial2();
                      closeLeaderDesignationSelectMenu2();
                    }}
                    title="Manager"
                  />
                  <Menu.Item
                    style={{
                      maxWidth: "100%",
                    }}
                    onPress={() => {
                      assistant2();
                      closeLeaderDesignationSelectMenu2();
                    }}
                    title="Assistant Manager"
                  />
                </Menu>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                paddingHorizontal: 15,
              }}
            >
              <SubmitButton
                onPress={() => {
                  reset();
                  hideModal();
                  goToGroupSettings();
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
            </View>
          </Modal>
        </Portal>
      </ScrollView>
    </View>
  );
}
export default ContactList;
