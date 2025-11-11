# Attendance Feature Implementation TODO

## Backend Tasks
- [x] Create attendanceModel.js with schema for workerId, fullname, position, shift, startTime, endTime, location, date
- [x] Add signIn function to workerController.js (handle sign-in with location capture, shift validation)
- [x] Add signOut function to workerController.js (handle sign-out, update endTime)
- [x] Add getAttendance function to workerController.js (for admin to view attendance records)
- [x] Update workerRoute.js to include attendance routes (/signin, /signout, /get-attendance)

## Frontend Tasks
- [ ] Update WorkerDashboard.jsx to include attendance form (fullname, position, start/end time display, sign-in/sign-out buttons)
- [ ] Implement shift logic in WorkerDashboard.jsx (morning: 7am-6pm, night: 6pm-7am)
- [ ] Add geolocation capture in WorkerDashboard.jsx for location during sign-in/sign-out
- [ ] Add logic to enable/disable sign-in/sign-out based on current time and shift

## Testing and Verification
- [ ] Test sign-in/sign-out logic for both shifts
- [ ] Verify location capture and storage
- [ ] Ensure admin can monitor attendance with location data
