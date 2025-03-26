"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Appointment {
  id: string
  patientName: string
  email: string
  phone: string
  date: string
  time: string
  reason: string
  notes?: string
}

interface AppointmentContextType {
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
  updateAppointment: (appointment: Appointment) => void
  deleteAppointment: (id: string) => void
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined)

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  // Load appointments from localStorage on initial render
  useEffect(() => {
    const savedAppointments = localStorage.getItem("appointments")
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    }
  }, [])

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments))
  }, [appointments])

  const addAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [...prev, appointment])
  }

  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments((prev) =>
      prev.map((appointment) => (appointment.id === updatedAppointment.id ? updatedAppointment : appointment)),
    )
  }

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((appointment) => appointment.id !== id))
  }

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  )
}

export function useAppointment() {
  const context = useContext(AppointmentContext)
  if (context === undefined) {
    throw new Error("useAppointment must be used within an AppointmentProvider")
  }
  return context
}

