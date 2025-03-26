"use client"

import { format } from "date-fns"
import { useAppointment } from "@/context/appointment-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface AppointmentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: any
  onEdit: (appointment: any) => void
}

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onEdit,
}: AppointmentDetailsModalProps) {
  const { deleteAppointment } = useAppointment()
  const { toast } = useToast()

  const handleDelete = () => {
    deleteAppointment(appointment.id)
    toast({
      title: "Appointment Deleted",
      description: "The appointment has been successfully deleted.",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p>{format(new Date(appointment.date), "EEEE, MMMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Time</p>
              <p>{appointment.time}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Patient Name</p>
            <p>{appointment.patientName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{appointment.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{appointment.phone}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Reason for Visit</p>
            <p>{appointment.reason}</p>
          </div>

          {appointment.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
              <p>{appointment.notes}</p>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="destructive" onClick={handleDelete}>
              Delete Appointment
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => onEdit(appointment)}>Edit Appointment</Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

