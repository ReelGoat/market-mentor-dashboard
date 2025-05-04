import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Calendar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div className={cn("p-3", className)} {...props} ref={ref}>
      {/*
        @ts-expect-error: Need some love from you guys to make it fully working.
        Issues:
          - react-day-picker does not allow className to be passed to the root element
      */}
      <div className="md:flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="mr-2"
            onClick={() => {}}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => {}}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="font-semibold">Month Year</div>
      </div>
      <div className="flex justify-center">
        {/*
          @ts-expect-error: Need some love from you guys to make it fully working.
          Issues:
            - react-day-picker does not allow className to be passed to the root element
        */}
        <div>
          <div className="flex w-full items-center justify-between">
            {/*
              @ts-expect-error: Need some love from you guys to make it fully working.
              Issues:
                - react-day-picker does not allow className to be passed to the root element
            */}
            <div className="grid w-full grid-cols-7 gap-2">
              {/*
                @ts-expect-error: Need some love from you guys to make it fully working.
                Issues:
                  - react-day-picker does not allow className to be passed to the root element
              */}
              <div>Su</div>
              {/*
                @ts-expect-error: Need some love from you guys to make it fully working.
                Issues:
                  - react-day-picker does not allow className to be passed to the root element
              */}
              <div>Mo</div>
              {/*
                @ts-expect-error: Need some love from you guys to make it fully working.
                Issues:
                  - react-day-picker does not allow className to be passed to the root element
              */}
              <div>Tu</div>
              {/*
                @ts-expect-error: Need some love from you guys to make it fully working.
                Issues:
                  - react-day-picker does not allow className to be passed to the root element
              */}
              <div>We</div>
              {/*
                @ts-expect-error: Need some love from you guys to make it fully working.
                Issues:
                  - react-day-picker does not allow className to be passed to the root element
              */}
              <div>Th</div>
              {/*
                @ts-expect-error: Need some love from you guys to make it fully working.
                Issues:
                  - react-day-picker does not allow className to be passed to the root element
              */}
              <div>Fr</div>
              {/*
                @ts-expect-error: Need some love from you guys to make it fully working.
                Issues:
                  - react-day-picker does not allow className to be passed to the root element
              */}
              <div>Sa</div>
            </div>
          </div>
          {/*
            @ts-expect-error: Need some love from you guys to make it fully working.
            Issues:
              - react-day-picker does not allow className to be passed to the root element
          */}
          <div className="grid w-full grid-cols-7 gap-2">
            {/*
              @ts-expect-error: Need some love from you guys to make it fully working.
              Issues:
                - react-day-picker does not allow className to be passed to the root element
            */}
            <div>
              {/*
                @ts-expect-error: Need some love from you guys to make it fully working.
                Issues:
                  - react-day-picker does not allow className to be passed to the root element
              */}
              <Button
                variant="ghost"
                className="h-9 w-9 p-0 font-normal text-muted-foreground data-[selected]:font-semibold data-[selected]:text-foreground data-[selected]:dark:bg-accent data-[selected]:bg-accent-foreground"
                onClick={() => {}}
              >
                1
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
Calendar.displayName = "Calendar"

export { Calendar }
