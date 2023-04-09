export const convertedPhoneNumber = (
  phoneNumber: string,
  type: "post" | "get" = "post",
) => {
  phoneNumber = phoneNumber.toString().replace(/\s/g, "");
  if (type === "post") {
    return phoneNumber?.charAt(0) === "0"
      ? phoneNumber?.replace("0", "+92")
      : phoneNumber;
  } else {
    return phoneNumber?.charAt(0) === "+"
      ? phoneNumber?.replace("+92", "0")
      : phoneNumber;
  }
};
