import * as React from "react"
import { startOfYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { STORAGE_FORMAT, formatStorage, formatDisplay } from "@/lib/date"

interface DatePickerProps {
  value?: string // stored as "yyyy-MM-dd" (Laravel friendly)
  onChange: (date: string) => void
  placeholder?: string
  required?: boolean
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", required }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const minDate = startOfYear(new Date()) // Jan 1st of current year

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDisplay(value) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            if (date) {
              // Store in Laravel-friendly format
              onChange(formatStorage(date))
              setOpen(false)
            }
          }}
          disabled={(date) => date < minDate}
        />
      </PopoverContent>
    </Popover>
  )
}
