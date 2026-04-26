import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

// https://daypicker.dev/docs/appearance //

export default function Calendar({ selected, setSelected }) {
  return (
    <DayPicker
      mode="range"
      selected={selected}
      onSelect={setSelected}
      navLayout="around"
      className="w-full h-full flex align-center justify-center bg-white p-4 rounded-xl shadow-md border"

      classNames={{
        months: "flex flex-col gap-1",
        month: "space-y-1",
        caption: "flex justify-between items-center px-2",
        caption_label: "text-sm font-semibold",
        nav: "gap-1",
        nav_button: "p-1 hover:bg-gray-200 rounded-md",
      
        table: "border-collapse",
        head_row: "flex",
        head_cell: "text-xs text-muted-foreground w-9 text-center",

        row: "flex w-full mt-2",
        cell: "w-9 h-9 text-center text-sm p-0 relative",

        day: "w-9 h-9 rounded-md hover:bg-gray-200 transition",
        day_selected: "bg-blue-600 text-white",
        day_today: "border border-amber-500",
        day_outside: "text-gray-300",
      }}
    />
  );
}