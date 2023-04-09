import React, { useEffect } from "react";
import useUserFirebaseActions from "../../hooks/useUserFirebaseActions";
export default function DataExtractor(props) {
  const userFireBaseActions = useUserFirebaseActions();
  let userData = [];
  useEffect(() => {
    userFireBaseActions.getUsers().then(({ data }) => {
      const users = data.users.docs;
      users.map((u) => {
        const user = u.data();
        userData.push(user);
      });
      props.Data(userData);
    });
  });

  return null;
}
