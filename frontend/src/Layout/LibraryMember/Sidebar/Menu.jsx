export const MENUITEMS = [
  {
    menutitle: "General",
    menucontent: "Dashboard",
    Items: [
      { path: `${process.env.PUBLIC_URL}/library/member/dashboard`, icon: "home", title: "Dashboard", type: "link" },
    ],
  },

  {
    menutitle: "Facilities",
    menucontent:"Management",
    Items: [
      { path: `${process.env.PUBLIC_URL}/library/member/books`, icon: "books", title: "Books", type: "link" },
      { path: `${process.env.PUBLIC_URL}/library/member/issues-returns`, icon: "form", title: "Issues-Returns", type: "link" },
      { path: `${process.env.PUBLIC_URL}/library/member/departments`, icon: "department", title: "Departments", type: "link" },
      { path: `${process.env.PUBLIC_URL}/library/member/notices`, icon: "notice", title: "Notices", type: "link" },
      { path: `${process.env.PUBLIC_URL}/library/member/calendar`, icon: "calendar", title: "Calendar", type: "link" },
      { path: `${process.env.PUBLIC_URL}/library/member/profile`, icon: "profile", title: "Profile", type: "link" },
    ]
  },
];
