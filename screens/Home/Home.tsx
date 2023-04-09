/* eslint-disable @typescript-eslint/indent */
import { View, Text, ScrollView, Platform, Linking } from "react-native";
import React, { useState, useMemo, useLayoutEffect } from "react";
import { useStyles } from "./styles";
import {
  Appbar,
  IconButton,
  Avatar,
  List,
  Searchbar,
  ActivityIndicator,
  Snackbar,
} from "react-native-paper";
import SubmitButton from "../../components/SubmitButton";
import HomeHeader from "./Components/HomeHeader/HomeHeader";
import { theme } from "../../theme";
import AccordionList from "../../components/AccordionList/AccordionList";
import GroupAccordionRow from "./Components/GroupAccordionRow/GroupAccordionRow";
import { DefaultImages, getDefaultImages } from "../../utils/getDefaultImages";
import useUserFirebaseActions from "../../hooks/useUserFirebaseActions";
import { GroupLevel, UserStatus } from "../../modals";
import useGroupFirebaseActions from "../../hooks/useGroupFirebaseActions";
import { GroupAccordionProps } from "./Components/GroupAccordion/GroupAccordion";
import { GroupAccordionRowProps } from "./Components/GroupAccordionRow/types";
import { GroupMember } from "../../modals/fireStoreGroupMemberConverter";
import { Group } from "../../modals/fireStoreGroupConverter";
import {
  ContactInterface,
  useContactsStateActions,
} from "../../slices/contactsSlice";
import fetchContacts from "../../utils/fetchContacts";
import { useUserState } from "../../slices/userSlice";
import { DisplayType } from "../PeopleSelector/PeopleSelector";
import { useFocusEffect } from "@react-navigation/native";
import { convertedPhoneNumber } from "../../utils/convertedPhoneNumber";
import { db } from "../../firebase";
import { useGroupState } from "../../slices/groupSlice";
import { useGroupsListSliceActions } from "../../slices/groupsListSlice";
import { useGroupsListSlice } from "../../slices/groupsListSlice";
import createGroupTest from "../TestFeatures/MemberSetter";
// hook that contains notification functions
// ExpoNotifications is a library that provides a way to send notifications to the user.
// useNotifications is a hook that contains functions to register for, send and receive notifications.
import useExpoNotifications from "../../hooks/useNotifications";
import { useEffect } from "react";

