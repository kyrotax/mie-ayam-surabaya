import { Role } from "./types";

export type Action =
  | "view_dashboard"
  | "edit_store_status"
  | "edit_store_hours"
  | "edit_content"
  | "edit_contact_location"
  | "manage_menu"
  | "delete_menu"
  | "manage_chatbot"
  | "create_order"
  | "view_orders"
  | "manage_confirmed_order"
  | "view_reports"
  | "manage_users"
  | "reset_dummy_data";

export const rolePermissions: Record<Role, Record<Action, boolean>> = {
  owner: {
    view_dashboard: true,
    edit_store_status: true,
    edit_store_hours: true,
    edit_content: true,
    edit_contact_location: true,
    manage_menu: true,
    delete_menu: true,
    manage_chatbot: true,
    create_order: true,
    view_orders: true,
    manage_confirmed_order: true,
    view_reports: true,
    manage_users: true,
    reset_dummy_data: true,
  },
  admin: {
    view_dashboard: true,
    edit_store_status: true,
    edit_store_hours: true,
    edit_content: true,
    edit_contact_location: false,
    manage_menu: true,
    delete_menu: false,
    manage_chatbot: true,
    create_order: true,
    view_orders: true,
    manage_confirmed_order: false,
    view_reports: true,
    manage_users: false,
    reset_dummy_data: false,
  },
};

export function can(role: Role, action: Action): boolean {
  return !!rolePermissions[role]?.[action];
}

export function canAccess(role: Role, pathname: string): boolean {
  if (pathname === "/admin/akun" || pathname.startsWith("/admin/akun/")) {
    return role === "owner";
  }
  return true;
}
