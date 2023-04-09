import { GroupMemberPrivilege } from "../modals";

export const isPrivilegeValid = (
  messagePrivilege: GroupMemberPrivilege,
  userPrivilege: GroupMemberPrivilege,
) => {
  if (
    userPrivilege === GroupMemberPrivilege.CEO ||
    userPrivilege === GroupMemberPrivilege.OWNER
  ) {
    return true;
  } else if (messagePrivilege === GroupMemberPrivilege.CO_LEAD) {
    return [GroupMemberPrivilege.CO_LEAD].includes(userPrivilege);
  } else if (messagePrivilege === GroupMemberPrivilege.GROUP_LEAD) {
    return [
      GroupMemberPrivilege.CO_LEAD,
      GroupMemberPrivilege.GROUP_LEAD,
    ].includes(userPrivilege);
  } else if (messagePrivilege === GroupMemberPrivilege.USER) {
    return true;
  }
};
