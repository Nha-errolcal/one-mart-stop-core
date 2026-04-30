import { getPermission } from "../util/Helper";

export class MartPOS {
  #permissions = [];

  constructor() {
    const raw = getPermission();
    if (!raw) return;

    this.#permissions = Object.values(raw).flatMap(
      (entry) => entry?.action ?? [],
    );
  }

  // Check by permission code, e.g. can("product.view")
  can = (code) => {
    return this.#permissions.some((p) => p.code === code && p.allowed === true);
  };

  // Check by web route, e.g. canRoute("/products")
  canRoute = (route) => {
    return this.#permissions.some(
      (p) => p.web_route === route && p.allowed === true,
    );
  };

  // Get all allowed permission codes
  allowedCodes = () => {
    return this.#permissions
      .filter((p) => p.allowed === true)
      .map((p) => p.code);
  };
}
