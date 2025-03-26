"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { useAppointment } from "@/context/appointment-context"
import AppointmentModal from "./appointment-modal"
import AppointmentDetailsModal from "./appointment-details-modal"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ThemeToggle from "./theme-toggle"

export default function AppointmentCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const { appointments } = useAppointment()

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const handleDateClick = (day: Date) => {
    setSelectedDate(day)
    setIsModalOpen(true)
    setIsEditMode(false)
  }

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsDetailsModalOpen(true)
  }

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setSelectedDate(new Date(appointment.date))
    setIsEditMode(true)
    setIsDetailsModalOpen(false)
    setIsModalOpen(true)
  }

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((appointment) => isSameDay(new Date(appointment.date), day))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-medium py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayAppointments = getAppointmentsForDay(day)
            return (
              <div
                key={day.toString()}
                className={`min-h-[100px] p-2 border rounded-md ${
                  isSameMonth(day, currentMonth) ? "bg-card" : "bg-muted text-muted-foreground"
                } cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground`}
                onClick={() => handleDateClick(day)}
              >
                <div className="text-right mb-1">{format(day, "d")}</div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((appointment) => (
                    <Badge
                      key={appointment.id}
                      className="w-full justify-start text-xs py-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAppointmentClick(appointment)
                      }}
                    >
                      {appointment.time} - {appointment.patientName.split(" ")[0]}
                    </Badge>
                  ))}
                  {dayAppointments.length > 2 && (
                    <Badge variant="outline" className="w-full justify-center text-xs">
                      +{dayAppointments.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {isModalOpen && selectedDate && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          appointment={isEditMode ? selectedAppointment : null}
          isEditMode={isEditMode}
        />
      )}

      {isDetailsModalOpen && selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          appointment={selectedAppointment}
          onEdit={handleEditAppointment}
        />
      )}
    </div>
  )
}

