export const MENUITEMS = [
  {
    menutitle: "General",
    menucontent: "Dashboard",
    Items: [
      { path: `${process.env.PUBLIC_URL}/student/dashboard`, icon: "home", title: "Dashboard", type: "link" },
    ],
  },

  {
    menutitle: "Facilities",
    menucontent:"Management",
    Items: [
      { path: `${process.env.PUBLIC_URL}/student/attendance`, icon: "attendance", title: "Attendance", type: "link" },
      { path: `${process.env.PUBLIC_URL}/student/analytics`, icon: "analytics", title: "Analytics", type: "link" },
      { path: `${process.env.PUBLIC_URL}/student/subjects`, icon: "subject", title: "Subjects", type: "link" },
      { path: `${process.env.PUBLIC_URL}/student/viewnotice`, icon: "notice", title: "Notice", type: "link" },
      { path: `${process.env.PUBLIC_URL}/student/viewmaterial`, icon: "material", title: "Material", type: "link" },
      { path: `${process.env.PUBLIC_URL}/student/viewtimetable`, icon: "timetable", title: "Timetable", type: "link" },
      { path: `${process.env.PUBLIC_URL}/student/eventcalendar`, icon: "calendar", title: "Calendar", type: "link" },
      { path: `${process.env.PUBLIC_URL}/student/profile`, icon: "profile", title: "Profile", type: "link" },
    ]
  },
];