export default function Home(props) {
  const [loading, setLoading] = useState(false);
  const userState = useUserState();
  const { getUser } = useUserFirebaseActions();
  const GroupListActions = useGroupsListSliceActions();
  const goToCreateGroupScreen = () => {
    props.navigation.navigate("CreateGroup");
  };
  const goToChatAdminScreen = async () => {
    //console.log("Chat admin called");
    let foundToUser = false;
    let foundCurrentUser = false;
    let groupId = null;
    groups.map((group) => {
      groups.map((group) => {
        return group.members.map((member) => {
          if (group.members.length === 2 && group.level === "Admin") {
            if (
              group.members[0].uid === adminInfo.phoneNumber &&
              group.members[1].uid === userState.phoneNumber
            ) {
              console.log("Chat exists");
              groupId = group.uid;
              console.log("This is the group ID :", groupId);
              return (foundToUser = true);
            } else if (
              group.members[1].uid === adminInfo.phoneNumber &&
              group.members[0].uid === userState.phoneNumber
            ) {
              console.log("Chat exists");
              groupId = group.uid;
              console.log("This is the group ID :", groupId);
              return (foundToUser = true);
            }
          }
        });
      });
      foundCurrentUser = group.members.some(
        (member) =>
          convertedPhoneNumber(member.processedUser.phoneNumber) ===
          convertedPhoneNumber(userState.phoneNumber)
      );
    });
    if (groupId !== null && groupId !== undefined) {
      console.log("First if");
      props.navigation.navigate("Chat", { groupId, groups });
    } else {
      console.log("First else");
      //setLoading(true);
      let members = [];
      let userstring = "users/" + userState.phoneNumber;
      let ceostring = "users/" + adminInfo.phoneNumber;
      members.push({
        color: "#fffff",
        privilege: "user",
        uid: userState.phoneNumber,
        user: userstring,
      });
      console.log(ceoInfo);
      members.push({
        color: "fffff",
        privilege: "admin",
        uid: adminInfo.phoneNumber,
        user: ceostring,
      });
      //console.log(ceoInfo);
      let group_name = userState.phoneNumber + "_" + adminInfo.phoneNumber;
      let group = {
        name: group_name,
        photo: adminInfo.photoURL,
        level: "Admin",
      };
      const newGroupData = await createGroupTest(
        members,
        group,
        "+92idontknowwhattodo"
      );
      if (newGroupData.success) {
        onToggleAdminChat();
      } else {
        props.navigation.navigate("Home");
        console.error(newGroupData.error);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("Home Screen was focused");
      fetchContacts().then((contacts): void => {
        ContactsStateActions.setContacts(contacts);
      });

      return () => {
        console.log("Home Screen was unfocused");
      };
    }, [])
  );

  const routes = props.route.params;
  // console.log(routes);

  React.useEffect(() => {
    if (routes?.showSnackBar1 === true) {
      onToggleSnackBar1();
      props.navigation.setParams({
        showSnackBar1: false,
      });
    } else if (routes?.showSnackBar === true) {
      onToggleSnackBar();
      props.navigation.setParams({
        showSnackBar: false,
      });
    }
  }, [routes?.showSnackBar1, routes?.showSnackBar]);

  const [renderRestrict, setRenderRestrict] = useState(false);

  // create group snackbar
  const [createGroupSnackBar, SetCreateGroupSnackBar] = useState(false);
  const onToggleSnackBar = () => SetCreateGroupSnackBar(true);
  const onDismissSnackBar = () => SetCreateGroupSnackBar(false);

  // disband group snackbar
  const [disbandGroupSnackBar, SetDisbandGroupSnackBar] = useState(false);
  const onToggleSnackBar1 = () => SetDisbandGroupSnackBar(true);
  const onDismissSnackBar1 = () => SetDisbandGroupSnackBar(false);

  // admin chat creation snackbar
  const [adminChat, SetAdminChat] = useState(false);
  const onToggleAdminChat = () => SetAdminChat(true);
  const onDismissAdminChat = () => SetAdminChat(false);

  const { colors } = theme;

  const styles = useStyles();

  const [avatar, setAvatar] = React.useState("");
  const [groups, setGroups] = useState([]);

  const [firstLoad, setFirstLoad] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const UserFirebaseActions = useUserFirebaseActions();
  const GroupFirebaseActions = useGroupFirebaseActions();
  const ContactsStateActions = useContactsStateActions();

  const useNotifications = useExpoNotifications();

  //function to send notifitcation to user
  const sendNotification = () => {
    useNotifications.sendPushNotification(
      userState.notificationToken,
      "Welcome!",
      "You have successfully created an account!",
      null
    );
  };

  const [ceoInfo, setCeoInfo] = useState({
    displayName: "Loading...",
    photoURL: "",
  });
  const groupState = useGroupState();

  const [adminInfo, setAdminInfo] = useState({
    displayName: "Loading...",
    photoURL: "",
    designation: "",
    phoneNumber: "",
  });

  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchBarVisible, setSearchBarVisible] = React.useState(false);

  const onChangeSearch = (query) => setSearchQuery(query);

  if (searchBarVisible == false && searchQuery.length > 0) {
    setSearchQuery("");
  }

  useMemo(() => {
    UserFirebaseActions.getCEO().then((data) => {
      setCeoInfo(data.data.users.docs[0].data());
    });
  }, []);

  useMemo(() => {
    UserFirebaseActions.getAdmins().then((data) => {
      setAdminInfo(data.data.users.docs[0].data());
    });
  }, []);

  useMemo(() => {
    fetchContacts().then((contacts): void => {
      ContactsStateActions.setContacts(contacts);
    });
  }, []);

  React.useLayoutEffect(() => {
    const fetchDefaultImages = async () => {
      const images = await getDefaultImages(DefaultImages.PROFILE_IMAGE);
      setAvatar(images[0]);
    };
    fetchDefaultImages().catch((err) => console.error(err));
  }, []);

  const [effectcontrol, seteffectcontrol] = useState(false);
  // const groupListState = useGroupsListSlice();

  useLayoutEffect(() => {
    const processGroupsData = async (groups: Group[]) => {
      let updatedGroups: Group[] = [];
      for (const group of groups) {
        const processedGroup: Group = group;
        if (!processedGroup) {
          continue;
        }
        const members = await Promise.all(
          processedGroup.members.map(async (member: GroupMember) => {
            const user = (
              await UserFirebaseActions.getUser(member.uid)
            ).data.user.data();
            member["processedUser"] = user;
            return member;
          })
        );
        processedGroup.members = members;
        if (
          processedGroup.level !== GroupLevel.INDIVIDUAL ||
          (processedGroup.level === GroupLevel.INDIVIDUAL &&
            processedGroup.members.length == 2 &&
            processedGroup.members.some(
              (member) =>
                convertedPhoneNumber(member.processedUser.phoneNumber) ==
                convertedPhoneNumber(userState.phoneNumber)
            ))
        ) {
          if (processedGroup.level === GroupLevel.INDIVIDUAL) {
            console.log(processedGroup.uid);
          }
          updatedGroups.push(processedGroup);
        }
      }
      return updatedGroups;
    };

    // setLoading(true);
    if (searchResults.length > 0 && searchQuery.length === 0) {
      setSearchResults([]);
    }
    db.collection("groups").onSnapshot(async (querySnapshot) => {
      setAutoRefresh(true);
      const updatedGroups = [];
      querySnapshot.forEach((doc) => {
        updatedGroups.push(doc.data());
      });
      setGroups(await processGroupsData(updatedGroups));
      //GroupListActions.addToGroupsList(groups);
      setAutoRefresh(false);
      setFirstLoad(false);
    });
    // GroupListActions.addToGroupsList(groups);
    // console.log("This is the groupList State", groupState);
    if (searchQuery.length > 0 && searchBarVisible) {
      setLoading(true);
      const results = groups.filter((group) => {
        return (
          (group.level !== GroupLevel.INDIVIDUAL &&
            group.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (group.level === GroupLevel.INDIVIDUAL &&
            group.members.some((member) =>
              member.processedUser.displayName
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            ) &&
            group.members.length == 2 &&
            group.members.some(
              (member) =>
                convertedPhoneNumber(member.processedUser.phoneNumber) !==
                convertedPhoneNumber(userState.phoneNumber)
            ))
        );
      });
      console.log(results.map((result) => result.name).join(", "));
      setSearchResults(results);
      setLoading(false);
      seteffectcontrol(true);
    }
  }, [searchQuery, GroupListActions]);

  const doNothing = () => {
    console.log("do nothing");
  };

  function openProfileSettings() {
    props.navigation.navigate("ProfileSettings");
  }

  async function openChat(groupId: any) {
    props.navigation.navigate("Chat", {
      groupId,
      groups,
    });
  }

  function openDeleteChat(groupName: string): void {
    props.navigation.navigate("ChatDelete", {
      groupName,
    });
  }

  function openNajeebChat(groupId: any): void {
    props.navigation.navigate("ChatPageNajeeb", {
      groupId,
    });
  }

  useEffect(() => {
    setRenderRestrict(false);
  });
  const startNewDirectChat = () => {
    props.navigation.navigate("PeopleSelector", {
      onSelect: async (selectedContacts: ContactInterface[]) => {
        let contact = selectedContacts[0];
        if (renderRestrict === false) {
          let chatExists = groups.filter((group) => {
            const foundToUser = group.members.some(
              (member) =>
                convertedPhoneNumber(member.processedUser.phoneNumber) ===
                convertedPhoneNumber(contact.user.phoneNumber)
            );
            const foundCurrentUser = group.members.some(
              (member) =>
                convertedPhoneNumber(member.processedUser.phoneNumber) ===
                convertedPhoneNumber(userState.phoneNumber)
            );
            console.log(
              `${foundToUser ? "Found To User" : "To User Not Found"} && ${
                foundCurrentUser
                  ? "Found Current User"
                  : "Current User Not Found"
              }`
            );
            if (foundCurrentUser !== null && foundToUser !== null) {
              setRenderRestrict(true);
            }
            console.log(`group.members.length: ${group.members.length}`);
            console.log(`group.level: ${group.level}`);
            return (
              foundToUser &&
              group.members.length === 2 &&
              group.level === GroupLevel.INDIVIDUAL &&
              foundCurrentUser
            );
          });
          if (chatExists.length > 0) {
            openChat(chatExists[0].uid);
          } else {
            const groupRef = await GroupFirebaseActions.createDirectChat(
              contact.user.phoneNumber,
              userState.phoneNumber
            );
            // openChat(groupRef.id);
            onToggleSnackBar();
          }
        }
      },
      title: "Start New Direct Chat",
      multiple: false,
      displayType: DisplayType.REGISTERED,
      onBack: () => {},
      selectedPeople: [],
    });
  };

  const startNewDirectCall = () => {
    props.navigation.navigate("PeopleSelector", {
      onSelect: async (selectedContacts: ContactInterface[]) => {
        let contact = selectedContacts[0];
        let number = "";
        if (Platform.OS === "ios") {
          number = `telprompt:${contact.phoneNumber}`;
        } else {
          number = `tel:${contact.phoneNumber}`;
        }
        Linking.openURL(number);
      },
      title: "Start Voice Call",
      multiple: false,
      displayType: DisplayType.REGISTERED,
      onBack: () => {},
      selectedPeople: [],
      selectButtonLabel: "Call",
    });
  };

  return (
    <View style={[styles.body]}>
      <HomeHeader
        loading={autoRefresh || firstLoad || loading}
        setSearchBarVisible={setSearchBarVisible}
        searchBarVisible={searchBarVisible}
        navigation={props.navigation}
      />
      {searchBarVisible ? (
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          clearButtonMode="while-editing"
          clearIcon={() => <IconButton icon="close" />}
        />
      ) : null}

      <ScrollView
        style={{
          flex: 1,
          width: "100%",
          marginBottom: "20%",
        }}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        {/* Create New Group Row */}
        {searchQuery.length > 0 && searchBarVisible ? null : (
          <View
            style={[
              styles.row,
              {
                marginTop: "3%",
                width: "92%",
                justifyContent: "space-between",
              },
            ]}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 16,
                fontFamily: "Poppins_500Medium",
              }}
            >
              Create New Group
            </Text>
            <IconButton
              icon="plus"
              color={colors.primary}
              size={30}
              onPress={() => goToCreateGroupScreen()}
              style={{
                backgroundColor: "#E4F1FF",
                width: 70,
                height: 32,
                marginRight: 0,
              }}
            />
          </View>
        )}

        {/* CEO Info Row */}
        {searchQuery.length > 0 && searchBarVisible ? null : (
          <View
            style={[
              styles.row,
              { marginTop: 20, width: "92%", justifyContent: "flex-start" },
            ]}
          >
            <Avatar.Image
              size={60}
              style={{ backgroundColor: "#707070" }}
              source={
                ceoInfo.photoURL
                  ? { uri: ceoInfo.photoURL }
                  : require("../../assets/user-icon.png")
              }
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
                  fontSize: 14,
                  color: colors.primary,
                }}
              >
                {ceoInfo.displayName || "No Name"}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: colors.text,
                }}
              >
                Chief Executive Officer
              </Text>
            </View>
          </View>
        )}

        {Object.values(GroupLevel)
          .filter((v) => v !== GroupLevel.INDIVIDUAL)
          .map((level, i) => {
            const groupTitle = level.charAt(0).toUpperCase() + level.slice(1);
            return (
              <AccordionList<GroupAccordionProps<GroupAccordionRowProps>>
                key={i}
                SectionTitle={
                  level == GroupLevel.INDIVIDUAL
                    ? "Direct Chats"
                    : `${groupTitle} Groups`
                }
                EmptyListMessage={
                  firstLoad || loading ? (
                    <ActivityIndicator
                      animating={true}
                      color="#4582C3"
                      size={25}
                    />
                  ) : (
                    "No Groups Found"
                  )
                }
                SectionTitleStyle={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 14,
                  color: colors.palette.gray,
                }}
                SectionStyle={{
                  width: "100%",
                }}
                SkipEmptySections={searchQuery.length > 0}
                Accordions={(searchQuery.length > 0 ? searchResults : groups)
                  .filter((group) => {
                    return group.level == level;
                  })
                  .map((group, i) => {
                    return {
                      ActionButton: {
                        label: "Enter Group Chat",
                        style: {
                          width: "90%",
                          marginLeft: "5%",
                          borderColor: "#D0E2F5",
                          backgroundColor: "aliceblue",
                          borderRadius: 10,
                          borderWidth: 2,
                        },
                        onPress: () => {
                          openChat(group.uid);
                        },
                      },
                      AccordionTitle: `${group.name}`,
                      AccordionTitleStyle: {
                        fontFamily: "Poppins_500Medium",
                      },
                      AccordionStyle: {
                        marginLeft: "5%",
                        width: "90%",
                        marginVertical: "2%",

                        ...Platform.select({
                          ios: {
                            borderWidth: 1,
                          },
                          android: {
                            borderWidth: 0,
                          },
                        }),
                        borderRadius: 8,
                        borderColor: colors.palette.lighterGray,
                        backgroundColor: colors.palette.white,

                        elevation: 6,
                      },
                      AccordionData: group.members.map(
                        (member: GroupMember) => {
                          const user = member.processedUser;
                          if (user !== null) {
                            return {
                              photo: {
                                uri: user.photoURL ? user.photoURL : avatar,
                                width: 60,
                                height: 60,
                              },
                              name: user.displayName,
                              designation:
                                user.status == UserStatus.INVITED
                                  ? "Invited"
                                  : member.privilege.toUpperCase(),
                              title: user.designation,
                            };
                          }
                        }
                      ),
                      AccordionContent: (props) => (
                        <GroupAccordionRow {...props} />
                      ),
                    };
                  })}
              />
            );
          })}
        {searchQuery !== "" &&
        searchResults.filter(
          (group) =>
            group.level == GroupLevel.INDIVIDUAL && group.members.length == 2
        ).length === 0 ? null : (
          <List.Section
            title="Direct Chats"
            titleStyle={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: colors.palette.gray,
            }}
            style={{
              width: "100%",
              paddingBottom: 13,
            }}
          >
            {firstLoad || loading === true ? (
              <>
                <View
                  style={[
                    styles.row,
                    { justifyContent: "flex-start", marginLeft: "5%" },
                  ]}
                >
                  <ActivityIndicator
                    animating={true}
                    color="#4582C3"
                    size={25}
                  />
                </View>
              </>
            ) : (
              (searchQuery.length > 0 ? searchResults : groups)
                .filter(
                  (group) =>
                    group.level == GroupLevel.INDIVIDUAL &&
                    group.members.length == 2
                )
                .map((group, i) => {
                  let toUser = group.members.filter(
                    (member) =>
                      member.processedUser.phoneNumber !== userState.phoneNumber
                  )[0].processedUser;

                  return (
                    <GroupAccordionRow
                      key={i}
                      designation=""
                      name={toUser.displayName}
                      photo={{ uri: toUser.photoURL }}
                      title={toUser.phoneNumber}
                      onPress={() => openChat(group.uid)}
                      //onPress={() => openNajeebChat("8osMbgHj61c5KB1kGg62")}
                    />
                  );
                })
            )}
            {firstLoad === false &&
            loading === false &&
            groups.filter((group) => group.level == GroupLevel.INDIVIDUAL)
              .length === 0 ? (
              <List.Subheader style={{ color: "#4582C3", opacity: 0.6 }}>
                No Direct Chats
              </List.Subheader>
            ) : null}
          </List.Section>
        )}
      </ScrollView>

      {/* Bottom Menu */}
      <Appbar
        style={{
          width: "100%",
          height: 80,
          backgroundColor: colors.palette.white,
          position: "absolute",
          bottom: 0,
          elevation: 20,
          zIndex: 50,
        }}
      >
        <SubmitButton
          onPress={() => goToChatAdminScreen()}
          contentStyle={{ height: 40, width: 125 }}
          labelStyle={{
            fontSize: 13,
            fontFamily: "Poppins_700Bold",
          }}
          style={{
            height: 40,
            width: 125,
            marginLeft: 15,
            marginTop: 0,
          }}
        >
          Chat Admin
        </SubmitButton>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginTop: -7,
            marginLeft: 60,
            marginRight: 5,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Appbar.Action
              color={colors.palette.darkGray}
              size={25}
              icon="phone"
              style={{ marginBottom: -3 }}
              accessibilityLabel="Call"
              onPress={startNewDirectCall}
            />
            <Text
              style={{
                fontSize: 12,
                color: colors.text,
                fontFamily: "Poppins_400Regular",
              }}
            >
              Call
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Appbar.Action
              color={colors.palette.darkGray}
              size={25}
              icon="chat"
              style={{ marginBottom: -4 }}
              accessibilityLabel="Chat"
              onPress={startNewDirectChat}
            />
            <Text
              style={{
                fontSize: 12,
                color: colors.text,
                fontFamily: "Poppins_400Regular",
              }}
            >
              Chat
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Appbar.Action
              color={colors.palette.darkGray}
              size={25}
              style={{ marginRight: "5%", marginBottom: -3 }}
              icon="cogs"
              accessibilityLabel="Settings"
              onPress={openProfileSettings}
            />
            <Text
              style={{
                fontSize: 12,
                color: colors.text,
                fontFamily: "Poppins_400Regular",
              }}
            >
              Settings
            </Text>
          </View>
        </View>
      </Appbar>
      {/* </View> */}
      <Snackbar
        visible={createGroupSnackBar}
        onDismiss={onDismissSnackBar}
        duration={3000}
        style={{
          backgroundColor: colors.palette.darkGray,
          marginBottom: 85,
        }}
        action={{
          label: "OK",
          color: colors.palette.white,
          onPress: () => {
            // Do something
          },
        }}
      >
        Group Created!
      </Snackbar>
      <Snackbar
        visible={disbandGroupSnackBar}
        onDismiss={onDismissSnackBar1}
        duration={3000}
        style={{
          backgroundColor: colors.palette.darkGray,
          marginBottom: 85,
        }}
        action={{
          label: "OK",
          color: colors.palette.white,
          onPress: () => {
            // Do something
          },
        }}
      >
        Group Disbanded
      </Snackbar>
      <Snackbar
        visible={adminChat}
        onDismiss={onDismissAdminChat}
        duration={3000}
        style={{
          backgroundColor: colors.palette.darkGray,
          marginBottom: 85,
        }}
        action={{
          label: "OK",
          color: colors.palette.white,
          onPress: () => {
            // Do something
          },
        }}
      >
        Admin Chat Created Successfully!
      </Snackbar>
    </View>
  );
}
