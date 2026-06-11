// Date picker default setup form shadcnui
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Calendar from "../dashboard/CalenderView"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useState, useEffect } from "react"
import { use } from "react"

export default function CalendarPopover({ date, setDate, single }) {

  useEffect(() => {
    if (date) {
      console.log("Selected date:", date);
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="bg-background active:bg-primaryLight text-foreground justify-start text-left font-normal data-[empty=true]:text-muted-foreground hover:bg-primaryLight"
        >
          {date?.from && date?.to ? (
            `${format(date.from, "PPP")} - ${format(date.to, "PPP")}`
          ) : (
            <span className="text-muted">Pick a follow-up date</span>
          )}

          {date && single ? (
            <span>{format(date, "PPP")}</span>
          ) : null}

        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="z-[9999] bg-background w-auto p-0">
          <Calendar
            mode={single ? "single" : "range"}
            selected={date}
            setSelected={setDate}
            captionLayout="dropdown"
          />        
      </PopoverContent>
    </Popover>
  )
}

