import {
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import TextInput from "../../components/TextInput";
import SubmitButton from "../../components/SubmitButton";
import {
  ActivityIndicator,
  Avatar,
  IconButton,
  Text,
} from "react-native-paper";
import { useStyles } from "./styles";
import useUserFirebaseActions from "../../hooks/useUserFirebaseActions";
import { theme } from "../../theme";
import * as ImagePicker from "expo-image-picker";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Pages } from "../../Pages";
import { DefaultImages, getDefaultImages } from "../../utils/getDefaultImages";
import { useUserStateActions } from "../../slices/userSlice";
import { UserStatus } from "../../modals";

// hook that contains notification functions
// ExpoNotifications is a library that provides a way to send notifications to the user.
// useNotifications is a hook that contains functions to register for, send and receive notifications.
import useExpoNotifications from "../../hooks/useNotifications";

function CompleteProfile({ route, navigation }) {
  const { phoneNumber } = route.params;
  const { updateUser, getUser } = useUserFirebaseActions();
  const UserStateActions = useUserStateActions();

  const [loading, setLoading] = React.useState(false);

  // const [avatar, setAvatar] = React.useState(null);
  const [avatar, setAvatar] = React.useState("");
  const [logo, setLogo] = React.useState("");

  const useNotifications = useExpoNotifications();
  // calling function to register for notifications

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (result.cancelled === false) {
      setFieldValue("photoURI", result.uri);
    }
  };

  const {
    handleSubmit,
    setFieldValue,
    setTouched,
    errors,
    touched,
    values: { photoURI, displayName },
  } = useFormik({
    initialValues: initialValues,
    validationSchema: SignupSchema,
    onSubmit: async () => {
      // rest errors
      setTouched({});
      setLoading(true);

      useNotifications.registerForPushNotificationsAsync();
      let token = useNotifications.expoPushToken;
      console.log("token: ", token);

      // update user
      const res = await updateUser({
        phoneNumber,
        displayName,
        photoURL: photoURI,
        status: UserStatus.ACTIVE,
        notificationToken: token,
      });

      if (res.success) {
        const user = await getUser(phoneNumber);

        if (user.success && user.data.user.exists) {
          UserStateActions.setUser(user.data.user.data());
          navigation.navigate(Pages.HOME);
          setAvatar("");
          setFieldValue("displayName","")
          setFieldValue("photoURI","")
          setLoading(false);
        }
      } else {
        setAvatar("");
        setLoading(false);
        setFieldValue("displayName","")
        setFieldValue("photoURI","")
        console.log("error", res.error);
      }
    },
  });

  // component did mount
  React.useEffect(() => {
    setLoading(false);
    const fetchDefaultImages = async () => {
      const images = await getDefaultImages([
        DefaultImages.PROFILE_IMAGE,
        DefaultImages.LOGO,
      ]);
      setAvatar(images[0]);
      setLogo(images[1]);
    };
    fetchDefaultImages().catch((err) => console.log(err));
  }, []);

  const styles = useStyles();

  return (
    <ScrollView
      scrollEnabled={false}
      style={{ backgroundColor: theme.colors.background }}
    >
      <KeyboardAvoidingView behavior="position" enabled>
        <View
          style={{
            ...Platform.select({
              ios: {
                marginTop: getScreenPercentageSize(8).height,
              },
              android: {
                marginTop: getScreenPercentageSize(13).height,
              },
            }),
          }}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={{ alignSelf: "center", width: 180, height: 60 }}
            resizeMode="contain"
          />
        </View>

        <View style={{ marginTop: getScreenPercentageSize(5).height }}>
          {photoURI ? (
            <TouchableOpacity
              onPress={pickImage}
              style={{ alignSelf: "center", width: 135, height: 135 }}
            >
              <Avatar.Image size={135} source={{ uri: photoURI }} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={pickImage}
              style={{ alignSelf: "center", width: 135, height: 135 }}
              activeOpacity={0.9}
            >
              <Avatar.Image
                size={135}
                source={require("../../assets/no-profile-picture-placeholder.png")}
                style={{ alignSelf: "center" }}
              />
            </TouchableOpacity>
          )}
          <IconButton
            icon="plus"
            color={theme.colors.palette.white}
            size={25}
            onPress={pickImage}
            style={styles.iconButton}
          />
        </View>

        <View style={{ alignItems: "center", marginTop: 25 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_400Regular",
            }}
          >
            Tap the <Text style={{ fontWeight: "bold" }}>+</Text> button to
            upload
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
            }}
          >
            your profile picture.
          </Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <TextInput
              label="Full Name"
              keyboardType="default"
              underlineColor="transparent"
              value={displayName}
              onChangeText={(value) => {
                setFieldValue("displayName", value);
              }}
              errorText={touched.displayName && errors.displayName}
              style={styles.singleInput}
            />
          </View>
        </View>
        <View style={{ marginTop: 30, marginBottom: 30 }}>
          {loading ? (
            <ActivityIndicator animating={true} color={theme.colors.primary} />
          ) : (
            <SubmitButton
              onPress={handleSubmit}
              style={{ alignSelf: "center" }}
            >
              Done
            </SubmitButton>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
export default CompleteProfile;

// Formik Info
const initialValues = {
  photoURI: "",
  displayName: "",
};

const SignupSchema = Yup.object().shape({
  photoURI: Yup.string().required("Image is required"),
  displayName: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});
