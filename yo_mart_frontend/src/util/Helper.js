export const setPermission = (data) => {
  localStorage.setItem("permissions", JSON.stringify(data));
};
export const getPermission = () => {
  try {
    let profile = localStorage.getItem("permissions");
    if (profile !== "" && profile !== null && profile !== undefined) {
      return JSON.parse(profile);
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const extractAllowedCodes = (user) => {
  if (!user?.roles) return new Set();

  const codes = new Set();

  user.roles.forEach((role) => {
    const permissions = role.permissions;

    if (!permissions) return;

    Object.values(permissions).forEach((perm) => {
      const actions = perm?.action;

      if (!Array.isArray(actions)) return;

      actions.forEach((a) => {
        if (a?.allowed === true && a?.code) {
          codes.add(a.code);
        }
      });
    });
  });

  return codes;
};
