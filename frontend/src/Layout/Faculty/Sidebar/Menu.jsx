export const MENUITEMS = [
  {
    menutitle: "General",
    menucontent: "Dashboard",
    Items: [
      { path: `${process.env.PUBLIC_URL}/faculty/dashboard`, icon: "home", title: "Dashboard", type: "link" },
    ],
  },
  {
    menutitle: "Facilities",
    menucontent: "Management",
    active: true,
    Items: [
      { path: `${process.env.PUBLIC_URL}/faculty/enrolled-students`, icon: "search", title: "Enrolled-Students", type: "link" },
      { path: `${process.env.PUBLIC_URL}/faculty/studentattendance`, icon: "attendance", title: "Attendance", type: "link" },
      { path: `${process.env.PUBLIC_URL}/faculty/timetable`, icon: "timetable", type: "link", title: "Timetable" },
      { path: `${process.env.PUBLIC_URL}/faculty/notice`, icon: "notice", type: "link", title: "Notice" },
      { path: `${process.env.PUBLIC_URL}/faculty/material`, icon: "material", type: "link", title: "Material" },
      { path: `${process.env.PUBLIC_URL}/faculty/eventcalendar`, icon: "calendar", title: "Calendar", type: "link" },
      { path: `${process.env.PUBLIC_URL}/faculty/profile`, icon: "profile", title: "Profile", type: "link" },
    ],
  },
];
