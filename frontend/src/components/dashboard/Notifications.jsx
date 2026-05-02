import { Bell, Notebook } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { DropdownNoteFilter } from "../partials/Dropdown";
import NoteForm from "../forms/NoteForm";
import { set } from "zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent
} from "@/components/ui/dialog";

function Notifications({className, userNotes, userReferrals, globalNotes, globalReferrals, SetSuccess, SetLoading, SetNewFetch, authRouter, authRouterForm}) {
  const [toggle, setToggle] = useState("reminders");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [viewedNotes, setViewedNotes] = useState({notes: userNotes, filterMsg: "Personal Notes"});
  const navigate = useNavigate();

  const toggleItem = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleNoteToggle = async () => {
    setToggle("notes");
    if (toggle === "notes") {
      await authRouter.post('/dashboard/notes/mark-read');
    }
  };

  const handleComplete = async (item) => {
    try {
      if (item.type === "note") {
        await authRouter.post(`/dashboard/notes/${item.rawId}/complete`);
      } else {
        await authRouter.post(`/dashboard/referrals/${item.rawId}/complete`);
      }
      SetSuccess(true);
      SetLoading(true);
      SetNewFetch(true);
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  const now = new Date();
  const timeline = [];

  userReferrals?.forEach((ref) => {
    if (!ref.followUpDate) return;

    timeline.push({
      id: `ref-${ref.id}`,
      rawId: ref.id,
      type: "resource",
      label: ref.organizationName,
      purpose: ref.purpose,
      date: new Date(ref.followUpDate),
      isPriority: ref.isPriority || false,
      client: ref.client,
    });
  });

  userNotes?.forEach((note) => {
    if (!note.setReminder || !note.reminderAt) return;

    timeline.push({
      id: `note-${note.id}`,
      rawId: note.id,
      type: "note",
      label: note.content,
      date: new Date(note.reminderAt),
      isPriority: false,
      client: note.client,
    });
  });

  const groups = {
    overdueToday: [],
    overdueRecent: [], // 1–3 days ago
    overdueWeek: [],   // this week
    today: [],
    soon: [],          // 1–3 days
    week: [],
    future: [],
    priority: [],
  };

  // mapping to group items based on date and priority
  timeline.forEach((item) => {
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((itemDate - today) / (1000 * 60 * 60 * 24));

    if (item.isPriority) {
      groups.priority.push(item);
      return;
    }

    // OVERDUE
    if (diffDays < 0) {
      if (diffDays === -1) groups.overdueToday.push(item);
      else if (diffDays >= -3) groups.overdueRecent.push(item);
      else if (diffDays >= -7) groups.overdueWeek.push(item);
      else groups.overdueWeek.push(item);
      return;
    }

    // TODAY
    if (diffDays === 0) {
      groups.today.push(item);
      return;
    }

    // SOON
    if (diffDays <= 3) {
      groups.soon.push(item);
      return;
    }

    // THIS WEEK
    if (diffDays <= 7) {
      groups.week.push(item);
      return;
    }

    // FUTURE
    groups.future.push(item);
  });

  const renderItem = (item) => {
    const isExpanded = expandedId === item.id;

    return (
      <li
        key={item.id}
        onClick={() => toggleItem(item.id)}
        className="border-b border-gray-200 py-2 cursor-pointer hover:bg-gray-50 transition"
      >
        <div className="flex justify-between items-center">
          <span className="font-medium">
            {item.type === "resource" ? "🏠 " : "📝 "}
            {item.type === "note" && item.client
              ? `Note for ${item.client.firstName} ${item.client.lastName}`
              : item.label}
          </span>

          <div>
            <span className="text-sm text-muted">
              {item.date.toLocaleDateString()}
            </span>
            <span className="text-muted text-xs ml-2">
              {isExpanded ? "▲" : "▼"}
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-2 text-xs text-muted-foreground space-y-2">
            <div>
              {item.type === "note" ? item.label : item.purpose}
            </div>

            <div className="flex gap-2">
              {item.client && (
                <button
                  className="relative group px-2 py-1 bg-green-100 text-black rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    SetLoading(true);
                    navigate(`/dashboard/clients/${item.client.id}`);
                  }}
                >
                  {item.client.firstName}
                  <span className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap 
                    bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 
                    group-hover:opacity-100 transition pointer-events-none">
                    Go to Profile
                  </span>
                </button>
              )}

              <button
                className="px-2 py-1 bg-blue-500 text-white rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete(item);
                }}
              >
                Complete
              </button>
            </div>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className={className}>
      <div className="flex-1 p-4">

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-semibold mb-2">
            {toggle === "reminders" ? "Reminders" : "Notes"}
          </h3>
          { toggle === "notes" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  Create Note
                </Button>
              </DialogTrigger>

              <DialogContent>
                <NoteForm
                  authRouter={authRouter}
                  SetSuccess={SetSuccess}
                  SetLoading={SetLoading}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex flex-1 justify-center">
            <Button onClick={() => setToggle("reminders")} variant="outline"
              className={`flex flex-1 border-2 border-border ${toggle === "reminders" ? "border-primary" : ""}`}>
              <Bell className={`mr-1 w-4 h-4 ${toggle === "reminders" ? "fill-yellow-400" : "text-muted opacity-60"}`} />
              Reminders
            </Button>
          </div>

          <div className="flex flex-1 justify-center">
            <Button onClick={handleNoteToggle} variant="outline"
              className={`flex flex-1 border-2 border-border ${toggle === "notes" ? "border-primary" : ""}`}>
              <Notebook className={`mr-1 w-4 h-4 ${toggle === "notes" ? "fill-primary" : "text-muted opacity-60"}`} />
              Notes
            </Button>
          </div>
        </div>
        { toggle === "notes" && (
          <div className="text-sm text-muted-foreground italic mb-2">
            <DropdownNoteFilter  setViewedNotes={setViewedNotes} noteMsg={viewedNotes.filterMsg} userNotes={userNotes} globalNotes={globalNotes} />
          </div>

        )}
        { toggle === "notes" && (
          <div className="text-sm font-medium text-left text-foreground italic mb-2">
            {viewedNotes.filterMsg}
          </div>
        )}
        <ul className="mt-2 text-sm text-muted-foreground text-left">
          {toggle === "reminders" ? (
            <>
              {groups.overdueToday.length > 0 && (
                <>
                  <p className="text-red-500 font-medium mt-2">Overdue (Yesterday)</p>
                  {groups.overdueToday.map(renderItem)}
                </>
              )}

              {groups.overdueRecent.length > 0 && (
                <>
                  <p className="text-red-500 font-medium mt-2">Overdue (Last 3 Days)</p>
                  {groups.overdueRecent.map(renderItem)}
                </>
              )}

              {groups.today.length > 0 && (
                <>
                  <p className="text-yellow-500 font-medium mt-2">Due Today</p>
                  {groups.today.map(renderItem)}
                </>
              )}

              {groups.soon.length > 0 && (
                <>
                  <p className="text-yellow-500 font-medium mt-2">Due Soon</p>
                  {groups.soon.map(renderItem)}
                </>
              )}

              {groups.week.length > 0 && (
                <>
                  <p className="text-blue-500 font-medium mt-2">This Week</p>
                  {groups.week.map(renderItem)}
                </>
              )}

              {groups.future.length > 0 && (
                <>
                  <p className="text-gray-500 font-medium mt-2">Upcoming</p>
                  {groups.future.map(renderItem)}
                </>
              )}
            </>
          ) : (
            viewedNotes?.notes.map((note) => {
              const id = `note-${note.id}`;
              const isExpanded = expandedId === id;

              return (
                <li
                  key={note.id}
                  onClick={() =>
                    setExpandedId(prev => prev === id ? null : id)
                  }
                  className="border-b border-gray-200 py-2 cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {note.client
                        ? `📝 Note for ${note.client.firstName} ${note.client.lastName}`
                        : "📝 General Note"}
                    </span>

                    <span className="text-xs text-muted">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="mt-2 text-xs text-muted-foreground space-y-2">
                      <div>{note.content}</div>

                      <div className="flex gap-2">
                        {note.client && (
                          <button
                            className="relative group px-2 py-1 bg-green-100 text-black rounded-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              SetLoading(true);
                              navigate(`/dashboard/clients/${note.client.id}`);
                            }}
                          >
                            {note.client.firstName}
                            <span className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap 
                              bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 
                              group-hover:opacity-100 transition pointer-events-none">
                              Go to Profile
                            </span>
                          </button>
                        )}

                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComplete({
                              type: "note",
                              rawId: note.id
                            });
                          }}
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default Notifications;