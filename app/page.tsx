import AppointmentCalendar from "@/components/appointment-calendar"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Doctor Appointment Booking System</h1>
        <AppointmentCalendar />
      </div>
    </main>
  )
}

