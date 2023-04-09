import { View, Text, ScrollView, StyleSheet, Platform, FlatList, Linking } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { useTheme, Appbar, IconButton, ActivityIndicator } from "react-native-paper";
import { db, firebase } from "../../firebase";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";


function SelectUser(props) {
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
    listItem: {
      marginBottom: 7,
      borderRadius: 5,
      overflow: 'hidden',
    },
  });

  // fetching userdata from firebase

  const [loading, setLoading] = React.useState(false);

  const [userData, setUserData] = useState([]);

  const fetchUserdata = async () => {
    let usersData = []
    setLoading(true)
    let snapshot = await firebase.firestore()
                        .collection('users')
                        .get()
    snapshot.forEach((doc) => {
      const userDoc = doc.data()
      usersData.push(userDoc)
    })
    setUserData(usersData)
    setLoading(false)
  }  

  useLayoutEffect(() => {
    fetchUserdata();
    console.log(userData)
  },[]) 


    // FlatList listitem component
    
    const ListItem = ({item}) => (
      <>
        <View style={[styles.row, { paddingHorizontal: 10,backgroundColor: colors.palette.almostWhite,        width:'93%',alignSelf:'center',borderRadius:7,marginBottom:7 }]}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontFamily: "Poppins_500Medium",
                color: "#606060",
                flex: 1,
              }}
            >
              {item.phoneNumber}
              <Text 
                style={{ color: "#909090", fontSize: 12,}}>
                {"  "} - {""} {item.displayName}
              </Text>
            </Text>
            <IconButton
              icon="chat"
              size={25}
              color={"#999999"}
              onPress={() => console.log("Pressed")}
            />
            <IconButton
              icon="phone"
              size={25}
              color={"#999999"}
              onPress={()=>{Linking.openURL(`tel:${item.phoneNumber}`);}}
            />
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
          title="Select User"
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
        <View style={{ width: "100%", paddingTop: 20, paddingBottom: 5 }}>
          <FlatList
            data={userData}
            renderItem={({item}) => (
              <ListItem        
                item={item}
              />
            )}
            keyExtractor={item => item.phoneNumber}
          />
        </View>
        )}
      </ScrollView>
    </View>
  );
}
export default SelectUser;
