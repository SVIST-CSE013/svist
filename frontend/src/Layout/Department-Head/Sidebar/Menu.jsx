export const MENUITEMS = [
  {
    menutitle: "General",
    menucontent: "Dashboard",
    Items: [
      { path: `${process.env.PUBLIC_URL}/department/dashboard`, icon: "home", title: "Dashboard", type: "link" },
    ],
  },
  {
    menutitle: "Facilities",
    menucontent: "Management",
    active: true,
    Items: [
      { path: `${process.env.PUBLIC_URL}/department/studentdetails`, icon: "search", title: "StudentDetails", type: "link" },
      { path: `${process.env.PUBLIC_URL}/department/faculties`, icon: "teacher", title: "Faculties", type: "link" },
      { path: `${process.env.PUBLIC_URL}/department/subjects`, icon: "subject", title: "Subjects", type: "link" },
      { path: `${process.env.PUBLIC_URL}/department/studentattendance`, icon: "attendance", title: "Attendance", type: "link" },
      { path: `${process.env.PUBLIC_URL}/department/studentreport`, icon: "report", title: "Report", type: "link" },
      { path: `${process.env.PUBLIC_URL}/department/timetable`, icon: "timetable", type: "link", title: "Timetable" },
      { path: `${process.env.PUBLIC_URL}/department/notice`, icon: "notice", type: "link", title: "Notice" },
      { path: `${process.env.PUBLIC_URL}/department/material`, icon: "material", type: "link", title: "Material" },
      { path: `${process.env.PUBLIC_URL}/department/eventcalendar`, icon: "calendar", title: "Calendar", type: "link" },
      { path: `${process.env.PUBLIC_URL}/department/profile`, icon: "profile", title: "Profile", type: "link" },
    ],
  },
  {
    menutitle: "User Management",
    menucontent: "User Management",
    Items: [
      { path: `${process.env.PUBLIC_URL}/department/credentials-manager`, icon: "credential", title: "Credentials-Manager", type: "link" },
      { path: `${process.env.PUBLIC_URL}/department/activated-users`, icon: "activeusers", title: "Activated-Users", type: "link" },
    ]
  },
  {
    menutitle: "Menu End",
    menucontent: "Menu End",
    Items: []
  },
  {
    menutitle: "Menu End",
    menucontent: "Menu End",
    Items: []
  },
];
