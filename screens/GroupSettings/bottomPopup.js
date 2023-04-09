import React from "react";
import {
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { IconButton } from "react-native-paper";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";

export class BottomPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  show = () => {
    this.setState({ show: true });
  };

  close = () => {
    this.setState({ show: false });
  };

  renderOutsideTouchable(onTouch) {
    const view = <View style={{ flex: 1, width: "100%" }} />;
    if (!onTouch) return view;

    return (
      <TouchableWithoutFeedback
        onPress={onTouch}
        style={{ flex: 1, width: "100%" }}
      >
        {view}
      </TouchableWithoutFeedback>
    );
  }

  render() {
    let { show } = this.state;

    const { onTouchOutside } = this.props;

    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={show}
        onRequestClose={this.close}
        style={{ elevation: 6 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            // backgroundColor: "#000000AA",
          }}
        >
          {this.renderOutsideTouchable(onTouchOutside)}
          <View
            style={{
              ...Platform.select({
                ios: {
                  backgroundColor: "#FFFFFF",
                  width: "100%",
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                  paddingHorizontal: 10,
                  height: getScreenPercentageSize(23).height,
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.27,
                  shadowRadius: 4.65,
                },
                android: {
                  backgroundColor: "#FFFFFF",
                  width: "100%",
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                  paddingHorizontal: 10,
                  height: getScreenPercentageSize(18).height,
                  elevation: 10,
                },
              }),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("DirectContacts");
                }}
                style={{
                  width: "50%",
                  padding: 15,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <IconButton icon="database" color="#707070" size={35} />
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      color: "#707070",
                      textAlign: "center",
                    }}
                  >
                    Add Available
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      color: "#707070",
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    Intranet Members
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("GroupContacts");
                }}
                style={{
                  padding: 15,
                  width: "50%",
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <IconButton icon="contacts" color="#707070" size={35} />
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      color: "#707070",
                      textAlign: "center",
                    }}
                  >
                    Invite From
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      color: "#707070",
                      textAlign: "center",
                    }}
                  >
                    Phone Book
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
