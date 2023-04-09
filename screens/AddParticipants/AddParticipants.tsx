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
  IconButton,
  Button,
  Snackbar,
  Portal,
  Modal,
  Menu,
  ActivityIndicator,
} from "react-native-paper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { db, firebase } from "../../firebase";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";
import { useUserState } from "../../slices/userSlice";
import { FieldValue } from "firebase/firestore";

function AddParticipants(props) {
  // Initializing theme context as colors object - used to get theme to work here and to use theme colors
  const { colors } = useTheme();

  const userState = useUserState();

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

  const [userData, setUserData] = useState([]);

  //fetching Data from Database
  const fetchUserdata = async () => {
    let usersData = [];
    setLoading(true);
    let snapshot = await firebase
      .firestore()
      .collection("users")
      .where("phoneNumber", "!=", userState.phoneNumber)
      .get();
    snapshot.forEach((doc) => {
      const userDoc = doc.data();
      usersData.push(userDoc);
    });
    setUserData(usersData);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUserdata();

    console.log(userData);
  }, []);

  let test = [];

  const allowedUsers = (props) => {
    try {
      db.collection("users")
        .doc(userState.phoneNumber)
        .collection("settings")
        .doc("chat-settings")
        .update({
          allowedUsers: props,
        });
    } catch (err) {
      console.log(err);
    }
  };

  // FlatList listitem component

  const ListItem = ({ item }) => (
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
            {item.displayName}
          </Text>
          <BouncyCheckbox
            size={25}
            fillColor="#4582C3"
            onPress={(isChecked) => {
              if (isChecked === true) {
                test.push({
                  userName: item.displayName,
                  phoneNumber: item.phoneNumber,
                  photoURL: item.photoURL,
                  designation: item.designation,
                });
              } else {
                test.pop();
              }
              console.log(test);
            }}
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
          title="Add"
          titleStyle={{ fontFamily: "Poppins_500Medium", fontSize: 14 }}
          color={"#4582C3"}
          onPress={() => {
            allowedUsers(test);
            props.navigation.navigate("PrivacySettings");
          }}
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
            <FlatList
              data={userData}
              renderItem={({ item }) => <ListItem item={item} />}
              keyExtractor={(item) => item.displayName}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}
export default AddParticipants;
