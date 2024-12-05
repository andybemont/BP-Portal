import { userIds } from "./backup";

export const userNameById = (user_id?: string) => {
  switch (user_id) {
    case userIds.andy:
      return "Andy";
    case userIds.carly:
      return "Carly";
    case userIds.gillian:
      return "Gillian";
  }
  return "Unassigned";
};

export const userNamesByIds = (user_ids: any[]) => {
  const actualUsers = user_ids.filter((u) => u);
  if (actualUsers.length === 0) {
    return "Unassigned";
  }
  return actualUsers.map((userId) => userNameById(userId)).join(", ");
};