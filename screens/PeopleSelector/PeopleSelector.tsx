/* eslint-disable @typescript-eslint/indent */
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import useUserFirebaseActions from "../../hooks/useUserFirebaseActions";
import {
  useTheme,
  Appbar,
  Button,
  IconButton,
  Searchbar,
} from "react-native-paper";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";
import { ContactInterface, useContactsState } from "../../slices/contactsSlice";
import fetchContacts from "../../utils/fetchContacts";
import { uniqBy } from "lodash";
import { useUserState } from "../../slices/userSlice";
import { convertedPhoneNumber } from "../../utils/convertedPhoneNumber";
import { theme } from "../../theme";

export enum DisplayType {
  REGISTERED,
  CONTACTS,
  BOTH,
}

export type PeopleSelectorProps = {
  // eslint-disable-next-line no-unused-vars
  onSelect: (selectedPeople: ContactInterface[]) => void;
  displayType: DisplayType;
  selectedPeople: ContactInterface[];
  multiple: boolean;
  title: string;
  onBack: () => void;
  selectButtonLabel?: string;
  inviteButtonLabel?: string;
};

function PeopleSelector(props: {
  navigation?: any;
  route?: { params: PeopleSelectorProps };
}) {
  const { route } = props;
  const [selectedContacts, setSelectedContacts] = useState<ContactInterface[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const doneSelection = (selectedContacts: ContactInterface[]) => {
    route.params.onSelect(selectedContacts);
    props.navigation.goBack();
  };

  const selectContact = (contact: ContactInterface) => {
    if (props.route.params.multiple) {
      setSelectedContacts([...selectedContacts, contact]);
    } else {
      setSelectedContacts([contact]);
      doneSelection([contact]);
    }
  };
  const theme = useTheme();
  const { colors } = useTheme();

  const UserFirebaseActions = useUserFirebaseActions();

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
  const ContactsState = useContactsState();
  const [searchQuery, setSearchQuery] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);
  const [contacts, setContacts] = useState(
    [...ContactsState].sort((a, b) => Number(b.inSystem) - Number(a.inSystem))
  );
  const [displayType, setDisplayType] = useState(DisplayType.BOTH);

  if (props.route.params.displayType !== displayType) {
    setDisplayType(props.route.params.displayType);
  }

  useLayoutEffect(() => {
    let updatedContacts = [...contacts];
    // fetchContacts().then((contacts): void => {

    if (
      displayType === DisplayType.REGISTERED ||
      displayType === DisplayType.BOTH
    ) {
      UserFirebaseActions.getUsers().then(({ data }) => {
        const users = data.users.docs;
        const userContacts = users.map((u): ContactInterface => {
          const user = u.data();
          if (user.isAdmin !== true) {
            return {
              name: user.displayName,
              phoneNumber: convertedPhoneNumber(user.phoneNumber),
              inSystem: true,
              user: user,
            };
          }
        });

        updatedContacts = updatedContacts.concat(userContacts);

        setContacts(
          uniqBy(updatedContacts, "phoneNumber").sort(
            (a, b) => Number(b.inSystem) - Number(a.inSystem)
          )
        );
      });
    }

    setLoading(false);
    // });
  }, [ContactsState]);

  const userState = useUserState();

  return (
    // Using ScrollView to dismiss keyboard when user clicks anywhere on the screen.
    <View style={[styles.body]}>
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
            if (!loading) {
              props.route.params.onBack();
              props.navigation.goBack();
            }
          }}
        />
        <Appbar.Content
          title={props.route.params.title || "Contact Selector"}
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
        {loading ? (
          <ActivityIndicator
            animating={true}
            size={30}
            style={{
              marginRight: 20,
            }}
            color={theme.colors.primary}
          />
        ) : null}
        {props.route.params.multiple === true && selectedContacts.length > 0 ? (
          <Button onPress={() => doneSelection(selectedContacts)}>
            Done ({selectedContacts.length})
          </Button>
        ) : (
          <></>
        )}
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
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        <View
          style={[
            {
              marginTop: 25,
              marginBottom: 25,
            },
          ]}
        >
          {searchQuery === ""
            ? contacts.map((contact, index) => {
                if (!(contact?.name && contact?.phoneNumber)) {
                  return null;
                }
                if (
                  (contact.inSystem == false &&
                    displayType == DisplayType.REGISTERED) ||
                  (contact.inSystem == true &&
                    displayType == DisplayType.CONTACTS)
                ) {
                  return null;
                }
                if (
                  convertedPhoneNumber(contact.phoneNumber) ==
                  convertedPhoneNumber(userState.phoneNumber)
                ) {
                  return null;
                }
                return (
                  <View
                    key={"contact-" + index}
                    style={[
                      styles.row,
                      {
                        paddingHorizontal: 10,
                        backgroundColor: colors.palette.almostWhite,
                        width: "93%",
                        alignSelf: "center",
                        borderRadius: 7,
                        paddingVertical: 6,
                        marginVertical: 5,
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
                      {contact?.phoneNumber || "No Phone Number"}
                      <Text
                        style={{
                          color: "#909090",
                          fontSize: 12,
                        }}
                      >
                        {"   ~ "}
                        {contact.inSystem
                          ? contact.user.displayName
                          : contact?.name || "No Name"}
                      </Text>
                    </Text>

                    {props.route.params.title == "Start Voice Call" && (
                      <IconButton
                        icon="phone"
                        size={30}
                        color={"#999999"}
                        onPress={() => selectContact(contact)}
                      />
                    )}

                    {props.route.params.title == "Start New Direct Chat" && (
                      <IconButton
                        icon="chat"
                        size={30}
                        color={"#999999"}
                        onPress={() => selectContact(contact)}
                      />
                    )}

                    {props.route.params.title == "Select Group Leader" && (
                      <Button
                        uppercase={false}
                        disabled={loading}
                        mode="contained"
                        style={{
                          marginLeft: "auto",
                          borderRadius: 25,
                          backgroundColor: loading
                            ? theme.colors.disabled
                            : "#E4F1FF",
                          elevation: 0,
                        }}
                        contentStyle={{ paddingHorizontal: 3, height: 35 }}
                        labelStyle={{
                          color: "#4582C3",
                          fontFamily: "Poppins_600SemiBold",
                          fontSize: 12,
                        }}
                        onPress={() => selectContact(contact)}
                      >
                        {contact.inSystem
                          ? route.params.selectButtonLabel || "Select"
                          : route.params.inviteButtonLabel || "Invite"}
                      </Button>
                    )}
                  </View>
                );
              })
            : contacts.map((contact, index) => {
                if (contact.name.match(searchQuery)) {
                  if (!(contact?.name && contact?.phoneNumber)) {
                    return null;
                  }
                  if (
                    (contact.inSystem == false &&
                      displayType == DisplayType.REGISTERED) ||
                    (contact.inSystem == true &&
                      displayType == DisplayType.CONTACTS)
                  ) {
                    return null;
                  }
                  if (
                    convertedPhoneNumber(contact.phoneNumber) ==
                    convertedPhoneNumber(userState.phoneNumber)
                  ) {
                    return null;
                  }
                  return (
                    <View
                      key={"contact-" + index}
                      style={[
                        styles.row,
                        {
                          paddingHorizontal: 10,
                          backgroundColor: colors.palette.almostWhite,
                          width: "93%",
                          alignSelf: "center",
                          borderRadius: 7,
                          paddingVertical: 6,
                          marginVertical: 5,
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
                        {contact?.phoneNumber || "No Phone Number"}
                        <Text
                          style={{
                            color: "#909090",
                            fontSize: 12,
                          }}
                        >
                          {"   ~ "}
                          {contact.inSystem
                            ? contact.user.displayName
                            : contact?.name || "No Name"}
                        </Text>
                      </Text>

                      {props.route.params.title == "Start Voice Call" && (
                        <IconButton
                          icon="phone"
                          size={30}
                          color={"#999999"}
                          onPress={() => selectContact(contact)}
                        />
                      )}

                      {props.route.params.title == "Start New Direct Chat" && (
                        <IconButton
                          icon="chat"
                          size={30}
                          color={"#999999"}
                          onPress={() => selectContact(contact)}
                        />
                      )}

                      {props.route.params.title == "Select Group Leader" && (
                        <Button
                          uppercase={false}
                          disabled={loading}
                          mode="contained"
                          style={{
                            marginLeft: "auto",
                            borderRadius: 25,
                            backgroundColor: loading
                              ? theme.colors.disabled
                              : "#E4F1FF",
                            elevation: 0,
                          }}
                          contentStyle={{ paddingHorizontal: 3, height: 35 }}
                          labelStyle={{
                            color: "#4582C3",
                            fontFamily: "Poppins_600SemiBold",
                            fontSize: 12,
                          }}
                          onPress={() => selectContact(contact)}
                        >
                          {contact.inSystem
                            ? route.params.selectButtonLabel || "Select"
                            : route.params.inviteButtonLabel || "Invite"}
                        </Button>
                      )}
                    </View>
                  );
                } else {
                  return null;
                }
              })}
        </View>
      </ScrollView>
    </View>
  );
}
export default PeopleSelector;
