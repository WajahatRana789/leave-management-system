import * as React from "react"
import { format, startOfYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: string // "yyyy-MM-dd"
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
          {value ? format(new Date(value), "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            if (date) {
              onChange(format(date, "yyyy-MM-dd")) 
              setOpen(false)
            }
          }}
          disabled={(date) => date < minDate}
        />
      </PopoverContent>
    </Popover>
  )
}