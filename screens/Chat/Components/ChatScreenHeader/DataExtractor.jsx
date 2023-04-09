import { useEffect, useState } from "react";
import useUserFirebaseActions from "../../../../hooks/useUserFirebaseActions";
const Dataex = (props) => {
  const { getUser } = useUserFirebaseActions();
  const [membersArray, setmembersArray] = useState([]);
  useEffect(() => {
    props.members.map(
      async (user) => {
        const member = await getUser(user.uid);
        membersArray.push(member.data.user.data());
        if (membersArray.length === props.members.length) {
          console.log(membersArray);
          props.Data(membersArray);
        }
      },
      [membersArray]
    );
  }, [membersArray]);

  return null;
};

export default Dataex;
