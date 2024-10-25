import { useLocation } from "react-router-dom";
import { Event } from "../storage/types";

export function useEventAdmin(event?: Event | null) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const adminToken = searchParams.get("admin");

  const isAdmin = event?.adminToken === adminToken;

  // Generate admin URL for sharing
  const getAdminUrl = () => {
    if (!event) return null;
    const url = new URL(window.location.href);
    url.searchParams.set("admin", event.adminToken);
    return url.toString();
  };

  return {
    isAdmin,
    adminToken,
    adminUrl: getAdminUrl(),
  };
}
