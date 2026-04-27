export interface ClassSchedule {
  id: string
  roomId: string
  subjectName: string
  subjectCode: string
  facultyName: string
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"
  startTime: string
  endTime: string
  section: string
}
