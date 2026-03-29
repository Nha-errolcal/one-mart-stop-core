export const filterNavItems = (navItems, permissions, isSuperAdmin = false) => {
  if (!permissions || typeof permissions !== "object") return [];

  if (isSuperAdmin) return navItems;

  const allowedRoutes = Object.keys(permissions).filter((key) => {
    return permissions[key].action.some((a) => a.allowed);
  });

  const filterItem = (items) =>
    items
      .map((item) => {
        if (item.children) {
          const filteredChildren = filterItem(item.children);
          if (filteredChildren.length === 0) return null;
          return { ...item, children: filteredChildren };
        }

        if (allowedRoutes.includes(item.key)) return item;
        return null;
      })
      .filter(Boolean);

  return filterItem(navItems);
};

// Check permission for single action
export const canAccess = (permissions, key, code, isSuperAdmin = false) => {
  if (isSuperAdmin) return true;
  if (!permissions || typeof permissions !== "object") return false;
  const actions = permissions[key]?.action || [];
  return actions.some((a) => a.code === code && a.allowed);
};
