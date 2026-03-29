import { getProfile } from "../store/profile";

export class MartPOS {
  constructor() {
    const profile = getProfile();
    this.permissions = profile?.roles?.[0]?.permissions || [];
  }

  /**
   * Check if a specific action is allowed for a module
   * @param {string} module - e.g., "customer", "employees"
   * @param {string} code - e.g., "customer.view", "employee.create"
   * @returns {boolean}
   */
  can(module, code) {
    if (!this.permissions.length) return false;

    const modulePermissions = this.permissions.filter((p) => p.name === module);
    if (!modulePermissions.length) return false;

    // Check if any of the module permissions match the code and allowed = true
    return modulePermissions.some((p) => p.code === code && p.allowed);
  }

  // Check if the user has full access (super admin)
  isSuperAdmin() {
    const roleName = getProfile()?.roles?.[0]?.name?.toLowerCase() || "";
    return roleName === "super admin";
  }
}

// Usage example
// const martPOS = new MartPOS();

// console.log(martPOS.can("customer", "customer.view")); // true / false
// console.log(martPOS.can("employees", "employee.create")); // true / false
