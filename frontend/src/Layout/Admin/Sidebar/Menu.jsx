export const MENUITEMS = [
  {
    menutitle: "General",
    menucontent: "Dashboard",
    Items: [
      { path: `${process.env.PUBLIC_URL}/admin/dashboard`, icon: "home", title: "Dashboard", type: "link" },
    ],
  },

  {
    menutitle: "Facilities",
    menucontent:"Management",
    Items: [
      { path: `${process.env.PUBLIC_URL}/admin/students`, icon: "academic", title: "Students", type: "link" },
      { path: `${process.env.PUBLIC_URL}/admin/faculties`, icon: "teacher", title: "Faculties", type: "link" },
      { path: `${process.env.PUBLIC_URL}/admin/staffs`, icon: "staff", title: "Staffs", type: "link" },
      { path: `${process.env.PUBLIC_URL}/admin/departments`, icon: "department", title: "Departments", type: "link" },
      { path: `${process.env.PUBLIC_URL}/admin/subjects`, icon: "subject", title: "Subjects", type: "link" },
      { path: `${process.env.PUBLIC_URL}/admin/material`, icon: "material", type: "link", title: "Material" },
      { path: `${process.env.PUBLIC_URL}/admin/notices`, icon: "notice", title: "Notices", type: "link" },
      { path: `${process.env.PUBLIC_URL}/admin/timetable`, icon: "timetable", type: "link", title: "Timetable" },
      { path: `${process.env.PUBLIC_URL}/admin/enquiries`, icon: "enquiry", title: "Enquiries", type: "link" },
      { path: `${process.env.PUBLIC_URL}/admin/report`, icon: "report", title: "Report", type: "link" },
      { path: `${process.env.PUBLIC_URL}/admin/calendar`, icon: "calendar", title: "Calendar", type: "link" },
      { path: `${process.env.PUBLIC_URL}/admin/profile`, icon: "profile", title: "Profile", type: "link" },
    ]
  },

  {
    menutitle: "User Management",
    menucontent: "User Management",
    Items: [
      { path: `${process.env.PUBLIC_URL}/admin/credentials-manager`, icon: "credential", title: "Credentials-Manager", type: "link" },
      { path: `${process.env.PUBLIC_URL}/admin/activated-users`, icon: "activeusers", title: "Activated-Users", type: "link" },
    ]
  },

  {
    menutitle: "Front-End Web Settings",
    menucontent: "Front-end Web",
    Items: [
      {
        title: "Home Page",
        icon: "homepage",
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/admin/frontend/home/bannershome`, type: "link", title: "BannersHOME" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/home/abouthome`, type: "link", title: "AboutHOME" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/home/achievementshome`, type: "link", title: "AchievementsHOME" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/home/courseshome`, type: "link", title: "CoursesHOME" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/home/testimonialshome`, type: "link", title: "TestimonialsHOME" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/home/eventshome`, type: "link", title: "EventsHOME" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/home/footerhome`, type: "link", title: "FooterHOME" },
        ],
      },
      {
        title: "CSE Home Page",
        icon: "cse",
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeCSE/bannerscse`, type: "link", title: "BannersCSE" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeCSE/aboutcse`, type: "link", title: "AboutCSE" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeCSE/faqscse`, type: "link", title: "FAQsCSE" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeCSE/gallerycse`, type: "link", title: "GalleryCSE" },
        ],
      },
      {
        title: "ECE Home Page",
        icon: "ece",
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeECE/bannersece`, type: "link", title: "BannersECE" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeECE/aboutece`, type: "link", title: "AboutECE" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeECE/faqsece`, type: "link", title: "FAQsECE" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeECE/galleryece`, type: "link", title: "GalleryECE" },
        ],
      },
      {
        title: "EEE Home Page",
        icon: "eee",
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeEEE/bannerseee`, type: "link", title: "BannersEEE" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeEEE/abouteee`, type: "link", title: "AboutEEE" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeEEE/faqseee`, type: "link", title: "FAQsEEE" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeEEE/galleryeee`, type: "link", title: "GalleryEEE" },
        ],
      },
      {
        title: "CE Home Page",
        icon: "ce",
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeCE/bannersce`, type: "link", title: "BannersCE" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeCE/aboutce`, type: "link", title: "AboutCE" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeCE/faqsce`, type: "link", title: "FAQsCE" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeCE/galleryce`, type: "link", title: "GalleryCE" },
        ],
      },
      {
        title: "ME Home Page",
        icon: "mechanical",
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeME/bannersme`, type: "link", title: "BannersME" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeME/aboutme`, type: "link", title: "AboutME" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeME/faqsme`, type: "link", title: "FAQsME" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeME/galleryme`, type: "link", title: "GalleryME" },
        ],
      },
      {
        title: "MBA Home Page",
        icon: "business",
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeMBA/bannersmba`, type: "link", title: "BannersMBA" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeMBA/aboutmba`, type: "link", title: "AboutMBA" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeMBA/faqsmba`, type: "link", title: "FAQsMBA" },
          { path: `${process.env.PUBLIC_URL}/admin/frontend/homeMBA/gallerymba`, type: "link", title: "GalleryMBA" },
        ],
      },
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
