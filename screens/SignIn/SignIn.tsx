// SafeAreaView is used to make the screen safe from the notch on the iPhone X and XS devices (iPhone X and XS have a notch)
import {
  View,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";

import TextInput from "../../components/TextInput";
import SubmitButton from "../../components/SubmitButton";

import React from "react";

// ActivityIndicator is a component that is used to show a loading animation. It is used to show a loading animation while the app is waiting for data to load.
import { ActivityIndicator, Appbar, useTheme } from "react-native-paper";

// formik is a library that helps us to handle the form validation and submission
// useFormik is a hook that returns a Formik object that we can use to access the Formik API
import { useFormik } from "formik";

// yup is a library that helps us to validate the form data and throw errors if the data is not valid or if the data is not correct according to the schema we defined

import * as Yup from "yup";

// useStyles is a hook that takes a function as an argument and returns an object with the styles
import { useStyles } from "./styles";
import { Text } from "react-native-paper";
import { phoneNumberVerificationRegex } from "../../utils/regex";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { auth, firebaseConfig, phoneProvider } from "../../firebase";

// PhoneAuthProvider from firebase is used to send the verification code to the user phone number and verify the code that the user has entered
import { PhoneAuthProvider } from "firebase/auth";

// OTPTextInput is a component that is used to show a text input where the user can enter the verification code that was sent to the user phone number
import OTPTextInput from "react-native-otp-textinput";
import { useEffect } from "react";
import { useUserStateActions } from "../../slices/userSlice";
import useUserFirebaseActions from "../../hooks/useUserFirebaseActions";
import { convertedPhoneNumber } from "../../utils/convertedPhoneNumber";
import { theme } from "../../theme";
import { Pages } from "../../Pages";
import HelperText from "../../components/HelperText";
import { UserStatus } from "../../modals";
export default function SignIn(props) {
  useEffect(() => {
    setLoading(false);
  });
  const styles = useStyles();
  const { colors } = useTheme();
  const recaptchaVerifier = React.useRef(null);

  const [verificationId, setVerificationId] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  const UserStateActions = useUserStateActions();
  const UserFirebaseActions = useUserFirebaseActions();

  const {
    handleSubmit,
    setFieldValue,
    setFieldError,
    setTouched,
    errors,
    values: { OTP, phoneNumber, step },
    touched,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: SignupSchema,
    onSubmit: async () => {
      if (step === 1) {
        setLoading(true);
        const user = await UserFirebaseActions.getUserByPhoneNumber(
          convertedPhoneNumber(phoneNumber)
        );
        if (user.error !== null) {
          console.log(user.error);
          Alert.alert("Network Down", "Network is not working", [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        } else if (user.data.user.size === 1) {
          let _user = user.data.user.docs[0].data();

          if (_user.status === UserStatus.ACTIVE) {
            handleSendVerificationOTP();

            UserStateActions.setUser(_user);
            // props.navigation.navigate(Pages.HOME);
            setLoading(false);
          } else {
            handleSendVerificationOTP();
          }
        } else if (user.data.user.size === 0) {
          Alert.alert("Not Invited", "User not invited", [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
          setLoading(false);
        }
      } else if (step === 2) {
        handleVerifyOTP();
        setLoading(false);
      }
    },
  });

  // handleSendVerificationOTP is a function that is used to send the verification code to the user phone number
  const handleSendVerificationOTP = () => {
    // setLoading is a function that is used to set the loading state of the component to true or false and it takes a boolean as an argument
    setLoading(true);

    // recaptchaVerifier.current is a reference to the recaptcha verifier component that we created in the FirebaseRecaptchaVerifierModal component and we use it to get the verification code that the user has entered and we pass it to the sendCode function of the PhoneAuthProvider class that we imported from firebase to send the verification code to the user phone number
    phoneProvider
      .verifyPhoneNumber(
        convertedPhoneNumber(phoneNumber),
        recaptchaVerifier.current
      )
      // then is a function that is used to handle the data that is returned from the promise
      // verificationId is a string that is used to identify the verification code that the user has entered
      .then((verificationId) => {
        // setFieldValue is a function that is used to set the value of a field in the form and it takes a field name and a value as arguments
        setFieldValue("step", 2);
        // setTouched is a function that is used to set the touched state of a field in the form and it takes a field name as an argument
        setTouched({});
        setVerificationId(verificationId);
        setLoading(false);
      })
      .catch((error) => {
        setFieldError("phoneNumber", error.message);
      });
    setLoading(false);
  };

  // handleVerifyOTP is a function that is used to verify the code that the user has entered
  const handleVerifyOTP = () => {
    console.log("HandleVerifyOtp is called");
    setLoading(true);
    const credential = PhoneAuthProvider.credential(verificationId, OTP);
    auth
      ?.signInWithCredential(credential)
      .then(async (credential) => {
        console.log("credential", credential);

        //only if the user is active this should be performed

        const user = await UserFirebaseActions.getUserByPhoneNumber(
          convertedPhoneNumber(phoneNumber)
        );
        let _user = user.data.user.docs[0].data();
        if (_user.status === UserStatus.ACTIVE) {
          props.navigation.navigate(Pages.HOME);
          setFieldValue("phoneNumber", "");
          setFieldValue("OTP", "");
          setLoading(false);
        } else {
          props.navigation.navigate(Pages.CompleteProfile, {
            phoneNumber: credential.user.phoneNumber,
          });
          setFieldValue("phoneNumber", "");
          setFieldValue("OTP", "");
        }
      })
      .catch((err) => {
        setFieldError("phoneNumber", err.message);
      });
    setLoading(false);
  };

  return (
    // Using ScrollView to dismiss keyboard when user clicks anywhere on the screen.
    <ScrollView
      scrollEnabled={false}
      contentContainerStyle={[
        styles.body,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Appbar.Header
        style={{
          width: "100%",
          height: 70,
          backgroundColor: colors.palette.white,
          zIndex: 2,
        }}
      >
        {/* <Appbar.BackAction
          color={colors.palette.darkGray}
          onPress={() => props.navigation.navigate("SignIn")}
        /> */}
        <Appbar.Content
          title="Sign In"
          titleStyle={{ fontFamily: "Poppins_600SemiBold", fontSize: 18 }}
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
      <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
        <View style={styles.imageView}>
          <Image
            source={require("../../assets/logo.png")}
            style={{ width: "50%" }}
            resizeMode="contain"
          />
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins_400Regular",
          }}
        >
          Please Enter your Phone Number
        </Text>
        <View style={[{ marginTop: 30 }]}>
          {step === 1 ? (
            <>
              <TextInput
                label="Phone Number"
                onChangeText={(value) => {
                  setFieldValue("phoneNumber", value);
                }}
                value={phoneNumber}
                errorText={touched.phoneNumber && errors.phoneNumber}
                name="phoneNumber"
                keyboardType="number-pad"
                underlineColor="transparent"
                maxLength={11}
                style={styles.signInButtonStyle}
              />
              {loading ? (
                <ActivityIndicator style={{ marginTop: 55 }} />
              ) : (
                <SubmitButton
                  mode="contained"
                  onPress={handleSubmit}
                  uppercase={false}
                  disabled={touched.phoneNumber && Boolean(errors.phoneNumber)}
                  style={{ marginTop: 55, alignSelf: "center" }}
                >
                  Next
                </SubmitButton>
              )}
            </>
          ) : (
            <>
              <OTPTextInput
                textInputStyle={styles.singleInput}
                offTintColor={theme.colors.palette.white}
                inputCount={6}
                tintColor={
                  touched.OTP && errors.OTP
                    ? theme.colors.error
                    : theme.colors.primary
                }
                containerStyle={styles.otpView}
                handleTextChange={(value) => {
                  setFieldValue("OTP", value);
                }}
              />
              {touched.OTP && errors.OTP?.length > 0 && (
                <HelperText type="error" style={{ textAlign: "center" }}>
                  {errors.OTP}
                </HelperText>
              )}
              {loading ? (
                <ActivityIndicator style={{ marginTop: 55 }} />
              ) : (
                <SubmitButton
                  mode="contained"
                  uppercase={false}
                  disabled={touched.OTP && Boolean(errors.OTP)}
                  style={{ marginTop: 55, alignSelf: "center" }}
                  onPress={handleSubmit}
                >
                  Verify OTP
                </SubmitButton>
              )}
            </>
          )}
        </View>

        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
          // attemptInvisibleVerification={true}
        />
      </SafeAreaView>
    </ScrollView>
  );
}

// Formik Info
const initialValues = {
  phoneNumber: "",
  OTP: "",
  step: 1,
};

const SignupSchema = Yup.object().shape({
  step: Yup.number(),
  phoneNumber: Yup.string()
    .min(11, "Phone number must be 11 digits")
    .required("Required")
    .matches(phoneNumberVerificationRegex, "Phone number must be valid"),
  OTP: Yup.string()
    .min(6, "OTP must be 6 digits")
    .when("step", {
      is: 2,
      then: Yup.string().required("Required"),
    }),
});
