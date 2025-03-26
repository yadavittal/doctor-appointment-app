"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useAppointment } from "@/context/appointment-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  appointment: any | null
  isEditMode: boolean
}

export default function AppointmentModal({
  isOpen,
  onClose,
  selectedDate,
  appointment,
  isEditMode,
}: AppointmentModalProps) {
  const { addAppointment, updateAppointment } = useAppointment()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phone: "",
    time: "09:00",
    reason: "",
    notes: "",
  })

  useEffect(() => {
    if (isEditMode && appointment) {
      setFormData({
        patientName: appointment.patientName,
        email: appointment.email,
        phone: appointment.phone,
        time: appointment.time,
        reason: appointment.reason,
        notes: appointment.notes || "",
      })
    }
  }, [isEditMode, appointment])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTimeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, time: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.patientName || !formData.email || !formData.phone || !formData.time || !formData.reason) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    const appointmentData = {
      ...formData,
      date: selectedDate.toISOString(),
      id: isEditMode ? appointment.id : Date.now().toString(),
    }

    if (isEditMode) {
      updateAppointment(appointmentData)
      toast({
        title: "Appointment Updated",
        description: `Appointment for ${formData.patientName} has been updated successfully.`,
      })
    } else {
      addAppointment(appointmentData)
      toast({
        title: "Appointment Booked",
        description: `Appointment for ${formData.patientName} has been booked successfully.`,
      })
    }

    onClose()
  }

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Appointment" : "Book an Appointment"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" value={format(selectedDate, "EEEE, MMMM d, yyyy")} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select value={formData.time} onValueChange={handleTimeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientName">Full Name</Label>
            <Input
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(123) 456-7890"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Input
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Consultation, Check-up, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditMode ? "Update Appointment" : "Book Appointment"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

