import { useParams } from "react-router-dom";
import { EventPage as EventPageComponent } from "../components/EventPage";

export function EventPage() {
  const { eventKey } = useParams<{ eventKey: string }>();

  if (!eventKey) return null;

  return <EventPageComponent eventKey={eventKey} />;
}
