// This is not a test file rather a feature used to set members when a group
// is created.
// Do not delete under any circumstances
import { db } from "../../firebase";
import { fireStoreGroupConverter } from "../../modals";
const createGroupTest = async (propmembers, group, propuid) => {
  let members = [];

  propmembers.map((user) => {
    return members.push(user);
  });

  let success = true;
  let error = null;
  let data = {};

  try {
    const groupRef = await db
      .collection("groups")
      .withConverter(fireStoreGroupConverter)
      .add({ ...group, members: members, uid: propuid });

    await db
      .collection("groups")
      .doc(groupRef._delegate._key.path.segments[1])
      .update({ uid: groupRef._delegate._key.path.segments[1] });
  } catch (err) {
    error = err;
    success = false;
    data = null;
  }
  return { error, success, data };
};

export default createGroupTest;
