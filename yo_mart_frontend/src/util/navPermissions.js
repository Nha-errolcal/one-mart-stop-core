export function normalize(path) {
  if (!path) return "";
  return path.replace(/\/+$/, "");
}

/**
 * Build allowed routes from backend permissions
 */
export function getAllowedPermissions(user) {
  const allowed = new Set();

  const roles = user?.roles ?? [];

  for (const role of roles) {
    const permissions = role?.permissions ?? {};

    for (const group of Object.values(permissions)) {
      const actions = group?.action ?? [];

      for (const action of actions) {
        if (action.allowed && action.web_route) {
          allowed.add(action.web_route.trim());
        }
      }
    }
  }

  return allowed;
}

/**
 * Filter sidebar items based on permissions
 */
export function filterNavItems(items, allowedRoutes) {
  const ALWAYS_VISIBLE = ["/", "/about/system", "/about/team"];

  return items.reduce((acc, item) => {
    const key = item.key?.trim();

    // always visible
    if (ALWAYS_VISIBLE.includes(key)) {
      acc.push(item);
      return acc;
    }

    // group
    if (item.children) {
      // const children = item.children.filter((c) => allowedRoutes.has(c.key));
      // console.log(children);
      const children = item.children.filter((c) => {
        // console.log(c);
        allowedRoutes.has(c.key);
      });
      if (children.length > 0) {
        acc.push({ ...item, children });
      }

      return acc;
    }

    // normal route
    if (allowedRoutes.has(key)) {
      acc.push(item);
    }

    return acc;
  }, []);
}
