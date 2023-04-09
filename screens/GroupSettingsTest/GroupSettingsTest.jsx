/* eslint-disable @typescript-eslint/indent */
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { db, firebase } from "../../firebase";

import {
  useTheme,
  Appbar,
  IconButton,
  Button,
  Avatar,
  Provider,
  Portal,
  Modal,
  Snackbar,
  Dialog,
} from "react-native-paper";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";


function GroupSettingsTest(props) {
  const goToCommunicationLogs = () => {
    props.navigation.navigate("CommunicationLogs");
  };

  const goToNotifications = () => {
    props.navigation.navigate("NotificationsPage");
    
  };

  const [showSnackBar1, setShowSnackbar1] = React.useState(true);

  const goToHome = () => {
    props.navigation.navigate("Home", { showSnackBar1 });
   
  };

  

  // Initializing theme context as colors object - used to get theme to work here and to use theme colors
  const { colors } = useTheme();

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

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    width: "90%",
    marginLeft: "5%",
  };

  const [visible2, setVisible2] = React.useState(false);

  const onToggleSnackBar = () => setVisible2(!visible2);

  const onDismissSnackBar = () => setVisible2(false);

  const [visible3, setVisible3] = React.useState(false);

  const showDialog = () => setVisible3(true);

  const hideDialog = () => setVisible3(false);

  // Popup

  let popupRef = React.createRef();

  const onShowPopup = () => {
    popupRef.show();
  };
  const onClosePopup = () => {
    popupRef.close();
  };

  // Navigation with props opening snackbars

  const [inviteSnackBar, setInviteSnackBar] = React.useState(false);

  const onToggleInviteSnackBar = () => setInviteSnackBar(!visible2);

  const onDismissInviteSnackBar = () => setInviteSnackBar(false);

  const routes = props.route.params;
  console.log(routes);

  React.useEffect( () => {
       
      if (routes?.showInviteSnackBar === true ) {
        onToggleInviteSnackBar();  
        props.navigation.setParams({
          showInviteSnackBar: false,
        });    
    }
  }, [routes?.showInviteSnackBar]);
  console.log(routes?.showInviteSnackBar);

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
          title="Group Settings"
          titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}
          color={colors.palette.darkGray}
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
              width: "100%",
              backgroundColor: colors.palette.lightestGray,
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 25,
                paddingBottom: 25,
                width: "90%",
                justifyContent: "flex-start",
              },
            ]}
          >
            <Avatar.Image
              size={75}
              source={require("../../assets/no-profile-picture-placeholder.png")}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 15,
                    color: colors.text,
                  }}
                >
                  Test
                </Text>
                <IconButton
                  icon="pencil"
                  color={colors.gray}
                  size={20}
                  onPress={() => console.log("Pressed")}
                  style={{
                    backgroundColor: "transparent",
                    position: "absolute",
                    top: -10,
                    right: 0,
                  }}
                />
              </View>

              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: colors.text,
                }}
              >
                Faiq Javed &#8226;{" "}
                <Text style={{ fontFamily: "Poppins_500Medium" }}>
                  Group Lead
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => goToCommunicationLogs()}
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 25,
                marginBottom: 10,
                padding: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.almostWhite,
              },
            ]}
          >
            <IconButton
              icon="file-document"
              color="#E70000"
              size={20}
              style={{
                backgroundColor: "#FFE1E1",
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
                Media, Docs, Links
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              color="#C8C8C8"
              size={25}
              style={{
                marginLeft: "auto",
                margin: 0,
                marginRight: -10,
                padding: 0,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => goToNotifications()}
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 0,
                marginBottom: 0,
                padding: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.almostWhite,
              },
            ]}
          >
            <IconButton
              icon="bell"
              color="#4582C3"
              size={20}
              onPress={() => console.log("Pressed")}
              style={{
                backgroundColor: "#E4F1FF",
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
                Notifications
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              color="#C8C8C8"
              size={25}
              onPress={() => console.log("Pressed")}
              style={{
                marginLeft: "auto",
                margin: 0,
                marginRight: -10,
                padding: 0,
              }}
            />
          </View>
        </TouchableOpacity>
        <View
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 0,
                marginBottom: 0,
                padding: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.almostWhite,
              },
            ]}
          >
            <IconButton
              icon="star"
              color="#FFD15B"
              size={20}
              onPress={() => console.log("Pressed")}
              style={{
                backgroundColor: "#FFF4D6",
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
                Starred Messages
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              color="#C8C8C8"
              size={25}
              onPress={() => console.log("Pressed")}
              style={{
                marginLeft: "auto",
                margin: 0,
                marginRight: -10,
                padding: 0,
              }}
            />
          </View>
        </View>
        <View
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity onPress={onShowPopup}>
            <View
              style={[
                styles.row,
                {
                  marginTop: 0,
                  marginBottom: 0,
                  padding: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 5,
                  width: "90%",
                  justifyContent: "flex-start",
                  backgroundColor: colors.palette.almostWhite,
                },
              ]}
            >
              <IconButton
                icon="plus"
                color="#777CE4"
                size={20}
                style={{
                  backgroundColor: "#E1E2FF",
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
                  Add Participant
                </Text>
              </View>
              <IconButton
                icon="chevron-right"
                color="#C8C8C8"
                size={25}
                style={{
                  marginLeft: "auto",
                  margin: 0,
                  marginRight: -10,
                  padding: 0,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.row,
            {
              marginTop: 20,
              marginBottom: 10,
              width: "90%",
              justifyContent: "flex-start",
            },
          ]}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 16,
              color: colors.palette.gray,
            }}
          >
            Group Members
          </Text>
        </View>
        <View
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 5,
                marginBottom: 5,
                padding: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.almostWhite,
              },
            ]}
          >
            <Avatar.Image
              size={50}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/users%2F%2B923215318238%2Fprofile.jpeg?alt=media&token=0a4a76c1-2ffb-40ff-ac3c-9512f6a29b30"
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
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                }}
              >
                You &#8226;{" "}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: colors.primary,
                }}
              >
                Owner
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 13,
                  color: colors.text,
                }}
              >
                Team Lead
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          
          onPressOut={() => {
            firebase.firestore().collection("groups").doc("6r8dlMpqEbkOKpzi2lx2").delete();
            goToHome();
          }}
          style={[
            styles.row,
            {
              marginTop: 10,
              marginBottom: 30,
              width: "90%",
              justifyContent: "flex-start",
            },
          ]}
        >
          <IconButton
            icon="close"
            color="#E70000"
            size={20}
            style={{
              backgroundColor: "#FFE1E1",
              margin: 0,
              marginRight: 10,
            }}
          />
          <Button
            mode="text"
            uppercase={false}
            compact={true}
            style={{ marginLeft: -5 }}
            color="#E70000"
            labelStyle={{
              fontFamily: "Poppins_500Medium",
              fontSize: 16,
              color: "#E70000",

              letterSpacing: 0.1,
            }}
          >
            Disband Group
          </Button>
        </TouchableOpacity>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
          >
            <View
              style={[
                styles.row,
                {
                  width: "100%",
                },
              ]}
            >
              <Button
                mode="text"
                uppercase={false}
                style={{
                  marginLeft: -5,
                  width: "100%",
                }}
                color={colors.text}
                labelStyle={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  color: colors.text,
                  letterSpacing: 0.1,
                }}
                contentStyle={{
                  justifyContent: "flex-start",
                }}
                onPress={() => console.log("Pressed")}
              >
                Message Moazzam Hameed
              </Button>
            </View>
            <View
              style={[
                styles.row,
                {
                  width: "100%",
                },
              ]}
            >
              <Button
                mode="text"
                uppercase={false}
                style={{ marginLeft: -5, width: "100%" }}
                color={colors.text}
                labelStyle={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  color: colors.text,
                  letterSpacing: 0.1,
                }}
                contentStyle={{
                  justifyContent: "flex-start",
                }}
                onPress={() => console.log("Pressed")}
              >
                View Moazzam Hameed
              </Button>
            </View>
            <View
              style={[
                styles.row,
                {
                  width: "100%",
                },
              ]}
            >
              <Button
                mode="text"
                uppercase={false}
                style={{ marginLeft: -5, width: "100%" }}
                color={colors.text}
                labelStyle={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  color: colors.text,
                  letterSpacing: 0.1,
                }}
                contentStyle={{
                  justifyContent: "flex-start",
                }}
                onPress={() => {
                  showDialog();
                  hideModal();
                }}
              >
                Make Group Lead
              </Button>
            </View>
            <View
              style={[
                styles.row,
                {
                  width: "100%",
                },
              ]}
            >
              <Button
                mode="text"
                uppercase={false}
                style={{ marginLeft: -5, width: "100%" }}
                color={colors.text}
                labelStyle={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  color: colors.text,
                  letterSpacing: 0.1,
                }}
                contentStyle={{
                  justifyContent: "flex-start",
                }}
                onPress={() => {
                  onToggleSnackBar();
                }}
              >
                Make Co-Lead
              </Button>
            </View>
          </Modal>
        </Portal>

        <View>
          <Portal>
            <Dialog visible={visible3} onDismiss={hideDialog}>
              <Dialog.Title
                style={{
                  fontFamily: "Poppins_500Medium",
                  color: colors.palette.darkGray,
                }}
              >
                Warning
              </Dialog.Title>
              <Dialog.Content>
                <Text
                  style={{
                    lineHeight: 20,
                    fontFamily: "Poppins_400Regular",
                    color: colors.text,
                  }}
                >
                  This user is the Co-Lead of this group. Performing this
                  action will remove them as the Group Lead. Continue?
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={hideDialog}
                  uppercase={false}
                  color={colors.primary}
                  labelStyle={{
                    fontFamily: "Poppins_400Regular",
                    color: colors.primary,
                    fontSize: 16,
                    letterSpacing: 0.1,
                  }}
                >
                  Yes
                </Button>
                <Button
                  onPress={hideDialog}
                  uppercase={false}
                  color={colors.primary}
                  labelStyle={{
                    fontFamily: "Poppins_400Regular",
                    color: colors.primary,
                    fontSize: 16,
                    letterSpacing: 0.1,
                  }}
                >
                  No
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>

        
      </ScrollView>
      <Snackbar
        visible={visible2}
        onDismiss={onDismissSnackBar}
        duration={4000}
        style={{
          backgroundColor: colors.palette.darkGray,
        }}
        action={{
          label: "OK",
          color: colors.palette.white,
          onPress: () => {
            // Do something
          },
        }}
      >
        This user is already the Co-Lead.
      </Snackbar>
      <Snackbar
        visible={inviteSnackBar}
        onDismiss={onDismissInviteSnackBar}
        duration={3000}
        style={{
          backgroundColor: colors.palette.darkGray,
          
        }}
        action={{
          label: "OK",
          color: colors.palette.white,
          onPress: () => {
            // Do something
          },
        }}
      >
        Invites Sent!
      </Snackbar>
      
    </View>
  );
}
export default GroupSettingsTest;
