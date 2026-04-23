import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker";


// cn is a utility function for conditionally joining classNames together, allowing for dynamic styling based on props or state. It is used throughout the Calendar component to apply default styles and allow for custom classNames to be passed in via props.
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  selected,
  onSelect,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      classNames={{
        ...defaultClassNames,
        day_today: "border border-amber-500",
        day_selected: "bg-secondary text-white",
        day: "bg-gray-100", 
      }}
      animate
      mode={props.mode || "single"}
      selected={selected}
      onSelect={onSelect}
      components={{
        DayButton: CalendarDayButton
      }}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="default"
      size="sm"
      data-day={day.date.toLocaleDateString(locale?.code)}
      className={cn(
        // base styles for all day buttons
        "relative p-md isolate z-10 flex aspect-square w-full min-w-[var(--cell-size)] items-center justify-center text-sm",

        // default styles for the day button upon hover and focus
        "bg-gray-100 text-gray-900",

        modifiers.today && "border border-amber-500",

        modifiers.selected && "bg-blue-600 text-white",

        !modifiers.selected && "hover:bg-gray-200",

        className
      )}
      {...props}
    />
      
  );
}

export { Calendar, CalendarDayButton }
