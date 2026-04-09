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
      <DayPicker className="p-4" 
      animate
      mode="single"
      selected={selected}
      onSelect={onSelect}

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
      size="default"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-[var(--cell-size)] flex-col gap-1 border-0 leading-none font-normal",
        "data-[range-end=true]:rounded-[var(--cell-radius)]",
        "data-[range-end=true]:rounded-r-[var(--cell-radius)]",
        "data-[range-start=true]:rounded-[var(--cell-radius)]",
        "data-[range-start=true]:rounded-l-[var(--cell-radius)]",
        defaultClassNames.day,
        className
      )}
      {...props} />
  );
}

export { Calendar, CalendarDayButton }
