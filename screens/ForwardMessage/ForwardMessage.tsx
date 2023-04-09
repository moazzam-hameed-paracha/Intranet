/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/indent */
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Pressable,
  FlatList,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { db, firebase } from "../../firebase";
import {
  useTheme,
  Appbar,
  IconButton,
  Button,
  Avatar,
  Searchbar,
  FAB,
  Snackbar,
  ActivityIndicator,
} from "react-native-paper";
import MessageHeader from "./MessageHeader";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";

function ForwardMessage(props) {
  const [searchBarVisible, setSearchBarVisible] = React.useState(false);

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

    listItem: {
      marginBottom: 7,
      borderRadius: 5,
      overflow: "hidden",
      backgroundColor: "#fff",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "#C0C0C0",
      opacity: 0.3,
    },
  });

  //fetching Data from Database

  const [userData, setUserData] = useState([]);

  const fetchUserdata = async () => {
    let usersData = [];
    setLoading(true);
    let snapshot = await firebase.firestore().collection("users").get();
    snapshot.forEach((doc) => {
      const userDoc = doc.data();
      usersData.push(userDoc);
    });
    setUserData(usersData);
    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchUserdata();
  }, []);

  const [loading, setLoading] = React.useState(false);

  const ListItem = ({ item, onPress, selected }) => (
    <>
      <Pressable
        onPress={onPress}
        // onLongPress={onLongPress}
        style={styles.listItem}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
            paddingVertical: 7,
          }}
        >
          <View
            style={[
              styles.row,
              {
                width: "95%",
                justifyContent: "flex-start",
              },
            ]}
          >
            <Avatar.Image
              size={65}
              source={
                item.photoURL
                  ? { uri: item.photoURL }
                  : require("../../assets/no-profile-picture-placeholder.png")
              }
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  paddingRight: 7,
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: 15,
                      color: colors.text,
                    }}
                  >
                    {item.displayName}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 11,
                      color: colors.text,
                    }}
                  >
                    9:30 am
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                    color: colors.text,
                  }}
                >
                  {item.designation}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {selected && <View style={styles.overlay} />}
      </Pressable>
    </>
  );

  const [selectedItems, setSelectedItems] = useState([]);

  const itemSelect = (item) => {
    if (selectedItems.includes(item.displayName)) {
      const newItemList = selectedItems.filter(
        (itemDISPLAYNAME) => itemDISPLAYNAME !== item.displayName,
      );
      return setSelectedItems(newItemList);
    }
    setSelectedItems([...selectedItems, item.displayName]);
  };

  const getSelected = (item) => selectedItems.includes(item.displayName);

 

  const [show, setShow] = React.useState(false);

  const showToggle = () => {
    if (selectedItems.length > 0) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  console.log(selectedItems);
  console.log(selectedItems.length);

  const combine = (item) => {
    itemSelect(item);
    showToggle();
  };

  const names = selectedItems.join(", ");

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={[styles.body]}>
      <MessageHeader
        setSearchBarVisible={setSearchBarVisible}
        searchBarVisible={searchBarVisible}
      />
      {searchBarVisible ? (
        <Searchbar
          placeholder="Search"
          clearButtonMode="while-editing"
          style={{ paddingHorizontal: 10 }}
          clearIcon={() => (
            <IconButton
              icon="close"
              onPress={() => {
                setSearchBarVisible(false);
              }}
            />
          )}
        />
      ) : null}

      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        {/* <View
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
                marginTop: 15,
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 25,
                width: "100%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.white,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 15,
                  color: "#BABABA",
                }}
              >
                Frequently Contacted
              </Text>
            </View>
          </View>
        </View> */}
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
          <Pressable
            style={{
              padding: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FlatList
              data={userData}
              renderItem={({ item }) => (
                <ListItem
                  onPress={() => combine(item)}
                  // onLongPress={() => handleLongPress(item)}
                  selected={getSelected(item)}
                  item={item}
                />
              )}
              keyExtractor={(item) => item.group}
            />
          </Pressable>
        )}

        {/* <View
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
                paddingLeft: 25,
                width: "100%",
                justifyContent: "flex-start",
                backgroundColor: colors.palette.white,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 15,
                  color: "#BABABA",
                }}
              >
                Recent Chats
              </Text>
            </View>
          </View>
        </View> */}
      </ScrollView>
      {/* Bottom popup show */}

      {show && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e0e0e0",
            paddingVertical: 7,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: colors.text,
                fontFamily: "Poppins_400Regular",
                fontSize: 12,
              }}
            >
              {names}
            </Text>
          </View>
          <FAB
            icon="send"
            color="white"
            style={{ backgroundColor: "#4582C3", marginLeft: 15 }}
            onPress={() => {
              onToggleSnackBar();
              setSelectedItems([]);
            }}
          />
        </View>
      )}

      <Snackbar
        visible={visible}
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
        Message Forwarded!
      </Snackbar>
    </View>
  );
}

export default ForwardMessage;
