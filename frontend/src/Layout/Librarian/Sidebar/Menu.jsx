export const MENUITEMS = [
  {
    menutitle: "General",
    menucontent: "Dashboard",
    Items: [
      { path: `${process.env.PUBLIC_URL}/library/dashboard`, icon: "home", title: "Dashboard", type: "link" },
    ],
  },

  {
    menutitle: "Facilities",
    menucontent:"Management",
    Items: [
      { path: `${process.env.PUBLIC_URL}/library/books`, icon: "books", title: "Books", type: "link" },
      { path: `${process.env.PUBLIC_URL}/library/issues`, icon: "issue", title: "Issues", type: "link" },
      { path: `${process.env.PUBLIC_URL}/library/returns`, icon: "return", title: "Returns", type: "link" },
      { path: `${process.env.PUBLIC_URL}/library/departments`, icon: "department", title: "Departments", type: "link" },
      { path: `${process.env.PUBLIC_URL}/library/notices`, icon: "notice", title: "Notices", type: "link" },
      { path: `${process.env.PUBLIC_URL}/library/calendar`, icon: "calendar", title: "Calendar", type: "link" },
      { path: `${process.env.PUBLIC_URL}/library/profile`, icon: "profile", title: "Profile", type: "link" },
    ]
  },
  {
    menutitle: "Members",
    menucontent:"Management",
    Items: [
      { path: `${process.env.PUBLIC_URL}/library/members/students`, icon: "academic", title: "Students", type: "link" },
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
