import React, {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";

import { createRoot } from "react-dom/client";
import "./styles.css";

const initialEvents = [
  {
    id: 1,
    date: "2026-09-13",
    time: "10:00",
    title: "Product teaser",
    platform: "X"
  },
  {
    id: 2,
    date: "2026-09-14",
    time: "14:00",
    title: "Behind the scenes",
    platform: "Instagram"
  },
  {
    id: 3,
    date: "2026-09-16",
    time: "11:30",
    title: "Company update",
    platform: "LinkedIn"
  },
  {
    id: 4,
    date: "2026-09-18",
    time: "18:00",
    title: "Weekend campaign",
    platform: "X"
  }
];

const dates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date("2026-09-13T00:00:00");
  d.setDate(d.getDate() + i);
  return d.toISOString().slice(0, 10);
});

/* ---------------- EVENT CARD ---------------- */

const EventCard = memo(function EventCard({
  event,
  onDragStart
}) {
  return (
    <div
      className="event"
      draggable
      onDragStart={(e) => onDragStart(e, event.id)}
    >
      <strong>{event.title}</strong>

      <small>
        {event.time} · {event.platform}
      </small>
    </div>
  );
});

/* ---------------- NON OPTIMIZED ---------------- */

function NonOptimizedCalendar() {
  const [events, setEvents] = useState(initialEvents);

  // Changes whenever a new date is hovered.
  // This deliberately causes a render.
  const [hoveredDate, setHoveredDate] = useState(null);

  const renderCount = useRef(0);
  renderCount.current++;

  const handleDragStart = useCallback((e, id) => {
    e.dataTransfer.setData("eventId", id);
  }, []);

  const handleDragOver = (e, date) => {
    e.preventDefault();

    /*
      NON-OPTIMIZED BEHAVIOUR:

      Every time the cursor enters a different date,
      state is changed.

      Therefore:
      Date 1 → render
      Date 2 → render
      Date 3 → render
      Date 4 → render
      ...
    */

    if (hoveredDate !== date) {
      setHoveredDate(date);
    }
  };

  const handleDrop = (e, date) => {
    e.preventDefault();

    const id = Number(e.dataTransfer.getData("eventId"));

    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? { ...event, date }
          : event
      )
    );

    setHoveredDate(null);
  };

  return (
    <section className="calendar-panel nonoptimized">
      <div className="panel-header">
        <div>
          <span className="red-badge">❌ NON-OPTIMIZED</span>

          <h2>Render on Hover</h2>

          <p>
            Every new date hovered changes state and
            triggers a render.
          </p>
        </div>

        <div className="render-counter">
          <span>Render Count</span>
          <strong>{renderCount.current}</strong>
        </div>
      </div>

      <div className="calendar">
        {dates.map((date) => (
          <div
            className={
              hoveredDate === date
                ? "day hovered"
                : "day"
            }
            key={date}
            onDragOver={(e) =>
              handleDragOver(e, date)
            }
            onDrop={(e) =>
              handleDrop(e, date)
            }
          >
            <div className="day-header">
              <strong>
                {new Date(
                  date + "T00:00:00"
                ).toLocaleDateString(undefined, {
                  weekday: "short"
                })}
              </strong>

              <span>{date.slice(8)}</span>
            </div>

            {events
              .filter((event) => event.date === date)
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDragStart={handleDragStart}
                />
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- OPTIMIZED ---------------- */

function OptimizedCalendar() {
  const [events, setEvents] = useState(initialEvents);

  /*
    IMPORTANT:

    There is NO hoveredDate state.

    Dragging over dates does not update React state.

    Therefore hovering does NOT cause a render.
  */

  const renderCount = useRef(0);
  renderCount.current++;

  const handleDragStart = useCallback((e, id) => {
    e.dataTransfer.setData("eventId", id);
  }, []);

  const handleDragOver = useCallback((e) => {
    /*
      We ONLY prevent the browser default behaviour.

      No setState.
      No state change.
      No React render.
    */

    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e, date) => {
    e.preventDefault();

    const id = Number(e.dataTransfer.getData("eventId"));

    /*
      ONLY THE DROP changes state.

      Therefore the calendar renders once after dropping.
    */

    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? { ...event, date }
          : event
      )
    );
  }, []);

  return (
    <section className="calendar-panel optimized">
      <div className="panel-header">
        <div>
          <span className="green-badge">
            ✅ OPTIMIZED
          </span>

          <h2>Render on Drop</h2>

          <p>
            Hovering dates does not change state.
            Rendering happens only after drop.
          </p>
        </div>

        <div className="render-counter">
          <span>Render Count</span>
          <strong>{renderCount.current}</strong>
        </div>
      </div>

      <div className="calendar">
        {dates.map((date) => (
          <div
            className="day"
            key={date}
            onDragOver={handleDragOver}
            onDrop={(e) =>
              handleDrop(e, date)
            }
          >
            <div className="day-header">
              <strong>
                {new Date(
                  date + "T00:00:00"
                ).toLocaleDateString(undefined, {
                  weekday: "short"
                })}
              </strong>

              <span>{date.slice(8)}</span>
            </div>

            {events
              .filter((event) => event.date === date)
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDragStart={handleDragStart}
                />
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- MAIN APP ---------------- */

function App() {
  const eventCount = useMemo(
    () => initialEvents.length,
    []
  );

  return (
    <main className="page">

      <header className="hero">
        <span className="badge">
          Experiment 1.4.1 + 1.4.2
        </span>

        <h1>
          Calendar Performance Lab
        </h1>

        <p>
          Compare unnecessary renders during
          drag-and-drop scheduling.
        </p>
      </header>

      <div className="summary">
        <strong>
          {eventCount} scheduled posts
        </strong>

        <span>
          Drag a post across several dates and
          compare the render counters.
        </span>
      </div>

      <div className="comparison">
        <NonOptimizedCalendar />

        <OptimizedCalendar />
      </div>

      <section className="explanation">

        <div>
          <h2>❌ Non-Optimized</h2>

          <p>
            Every time the user moves over a new
            date, React state changes.
          </p>

          <code>
            onDragOver → setHoveredDate()
            → re-render
          </code>
        </div>

        <div>
          <h2>✅ Optimized</h2>

          <p>
            Drag-over only prevents the browser
            default action. State changes only
            after dropping.
          </p>

          <code>
            onDragOver → no state change
            <br />
            onDrop → setEvents() → re-render
          </code>
        </div>

      </section>

    </main>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);