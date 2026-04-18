// Date picker default setup form shadcnui
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useState } from "react"

export default function CalendarPopover({ date, setDate }) {
   // const [date, setDate] = React.useState<Date | undefined>(new Date())


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="bg-foreground justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            captionLayout="dropdown"
          />        
      </PopoverContent>
    </Popover>
  )
}


export function CalendarEmbedded({ date, setDate, className }) {
  return (
    <div className={cn("bg-white rounded-lg border p-3 shadow-md", className)}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        className="w-full border-0 bg-color-white p-0 text-color-foreground shadow-none"
      />
    </div>
  )
}