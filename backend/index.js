import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import LoginModel from './models/Login.js'
import BannerModel from "./models/Banner.js"
import AboutModel from "./models/About.js"
import CourseModel from './models/Course.js'
import TestimonialModel from './models/Testimonial.js'
import FooterModel from "./models/Footer.js"
import NoticeModel from './models/Notice.js'
import BannerCSEModel from './models/BannerCSE.js'
import BannerECEModel from './models/BannerECE.js'
import BannerEEEModel from './models/BannerEEE.js'
import BannerCEModel from './models/BannerCE.js'
import BannerMEModel from './models/BannerME.js'
import BannerMBAModel from './models/BannerMBA.js'
import AboutCSEModel from './models/AboutCSE.js'
import AboutECEModel from './models/AboutECE.js'
import AboutEEEModel from './models/AboutEEE.js'
import AboutCEModel from './models/AboutCE.js'
import AboutMEModel from './models/AboutME.js'
import AboutMBAModel from './models/AboutMBA.js'
import FaqCSEModel from "./models/FaqCSE.js"
import FaqECEModel from './models/FaqECE.js'
import FaqEEEModel from './models/FaqEEE.js'
import FaqCEModel from './models/FaqCE.js'
import FaqMEModel from './models/FaqME.js'
import FaqMBAModel from './models/FaqMBA.js'
import GalleryCSEModel from './models/GalleryCSE.js'
import GalleryECEModel from './models/GalleryECE.js'
import GalleryEEEModel from './models/GalleryEEE.js'
import GalleryCEModel from './models/GalleryCE.js'
import GalleryMEModel from './models/GalleryME.js'
import GalleryMBAModel from './models/GalleryMBA.js'
import DepartmentModel from './models/Department.js'
import StudentModel from './models/Student.js'
import FacultyModel from './models/Faculty.js'
import StaffModel from './models/Staff.js'
import SubjectModel from './models/Subject.js'
import AttendanceModel from './models/Attendance.js'
import TimetableModel from './models/Timetable.js'
import MaterialModel from './models/Material.js'
import EventModel from "./models/Event.js"
import ShowEventModel from './models/ShowEvent.js'
import EnquiryModel from './models/Enquiry.js'
import BookModel from './models/Book.js'
import IssueBookModel from './models/IssueBook.js'
import LibraryModel from './models/Library.js'
import session from 'express-session'
import { randomBytes } from 'crypto';
import helmet from 'helmet';
import bcrypt from 'bcrypt';
import MongoStore from 'connect-mongodb-session';
import compression from 'compression';
import apicache from 'apicache-plus';
import dotenv from 'dotenv';

dotenv.config();

const app = express()
app.use(express.json())

app.use(cors({
  origin: "https://final-year-destructive-mern-project.vercel.app",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

function generateRandomString(length) {
  return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

const SESSION_SECRET = generateRandomString(32);
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const MongoDBStore = MongoStore(session);

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
  ttl: 5 * 60 * 60,
  autoRemove: 'native',
});

store.on('error', function(error) {
  console.error('Session store connection error:', error);
});

app.set("trust proxy", 1);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    name: 'MernCollegeERP',
    cookie: {
      maxAge: 3600000,
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    },
  })
);

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
  },
}));

app.use(compression({
  level: 6,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

const authenticateMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ authenticated: false, message: "Unauthorized" });
  }
  next();
};

const onlyStatus200 = (req, res) => res.statusCode === 200;
const cacheMiddleWare = apicache('30 seconds', onlyStatus200);

await mongoose.connect(MONGODB_URI)
.then(() => {
    console.log("Database Connected Successfully.");
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.post('/register', async (req, res) => {
  const { name, email, userid, password, role, profile, department } = req.body;

  try {
    // Check if a user with the given email exists
    const existingUser = await LoginModel.findOne({ email });

    if (existingUser) {
      if (existingUser.userid !== userid) {
        // If the email exists but the username is different, create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await LoginModel.create({
          name,
          email,
          userid,
          password: hashedPassword,
          role,
          profile,
          department
        });

        res.json(newUser);
      } else {
        // If user exists and username matches, update password and role
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.role = role;
        await existingUser.save();

        res.status(200).json(existingUser);
      }
    } else {
      // If user doesn't exist, create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await LoginModel.create({
        name,
        email,
        userid,
        password: hashedPassword,
        role,
        profile,
        department
      });

      res.status(200).json(newUser);
    }
  } catch (err) {
    console.error('Error during registration or update:', err);
    res.status(500).json(err);
  }
});


app.post('/login', async (req, res) => {
  const { userid, password, requestedRole } = req.body;

  try {
    const user = await LoginModel.findOne({ userid });

    if (user) {

      if (user.role !== requestedRole) {
        res.status(403).json({ success: false, message: 'User Not Activated' });
        return;
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        req.session.user = {
          userid: user.userid,
          email: user.email,
          role: user.role,
          name: user.name,
          profile: user.profile,
          department: user.department
        };

        res.cookie('sessionID', req.sessionID, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 3600000,
        });

        res.status(200).json({ success: true, message: 'Authentication successful', email: user.email, role: user.role });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      res.status(404).json({ success: false, message: 'No User Found' });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get("/checkauthentication", authenticateMiddleware, async (req, res) => {
  try {
    res.status(200).json({ success: true, authenticated: true, user: req.session.user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/logout", (req, res) => {
  const sessionId = req.sessionID;

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.clearCookie("connect.sid"); 
      res.json({ message: "Logout successful" });

      if (sessionId) {
        req.sessionStore.destroy(sessionId, (destroyErr) => {
          if (destroyErr) {
            console.error("Error destroying session ID:", destroyErr);
          }
        });
      }
    }
  });
});


app.post('/changepassword/:user', async (req, res) => {
  const { newPassword } = req.body;
  const { user } = req.params;

  try {
    const existingUser = await LoginModel.findOne({ userid: user });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    existingUser.password = hashedPassword;
    await existingUser.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.post('/forgotpassword', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const existingUser = await LoginModel.findOne({ email: email });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    existingUser.password = hashedPassword;
    await existingUser.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.post('/deleteUser/:id', async (req, res) => {

  try {
      const deletedUser = await LoginModel.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'User deleted successfully' });

  } catch (error) {
      console.error('Error deleting User', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/adminRoutes', (req, res) => {
  const isAdmin = req.session && req.session.user && req.session.user.role === 'Admin';

  if (isAdmin) {
    res.status(200).json({ success: true, authenticated: true, message: 'Admin authorization successful' });
  } else if (req.session && req.session.user) {
    res.redirect('/403');
  } else {
    res.redirect('/adminlogin');
  }
});

app.get('/departmentRoutes', (req, res) => {
  const isDepartment = req.session && req.session.user && req.session.user.role === 'Department Admin';

  if (isDepartment) {
    res.status(200).json({ success: true, authenticated: true, message: 'Department Admin authorization successful' });
  } else if (req.session && req.session.user) {
    res.redirect('/403');
  } else {
    res.redirect('/departmentlogin');
  }
});

app.get('/facultyRoutes', (req, res) => {
  const isFaculty = req.session && req.session.user && req.session.user.role === 'Faculty';

  if (isFaculty) {
    res.status(200).json({ success: true, authenticated: true, message: 'Faculty authorization successful' });
  } else if (req.session && req.session.user) {
    res.redirect('/403');
  } else {
    res.redirect('/facultylogin');
  }
});

app.get('/studentRoutes', (req, res) => {
  const isStudent = req.session && req.session.user && req.session.user.role === 'Student';

  if (isStudent) {
    res.status(200).json({ success: true, authenticated: true, message: 'Student authorization successful' });
  } else if (req.session && req.session.user) {
    res.redirect('/403');
  } else {
    res.redirect('/studentlogin');
  }
});

app.get('/librarianRoutes', (req, res) => {
  const isLibrarian = req.session && req.session.user && req.session.user.role === 'Librarian';

  if (isLibrarian) {
    res.status(200).json({ success: true, authenticated: true, message: 'Librarian authorization successful' });
  } else if (req.session && req.session.user) {
    res.redirect('/403');
  } else {
    res.redirect('/librarianlogin');
  }
});

app.get('/libraryMemberRoutes', (req, res) => {
  const isLibraryMember = req.session && req.session.user && req.session.user.role === 'LibraryMember';

  if (isLibraryMember) {
    res.status(200).json({ success: true, authenticated: true, message: 'Library Member authorization successful' });
  } else if (req.session && req.session.user) {
    res.redirect('/403');
  } else {
    res.redirect('/libraryMemberlogin');
  }
});

app.get('/getAuthenticatedUsers', cacheMiddleWare, async(req, res) => {
  LoginModel.find()
  .then(users => res.json(users))
  .catch(err => res.json(err))
});

app.post("/getFilteredAuthenticatedUsers", async (req, res) => {
  const searchParams = req.body;
  try {
    let user = await LoginModel.find(searchParams);
    if (!user) {
      return res.status(400).json({ success: false, message: "No User Found" });
    }
    const data = {
      success: true,
      message: "User Details Found!",
      user,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


app.post("/addbannerdetails", async(req,res) => {
  try {
    const banner = await BannerModel.create(req.body);

    if (banner) {
      res.status(200).json({ success: true, message: 'Banner Created Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getbannerdetails', cacheMiddleWare, async(req, res) => {
  BannerModel.find()
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.get("/getSingleBannerDetails/:id", cacheMiddleWare, async (req, res) => {
  BannerModel.findById(req.params.id)
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.post("/editBannerDetails/:id", async(req,res) => {
  try{
    const existingBanner = await BannerModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingBanner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.status(200).json({ success: true, message: 'Banner Updated Successfully' });

  } catch (error) {
    console.error('Error updating Banner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteBannerdetails/:id', async (req, res) => {

  try {
      const deletedBanner = await BannerModel.findByIdAndDelete(req.params.id);

      if (!deletedBanner) {
          return res.status(404).json({ message: 'Banner not found' });
      }
      return res.status(200).json({ message: 'Banner deleted successfully' });

  } catch (error) {
      console.error('Error deleting Banner', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});


app.post("/addaboutdetails", async(req,res) => {
  try {
    const existingAbout = await AboutModel.findOne();

    if (existingAbout) {
      const updatedAbout = await AboutModel.findOneAndUpdate(
        {},
        { $set: req.body }, 
        { new: true }
      );

      res.status(200).json({ success: true, message: 'About Updated Successfully', data: updatedAbout });
    } else {
      const newAbout = await AboutModel.create(req.body);

      if (newAbout) {
        res.status(200).json({ success: true, message: 'About Created Successfully', data: newAbout });
      } else {
        res.status(401).json({ success: false, message: 'Process Failed' });
      }
    }
  } catch (error) {
    console.error('Error during creation or update', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
})

app.get('/getaboutdetails', cacheMiddleWare, async(req, res) => {
  AboutModel.find()
  .then(about => res.json(about))
  .catch(err => res.json(err))
});


app.post("/addcoursedetails", async(req,res) => {
  try {
    const course = await CourseModel.create(req.body);

    if (course) {
      res.status(200).json({ success: true, message: 'Course Created Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getcoursedetails', cacheMiddleWare, async(req, res) => {
  CourseModel.find()
  .then(course => res.json(course))
  .catch(err => res.json(err))
});

app.get("/getSingleCourseDetails/:id", cacheMiddleWare, async (req, res) => {
  CourseModel.findById(req.params.id)
  .then(courses => res.json(courses))
  .catch(err => res.json(err))
});

app.post("/editCourseDetails/:id", async(req,res) => {
  try{
    const existingCourse = await CourseModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ success: true, message: 'Course Updated Successfully' });

  } catch (error) {
    console.error('Error updating Course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteCoursedetails/:id', async (req, res) => {

  try {
      const deletedCourse = await CourseModel.findByIdAndDelete(req.params.id);

      if (!deletedCourse) {
          return res.status(404).json({ message: 'Course not found' });
      }
      return res.status(200).json({ message: 'Course deleted successfully' });

  } catch (error) {
      console.error('Error deleting Course', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});


app.post("/addtestimonialdetails", async(req,res) => {
  try {
    const testimonial = await TestimonialModel.create(req.body);

    if (testimonial) {
      res.status(200).json({ success: true, message: 'Testimonial Created Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/gettestimonialdetails', cacheMiddleWare, async(req, res) => {
  TestimonialModel.find()
  .then(testimonial => res.json(testimonial))
  .catch(err => res.json(err))
});

app.get("/getSingleTestimonialDetails/:id", cacheMiddleWare, async (req, res) => {
  TestimonialModel.findById(req.params.id)
  .then(testimonials => res.json(testimonials))
  .catch(err => res.json(err))
});

app.post("/editTestimonialDetails/:id", async(req,res) => {
  try{
    const existingTestimonial = await TestimonialModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.status(200).json({ success: true, message: 'Testimonial Updated Successfully' });

  } catch (error) {
    console.error('Error updating Testimonial:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteTestimonialdetails/:id', async (req, res) => {

  try {
      const deletedTestimonial = await TestimonialModel.findByIdAndDelete(req.params.id);

      if (!deletedTestimonial) {
          return res.status(404).json({ message: 'Testimonial not found' });
      }
      return res.status(200).json({ message: 'Testimonial deleted successfully' });

  } catch (error) {
      console.error('Error deleting Testimonial', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addfooterdetails", async (req, res) => {
  try {
    const existingFooter = await FooterModel.findOne();

    if (existingFooter) {
      const updatedFooter = await FooterModel.findOneAndUpdate(
        {},
        { $set: req.body }, 
        { new: true }
      );

      res.status(200).json({ success: true, message: 'Footer Updated Successfully', data: updatedFooter });
    } else {
      const newFooter = await FooterModel.create(req.body);

      if (newFooter) {
        res.status(200).json({ success: true, message: 'Footer Created Successfully', data: newFooter });
      } else {
        res.status(401).json({ success: false, message: 'Process Failed' });
      }
    }
  } catch (error) {
    console.error('Error during creation or update', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/getfooterdetails', cacheMiddleWare, async(req, res) => {
  FooterModel.find()
  .then(footer => res.json(footer))
  .catch(err => res.json(err))
});

app.post("/addnoticedetails", async(req,res) => {
  try {
    const notice = await NoticeModel.create(req.body);

    if (notice) {
      res.status(200).json({ success: true, message: 'Notice Published Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
});

app.get("/getSingleNoticeDetails/:id", cacheMiddleWare, async (req, res) => {
  NoticeModel.findById(req.params.id)
  .then(notices => res.json(notices))
  .catch(err => res.json(err))
});

app.get("/NoticeCount", cacheMiddleWare, async (req, res) => {
  try {
    const searchParams = req.query;
    let notices;

    if (Object.keys(searchParams).length === 0) {
      notices = await NoticeModel.countDocuments();
    } else {
      notices = await NoticeModel.countDocuments(searchParams);
    }

    const data = {
      success: true,
      message: "Count Successful!",
      notices,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


app.post("/editnoticedetails/:id", async(req,res) => {
  try{
    const existingNotice = await NoticeModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingNotice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.status(200).json({ success: true, message: 'Notice Updated Successfully' });

  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deletenoticedetails/:id', async (req, res) => {

  try {
      const deletedNotice = await NoticeModel.findByIdAndDelete(req.params.id);

      if (!deletedNotice) {
          return res.status(404).json({ message: 'Notice not found' });
      }
      return res.status(200).json({ message: 'Notice deleted successfully' });

  } catch (error) {
      console.error('Error deleting notice:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/getFilteredNotice", async (req, res) => {
  const searchParams = req.body;
  try {
    let notice = await NoticeModel.find(searchParams);
    if (!notice) {
      return res.status(400).json({ success: false, message: "No Notice Found" });
    }
    const data = {
      success: true,
      message: "Notice Found!",
      notice,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get('/getnoticedetails', cacheMiddleWare, async(req, res) => {
  const searchParams = req.body;
  NoticeModel.find(searchParams)
  .then(notice => res.json(notice))
  .catch(err => res.json(err))
});

app.get('/getnewnoticedetails', cacheMiddleWare, async (req, res) => {
  try {
    const { lastFetchedTimestamp, type } = req.query;

    const searchParams = lastFetchedTimestamp
      ? { timestamp: { $gt: new Date(lastFetchedTimestamp) } }
      : {};

    if (type) {
      searchParams.type = type;
    }

    let query = NoticeModel.find(searchParams);

    const notices = await query.exec();

    res.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/addbannercsedetails", async(req,res) => {
  try {
    const banner = await BannerCSEModel.create(req.body);

    if (banner) {
      res.status(200).json({ success: true, message: 'Banner Created Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getbannercsedetails', cacheMiddleWare, async(req, res) => {
  BannerCSEModel.find()
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.get("/getSingleBannerCseDetails/:id", cacheMiddleWare, async (req, res) => {
  BannerCSEModel.findById(req.params.id)
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.post("/editBannerCseDetails/:id", async(req,res) => {
  try{
    const existingBanner = await BannerCSEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingBanner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.status(200).json({ success: true, message: 'Banner Updated Successfully' });

  } catch (error) {
    console.error('Error updating Banner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteBannerCsedetails/:id', async (req, res) => {

  try {
      const deletedBanner = await BannerCSEModel.findByIdAndDelete(req.params.id);

      if (!deletedBanner) {
          return res.status(404).json({ message: 'Banner not found' });
      }
      return res.status(200).json({ message: 'Banner deleted successfully' });

  } catch (error) {
      console.error('Error deleting Banner', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addaboutcsedetails", async(req,res) => {
  try {
    const existingAbout = await AboutCSEModel.findOne();

    if (existingAbout) {
      const updatedAbout = await AboutCSEModel.findOneAndUpdate(
        {},
        { $set: req.body }, 
        { new: true }
      );

      res.status(200).json({ success: true, message: 'About Updated Successfully', data: updatedAbout });
    } else {
      const newAbout = await AboutCSEModel.create(req.body);

      if (newAbout) {
        res.status(200).json({ success: true, message: 'About Created Successfully', data: newAbout });
      } else {
        res.status(401).json({ success: false, message: 'Process Failed' });
      }
    }
  } catch (error) {
    console.error('Error during creation or update', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
})

app.get('/getaboutcsedetails', cacheMiddleWare, async(req, res) => {
  AboutCSEModel.find()
  .then(about => res.json(about))
  .catch(err => res.json(err))
});

app.post("/addcsegallery", async(req,res) => {
  try {
    const gallery = await GalleryCSEModel.create(req.body);

    if (gallery) {
      res.status(200).json({ success: true, message: 'Image Saved Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getcsegallery', cacheMiddleWare, async(req, res) => {
  GalleryCSEModel.find()
  .then(gallery => res.json(gallery))
  .catch(err => res.json(err))
});

app.get("/getSinglecsegallery/:id", cacheMiddleWare, async (req, res) => {
  GalleryCSEModel.findById(req.params.id)
  .then(gallery => res.json(gallery))
  .catch(err => res.json(err))
});

app.post("/editcsegallery/:id", async(req,res) => {
  try{
    const existingGallery = await GalleryCSEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingGallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    res.status(200).json({ success: true, message: 'Gallery Updated Successfully' });

  } catch (error) {
    console.error('Error updating Gallery', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deletecsegallery/:id', async (req, res) => {

  try {
      const deletedGallery = await GalleryCSEModel.findByIdAndDelete(req.params.id);

      if (!deletedGallery) {
          return res.status(404).json({ message: 'Gallery not found' });
      }
      return res.status(200).json({ message: 'Gallery deleted successfully' });

  } catch (error) {
      console.error('Error deleting Gallery', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addfaqcse", async(req,res) => {
  try {
    const FAQ = await FaqCSEModel.create(req.body);

    if (FAQ) {
      res.status(200).json({ success: true, message: 'FAQ Saved Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get("/getfaqscse", cacheMiddleWare, async (req, res) => {
  FaqCSEModel.find()
  .then(faqs => res.json(faqs))
  .catch(err => res.json(err))
});

app.get("/getSingleFaqCse/:id", cacheMiddleWare, async (req, res) => {
  FaqCSEModel.findById(req.params.id)
  .then(faq => res.json(faq))
  .catch(err => res.json(err))
});

app.post("/editFaqCse/:id", async(req,res) => {
  try{
    const existingFAQ = await FaqCSEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json({ success: true, message: 'FAQ Updated Successfully' });

  } catch (error) {
    console.error('Error updating FAQ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteFaqCse/:id', async (req, res) => {

  try {
      const deletedFAQ = await FaqCSEModel.findByIdAndDelete(req.params.id);

      if (!deletedFAQ) {
          return res.status(404).json({ message: 'FAQ not found' });
      }
      return res.status(200).json({ message: 'FAQ deleted successfully' });

  } catch (error) {
      console.error('Error deleting FAQ', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addbannerECEdetails", async(req,res) => {
  try {
    const banner = await BannerECEModel.create(req.body);

    if (banner) {
      res.status(200).json({ success: true, message: 'Banner Created Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getbannerECEdetails', cacheMiddleWare, async(req, res) => {
  BannerECEModel.find()
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.get("/getSingleBannerECEDetails/:id", cacheMiddleWare, async (req, res) => {
  BannerECEModel.findById(req.params.id)
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.post("/editBannerECEDetails/:id", async(req,res) => {
  try{
    const existingBanner = await BannerECEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingBanner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.status(200).json({ success: true, message: 'Banner Updated Successfully' });

  } catch (error) {
    console.error('Error updating Banner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteBannerECEdetails/:id', async (req, res) => {

  try {
      const deletedBanner = await BannerECEModel.findByIdAndDelete(req.params.id);

      if (!deletedBanner) {
          return res.status(404).json({ message: 'Banner not found' });
      }
      return res.status(200).json({ message: 'Banner deleted successfully' });

  } catch (error) {
      console.error('Error deleting Banner', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addaboutECEdetails", async(req,res) => {
  try {
    const existingAbout = await AboutECEModel.findOne();

    if (existingAbout) {
      const updatedAbout = await AboutECEModel.findOneAndUpdate(
        {},
        { $set: req.body }, 
        { new: true }
      );

      res.status(200).json({ success: true, message: 'About Updated Successfully', data: updatedAbout });
    } else {
      const newAbout = await AboutECEModel.create(req.body);

      if (newAbout) {
        res.status(200).json({ success: true, message: 'About Created Successfully', data: newAbout });
      } else {
        res.status(401).json({ success: false, message: 'Process Failed' });
      }
    }
  } catch (error) {
    console.error('Error during creation or update', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
})

app.get('/getaboutECEdetails', cacheMiddleWare, async(req, res) => {
  AboutECEModel.find()
  .then(about => res.json(about))
  .catch(err => res.json(err))
});

app.post("/addECEgallery", async(req,res) => {
  try {
    const gallery = await GalleryECEModel.create(req.body);

    if (gallery) {
      res.status(200).json({ success: true, message: 'Image Saved Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getECEgallery', cacheMiddleWare, async(req, res) => {
  GalleryECEModel.find()
  .then(gallery => res.json(gallery))
  .catch(err => res.json(err))
});

app.get("/getSingleECEgallery/:id", cacheMiddleWare, async (req, res) => {
  GalleryECEModel.findById(req.params.id)
  .then(gallery => res.json(gallery))
  .catch(err => res.json(err))
});

app.post("/editECEgallery/:id", async(req,res) => {
  try{
    const existingGallery = await GalleryECEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingGallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    res.status(200).json({ success: true, message: 'Gallery Updated Successfully' });

  } catch (error) {
    console.error('Error updating Gallery', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteECEgallery/:id', async (req, res) => {

  try {
      const deletedGallery = await GalleryECEModel.findByIdAndDelete(req.params.id);

      if (!deletedGallery) {
          return res.status(404).json({ message: 'Gallery not found' });
      }
      return res.status(200).json({ message: 'Gallery deleted successfully' });

  } catch (error) {
      console.error('Error deleting Gallery', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addfaqECE", async(req,res) => {
  try {
    const FAQ = await FaqECEModel.create(req.body);

    if (FAQ) {
      res.status(200).json({ success: true, message: 'FAQ Saved Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get("/getfaqsECE", cacheMiddleWare, async (req, res) => {
  FaqECEModel.find()
  .then(faqs => res.json(faqs))
  .catch(err => res.json(err))
});

app.get("/getSingleFaqECE/:id", cacheMiddleWare, async (req, res) => {
  FaqECEModel.findById(req.params.id)
  .then(faq => res.json(faq))
  .catch(err => res.json(err))
});

app.post("/editFaqECE/:id", async(req,res) => {
  try{
    const existingFAQ = await FaqECEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json({ success: true, message: 'FAQ Updated Successfully' });

  } catch (error) {
    console.error('Error updating FAQ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteFaqECE/:id', async (req, res) => {

  try {
      const deletedFAQ = await FaqECEModel.findByIdAndDelete(req.params.id);

      if (!deletedFAQ) {
          return res.status(404).json({ message: 'FAQ not found' });
      }
      return res.status(200).json({ message: 'FAQ deleted successfully' });

  } catch (error) {
      console.error('Error deleting FAQ', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addbannerEEEdetails", async(req,res) => {
  try {
    const banner = await BannerEEEModel.create(req.body);

    if (banner) {
      res.status(200).json({ success: true, message: 'Banner Created Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getbannerEEEdetails', cacheMiddleWare, async(req, res) => {
  BannerEEEModel.find()
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.get("/getSingleBannerEEEDetails/:id", cacheMiddleWare, async (req, res) => {
  BannerEEEModel.findById(req.params.id)
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.post("/editBannerEEEDetails/:id", async(req,res) => {
  try{
    const existingBanner = await BannerEEEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingBanner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.status(200).json({ success: true, message: 'Banner Updated Successfully' });

  } catch (error) {
    console.error('Error updating Banner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteBannerEEEdetails/:id', async (req, res) => {

  try {
      const deletedBanner = await BannerEEEModel.findByIdAndDelete(req.params.id);

      if (!deletedBanner) {
          return res.status(404).json({ message: 'Banner not found' });
      }
      return res.status(200).json({ message: 'Banner deleted successfully' });

  } catch (error) {
      console.error('Error deleting Banner', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addaboutEEEdetails", async(req,res) => {
  try {
    const existingAbout = await AboutEEEModel.findOne();

    if (existingAbout) {
      const updatedAbout = await AboutEEEModel.findOneAndUpdate(
        {},
        { $set: req.body }, 
        { new: true }
      );

      res.status(200).json({ success: true, message: 'About Updated Successfully', data: updatedAbout });
    } else {
      const newAbout = await AboutEEEModel.create(req.body);

      if (newAbout) {
        res.status(200).json({ success: true, message: 'About Created Successfully', data: newAbout });
      } else {
        res.status(401).json({ success: false, message: 'Process Failed' });
      }
    }
  } catch (error) {
    console.error('Error during creation or update', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
})

app.get('/getaboutEEEdetails', cacheMiddleWare, async(req, res) => {
  AboutEEEModel.find()
  .then(about => res.json(about))
  .catch(err => res.json(err))
});

app.post("/addEEEgallery", async(req,res) => {
  try {
    const gallery = await GalleryEEEModel.create(req.body);

    if (gallery) {
      res.status(200).json({ success: true, message: 'Image Saved Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getEEEgallery', cacheMiddleWare, async(req, res) => {
  GalleryEEEModel.find()
  .then(gallery => res.json(gallery))
  .catch(err => res.json(err))
});

app.get("/getSingleEEEgallery/:id", cacheMiddleWare, async (req, res) => {
  GalleryEEEModel.findById(req.params.id)
  .then(gallery => res.json(gallery))
  .catch(err => res.json(err))
});

app.post("/editEEEgallery/:id", async(req,res) => {
  try{
    const existingGallery = await GalleryEEEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingGallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    res.status(200).json({ success: true, message: 'Gallery Updated Successfully' });

  } catch (error) {
    console.error('Error updating Gallery', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteEEEgallery/:id', async (req, res) => {

  try {
      const deletedGallery = await GalleryEEEModel.findByIdAndDelete(req.params.id);

      if (!deletedGallery) {
          return res.status(404).json({ message: 'Gallery not found' });
      }
      return res.status(200).json({ message: 'Gallery deleted successfully' });

  } catch (error) {
      console.error('Error deleting Gallery', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addfaqEEE", async(req,res) => {
  try {
    const FAQ = await FaqEEEModel.create(req.body);

    if (FAQ) {
      res.status(200).json({ success: true, message: 'FAQ Saved Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get("/getfaqsEEE", cacheMiddleWare, async (req, res) => {
  FaqEEEModel.find()
  .then(faqs => res.json(faqs))
  .catch(err => res.json(err))
});

app.get("/getSingleFaqEEE/:id", cacheMiddleWare, async (req, res) => {
  FaqEEEModel.findById(req.params.id)
  .then(faq => res.json(faq))
  .catch(err => res.json(err))
});

app.post("/editFaqEEE/:id", async(req,res) => {
  try{
    const existingFAQ = await FaqEEEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json({ success: true, message: 'FAQ Updated Successfully' });

  } catch (error) {
    console.error('Error updating FAQ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteFaqEEE/:id', async (req, res) => {

  try {
      const deletedFAQ = await FaqEEEModel.findByIdAndDelete(req.params.id);

      if (!deletedFAQ) {
          return res.status(404).json({ message: 'FAQ not found' });
      }
      return res.status(200).json({ message: 'FAQ deleted successfully' });

  } catch (error) {
      console.error('Error deleting FAQ', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addbannerCEdetails", async(req,res) => {
  try {
    const banner = await BannerCEModel.create(req.body);

    if (banner) {
      res.status(200).json({ success: true, message: 'Banner Created Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getbannerCEdetails', cacheMiddleWare, async(req, res) => {
  BannerCEModel.find()
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.get("/getSingleBannerCEDetails/:id", cacheMiddleWare, async (req, res) => {
  BannerCEModel.findById(req.params.id)
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.post("/editBannerCEDetails/:id", async(req,res) => {
  try{
    const existingBanner = await BannerCEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingBanner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.status(200).json({ success: true, message: 'Banner Updated Successfully' });

  } catch (error) {
    console.error('Error updating Banner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteBannerCEdetails/:id', async (req, res) => {

  try {
      const deletedBanner = await BannerCEModel.findByIdAndDelete(req.params.id);

      if (!deletedBanner) {
          return res.status(404).json({ message: 'Banner not found' });
      }
      return res.status(200).json({ message: 'Banner deleted successfully' });

  } catch (error) {
      console.error('Error deleting Banner', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addaboutCEdetails", async(req,res) => {
  try {
    const existingAbout = await AboutCEModel.findOne();

    if (existingAbout) {
      const updatedAbout = await AboutCEModel.findOneAndUpdate(
        {},
        { $set: req.body }, 
        { new: true }
      );

      res.status(200).json({ success: true, message: 'About Updated Successfully', data: updatedAbout });
    } else {
      const newAbout = await AboutCEModel.create(req.body);

      if (newAbout) {
        res.status(200).json({ success: true, message: 'About Created Successfully', data: newAbout });
      } else {
        res.status(401).json({ success: false, message: 'Process Failed' });
      }
    }
  } catch (error) {
    console.error('Error during creation or update', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
})

app.get('/getaboutCEdetails', cacheMiddleWare, async(req, res) => {
  AboutCEModel.find()
  .then(about => res.json(about))
  .catch(err => res.json(err))
});

app.post("/addCEgallery", async(req,res) => {
  try {
    const gallery = await GalleryCEModel.create(req.body);

    if (gallery) {
      res.status(200).json({ success: true, message: 'Image Saved Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getCEgallery', cacheMiddleWare, async(req, res) => {
  GalleryCEModel.find()
  .then(gallery => res.json(gallery))
  .catch(err => res.json(err))
});

app.get("/getSingleCEgallery/:id", cacheMiddleWare, async (req, res) => {
  GalleryCEModel.findById(req.params.id)
  .then(gallery => res.json(gallery))
  .catch(err => res.json(err))
});

app.post("/editCEgallery/:id", async(req,res) => {
  try{
    const existingGallery = await GalleryCEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingGallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    res.status(200).json({ success: true, message: 'Gallery Updated Successfully' });

  } catch (error) {
    console.error('Error updating Gallery', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteCEgallery/:id', async (req, res) => {

  try {
      const deletedGallery = await GalleryCEModel.findByIdAndDelete(req.params.id);

      if (!deletedGallery) {
          return res.status(404).json({ message: 'Gallery not found' });
      }
      return res.status(200).json({ message: 'Gallery deleted successfully' });

  } catch (error) {
      console.error('Error deleting Gallery', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addfaqCE", async(req,res) => {
  try {
    const FAQ = await FaqCEModel.create(req.body);

    if (FAQ) {
      res.status(200).json({ success: true, message: 'FAQ Saved Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get("/getfaqsCE", cacheMiddleWare, async (req, res) => {
  FaqCEModel.find()
  .then(faqs => res.json(faqs))
  .catch(err => res.json(err))
});

app.get("/getSingleFaqCE/:id", cacheMiddleWare, async (req, res) => {
  FaqCEModel.findById(req.params.id)
  .then(faq => res.json(faq))
  .catch(err => res.json(err))
});

app.post("/editFaqCE/:id", async(req,res) => {
  try{
    const existingFAQ = await FaqCEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json({ success: true, message: 'FAQ Updated Successfully' });

  } catch (error) {
    console.error('Error updating FAQ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteFaqCE/:id', async (req, res) => {

  try {
      const deletedFAQ = await FaqCEModel.findByIdAndDelete(req.params.id);

      if (!deletedFAQ) {
          return res.status(404).json({ message: 'FAQ not found' });
      }
      return res.status(200).json({ message: 'FAQ deleted successfully' });

  } catch (error) {
      console.error('Error deleting FAQ', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addbannerMEdetails", async(req,res) => {
  try {
    const banner = await BannerMEModel.create(req.body);

    if (banner) {
      res.status(200).json({ success: true, message: 'Banner Created Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getbannerMEdetails', cacheMiddleWare, async(req, res) => {
  BannerMEModel.find()
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.get("/getSingleBannerMEDetails/:id", cacheMiddleWare, async (req, res) => {
  BannerMEModel.findById(req.params.id)
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.post("/editBannerMEDetails/:id", async(req,res) => {
  try{
    const existingBanner = await BannerMEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingBanner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.status(200).json({ success: true, message: 'Banner Updated Successfully' });

  } catch (error) {
    console.error('Error updating Banner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteBannerMEdetails/:id', async (req, res) => {

  try {
      const deletedBanner = await BannerMEModel.findByIdAndDelete(req.params.id);

      if (!deletedBanner) {
          return res.status(404).json({ message: 'Banner not found' });
      }
      return res.status(200).json({ message: 'Banner deleted successfully' });

  } catch (error) {
      console.error('Error deleting Banner', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addaboutMEdetails", async(req,res) => {
  try {
    const existingAbout = await AboutMEModel.findOne();

    if (existingAbout) {
      const updatedAbout = await AboutMEModel.findOneAndUpdate(
        {},
        { $set: req.body }, 
        { new: true }
      );

      res.status(200).json({ success: true, message: 'About Updated Successfully', data: updatedAbout });
    } else {
      const newAbout = await AboutMEModel.create(req.body);

      if (newAbout) {
        res.status(200).json({ success: true, message: 'About Created Successfully', data: newAbout });
      } else {
        res.status(401).json({ success: false, message: 'Process Failed' });
      }
    }
  } catch (error) {
    console.error('Error during creation or update', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
})

app.get('/getaboutMEdetails', cacheMiddleWare, async(req, res) => {
  AboutMEModel.find()
  .then(about => res.json(about))
  .catch(err => res.json(err))
});

app.post("/addMEgallery", async(req,res) => {
  try {
    const gallery = await GalleryMEModel.create(req.body);

    if (gallery) {
      res.status(200).json({ success: true, message: 'Image Saved Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getMEgallery', cacheMiddleWare, async(req, res) => {
  GalleryMEModel.find()
  .then(gallery => res.json(gallery))
  .catch(err => res.json(err))
});

app.get("/getSingleMEgallery/:id", cacheMiddleWare, async (req, res) => {
  GalleryMEModel.findById(req.params.id)
  .then(gallery => res.json(gallery))
  .catch(err => res.json(err))
});

app.post("/editMEgallery/:id", async(req,res) => {
  try{
    const existingGallery = await GalleryMEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingGallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    res.status(200).json({ success: true, message: 'Gallery Updated Successfully' });

  } catch (error) {
    console.error('Error updating Gallery', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteMEgallery/:id', async (req, res) => {

  try {
      const deletedGallery = await GalleryMEModel.findByIdAndDelete(req.params.id);

      if (!deletedGallery) {
          return res.status(404).json({ message: 'Gallery not found' });
      }
      return res.status(200).json({ message: 'Gallery deleted successfully' });

  } catch (error) {
      console.error('Error deleting Gallery', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addfaqME", async(req,res) => {
  try {
    const FAQ = await FaqMEModel.create(req.body);

    if (FAQ) {
      res.status(200).json({ success: true, message: 'FAQ Saved Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get("/getfaqsME", cacheMiddleWare, async (req, res) => {
  FaqMEModel.find()
  .then(faqs => res.json(faqs))
  .catch(err => res.json(err))
});

app.get("/getSingleFaqME/:id", cacheMiddleWare, async (req, res) => {
  FaqMEModel.findById(req.params.id)
  .then(faq => res.json(faq))
  .catch(err => res.json(err))
});

app.post("/editFaqME/:id", async(req,res) => {
  try{
    const existingFAQ = await FaqMEModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json({ success: true, message: 'FAQ Updated Successfully' });

  } catch (error) {
    console.error('Error updating FAQ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteFaqME/:id', async (req, res) => {

  try {
      const deletedFAQ = await FaqMEModel.findByIdAndDelete(req.params.id);

      if (!deletedFAQ) {
          return res.status(404).json({ message: 'FAQ not found' });
      }
      return res.status(200).json({ message: 'FAQ deleted successfully' });

  } catch (error) {
      console.error('Error deleting FAQ', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addbannerMBAdetails", cacheMiddleWare, async(req,res) => {
  try {
    const banner = await BannerMBAModel.create(req.body);

    if (banner) {
      res.status(200).json({ success: true, message: 'Banner Created Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getbannerMBAdetails', cacheMiddleWare, async(req, res) => {
  BannerMBAModel.find()
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.get("/getSingleBannerMBADetails/:id", cacheMiddleWare, async (req, res) => {
  BannerMBAModel.findById(req.params.id)
  .then(banners => res.json(banners))
  .catch(err => res.json(err))
});

app.post("/editBannerMBADetails/:id", async(req,res) => {
  try{
    const existingBanner = await BannerMBAModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingBanner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.status(200).json({ success: true, message: 'Banner Updated Successfully' });

  } catch (error) {
    console.error('Error updating Banner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteBannerMBAdetails/:id', async (req, res) => {

  try {
      const deletedBanner = await BannerMBAModel.findByIdAndDelete(req.params.id);

      if (!deletedBanner) {
          return res.status(404).json({ message: 'Banner not found' });
      }
      return res.status(200).json({ message: 'Banner deleted successfully' });

  } catch (error) {
      console.error('Error deleting Banner', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addaboutMBAdetails", async(req,res) => {
  try {
    const existingAbout = await AboutMBAModel.findOne();

    if (existingAbout) {
      const updatedAbout = await AboutMBAModel.findOneAndUpdate(
        {},
        { $set: req.body }, 
        { new: true }
      );

      res.status(200).json({ success: true, message: 'About Updated Successfully', data: updatedAbout });
    } else {
      const newAbout = await AboutMBAModel.create(req.body);

      if (newAbout) {
        res.status(200).json({ success: true, message: 'About Created Successfully', data: newAbout });
      } else {
        res.status(401).json({ success: false, message: 'Process Failed' });
      }
    }
  } catch (error) {
    console.error('Error during creation or update', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
})

app.get('/getaboutMBAdetails', cacheMiddleWare, async(req, res) => {
  AboutMBAModel.find()
  .then(about => res.json(about))
  .catch(err => res.json(err))
});

app.post("/addMBAgallery", async(req,res) => {
  try {
    const gallery = await GalleryMBAModel.create(req.body);

    if (gallery) {
      res.status(200).json({ success: true, message: 'Image Saved Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get('/getMBAgallery', cacheMiddleWare, async(req, res) => {
  GalleryMBAModel.find()
  .then(gallery => res.json(gallery))
  .catch(err => res.json(err))
});

app.get("/getSingleMBAgallery/:id", cacheMiddleWare, async (req, res) => {
  GalleryMBAModel.findById(req.params.id)
  .then(gallery => res.json(gallery))
  .catch(err => res.json(err))
});

app.post("/editMBAgallery/:id", async(req,res) => {
  try{
    const existingGallery = await GalleryMBAModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingGallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    res.status(200).json({ success: true, message: 'Gallery Updated Successfully' });

  } catch (error) {
    console.error('Error updating Gallery', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteMBAgallery/:id', async (req, res) => {

  try {
      const deletedGallery = await GalleryMBAModel.findByIdAndDelete(req.params.id);

      if (!deletedGallery) {
          return res.status(404).json({ message: 'Gallery not found' });
      }
      return res.status(200).json({ message: 'Gallery deleted successfully' });

  } catch (error) {
      console.error('Error deleting Gallery', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addfaqMBA", async(req,res) => {
  try {
    const FAQ = await FaqMBAModel.create(req.body);

    if (FAQ) {
      res.status(200).json({ success: true, message: 'FAQ Saved Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get("/getfaqsMBA", cacheMiddleWare, async (req, res) => {
  FaqMBAModel.find()
  .then(faqs => res.json(faqs))
  .catch(err => res.json(err))
});

app.get("/getSingleFaqMBA/:id", cacheMiddleWare, async (req, res) => {
  FaqMBAModel.findById(req.params.id)
  .then(faq => res.json(faq))
  .catch(err => res.json(err))
});

app.post("/editFaqMBA/:id", async(req,res) => {
  try{
    const existingFAQ = await FaqMBAModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json({ success: true, message: 'FAQ Updated Successfully' });

  } catch (error) {
    console.error('Error updating FAQ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteFaqMBA/:id', async (req, res) => {

  try {
      const deletedFAQ = await FaqMBAModel.findByIdAndDelete(req.params.id);

      if (!deletedFAQ) {
          return res.status(404).json({ message: 'FAQ not found' });
      }
      return res.status(200).json({ message: 'FAQ deleted successfully' });

  } catch (error) {
      console.error('Error deleting FAQ', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addDepartment", async (req, res) => {
  try {
    let departments = await DepartmentModel.findOne({
      deptname: req.body.deptname,
    });
    if (departments) {
      const data = {
        success: false,
        message: "Already Exists!",
      };
      res.status(400).json(data);
    } else {
      await DepartmentModel.create(req.body);
      const data = {
        success: true,
        message: "Department Added!",
      };
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/getDepartment", cacheMiddleWare, async (req, res) => {
  DepartmentModel.find()
  .then(departments => res.json(departments))
  .catch(err => res.json(err))
});

app.get("/getSingleDepartmentDetails/:id", cacheMiddleWare, async (req, res) => {
  DepartmentModel.findById(req.params.id)
  .then(departments => res.json(departments))
  .catch(err => res.json(err))
});

app.get("/DepartmentCount", cacheMiddleWare, async (req, res) => {
  try {
    let departments = await DepartmentModel.countDocuments();
    const data = {
      success: true,
      message: "Count Successfull!",
      departments,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.put("/editDepartment/:id", async(req,res) => {
  try{
    const existingDepartment = await DepartmentModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingDepartment) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.status(200).json({ success: true, message: 'Department Updated Successfully' });

  } catch (error) {
    console.error('Error updating Department', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteDepartment/:id', async (req, res) => {

  try {
      const deletedDepartment = await DepartmentModel.findByIdAndDelete(req.params.id);

      if (!deletedDepartment) {
          return res.status(404).json({ message: 'Department not found' });
      }
      return res.status(200).json({ message: 'Department deleted successfully' });

  } catch (error) {
      console.error('Error deleting Department', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addSubject", async (req, res) => {
  try {
    let subjects = await SubjectModel.findOne({
      subname: req.body.subname,
    });
    if (subjects) {
      const data = {
        success: false,
        message: "Already Exists!",
      };
      res.status(400).json(data);
    } else {
      await SubjectModel.create(req.body);
      const data = {
        success: true,
        message: "Subject Added!",
      };
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/getSubject", cacheMiddleWare, async (req, res) => {
  SubjectModel.find()
  .then(subjects => res.json(subjects))
  .catch(err => res.json(err))
});

app.post("/getFilteredSubjectDetails", async (req, res) => {
  const searchParams = req.body;
  try {
    let subject = await SubjectModel.find(searchParams);
    if (!subject) {
      return res.status(400).json({ success: false, message: "No Subject Found" });
    }
    const data = {
      success: true,
      message: "Subject Details Found!",
      subject,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/getSingleSubjectDetails/:id", cacheMiddleWare, async (req, res) => {
  SubjectModel.findById(req.params.id)
  .then(subject => res.json(subject))
  .catch(err => res.json(err))
});

app.get("/SubjectCount", cacheMiddleWare, async (req, res) => {
  try {
    const searchParams = req.query;
    let subjects;

    if (Object.keys(searchParams).length === 0) {
      subjects = await SubjectModel.countDocuments();
    } else {
      subjects = await SubjectModel.countDocuments(searchParams);
    }

    const data = {
      success: true,
      message: "Count Successful!",
      subjects,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.put("/editSubject/:id", async(req,res) => {
  try{
    const existingSubject = await SubjectModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingSubject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.status(200).json({ success: true, message: 'Subject Updated Successfully' });

  } catch (error) {
    console.error('Error updating Subject', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteSubject/:id', async (req, res) => {

  try {
      const deletedSubject = await SubjectModel.findByIdAndDelete(req.params.id);

      if (!deletedSubject) {
          return res.status(404).json({ message: 'Subject not found' });
      }
      return res.status(200).json({ message: 'Subject deleted successfully' });

  } catch (error) {
      console.error('Error deleting Subject', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});


app.post("/addStudentDetails", async (req, res) => {
  try {
    let user = await StudentModel.findOne({
      enrollmentNo: req.body.enrollmentNo,
    });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Student With This Enrollment Already Exists",
      });
    }
    user = await StudentModel.create(req.body);
    const data = {
      success: true,
      message: "Student Details Added!",
      user,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/getFilteredStudentDetails", async (req, res) => {
  const searchParams = req.body;
  try {
    let student = await StudentModel.find(searchParams);
    if (!student) {
      return res.status(400).json({ success: false, message: "No Student Found" });
    }
    const data = {
      success: true,
      message: "Student Details Found!",
      student,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/getFilteredStudentDetailsByEnrollmentNo", async (req, res) => {
  const searchParams = req.body;
  try {
    let student = await StudentModel.find(searchParams);
    if (!student) {
      return res.status(400).json({ success: false, message: "No Student Found" });
    }
    const data = {
      success: true,
      message: "Student Details Found!",
      student,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post('/changestudentprofilepicture/:user', async (req, res) => {
  const { fileDownloadURL } = req.body;
  const { user } = req.params;

  try {
    const existingUser = await StudentModel.findOne({ email: user });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await StudentModel.updateOne({ email: user }, { $set: { profile: fileDownloadURL } });

    res.status(200).json({ success: true, message: 'Profile Picture changed successfully' });
  } catch (error) {
    console.error('Error changing profile picture', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get("/getStudentDetails", cacheMiddleWare, async (req, res) => {
  StudentModel.find()
  .then(students => res.json(students))
  .catch(err => res.json(err))
});

app.get("/getSingleStudentDetails/:id", cacheMiddleWare, async (req, res) => {
  StudentModel.findById(req.params.id)
  .then(students => res.json(students))
  .catch(err => res.json(err))
});

app.get("/StudentCount", cacheMiddleWare, async (req, res) => {
  try {
    let students = await StudentModel.countDocuments();
    const data = {
      success: true,
      message: "Count Successfull!",
      students,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/editStudentDetails/:id", async(req,res) => {
  try{
    const existingStudent = await StudentModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ success: true, message: 'Student Updated Successfully' });

  } catch (error) {
    console.error('Error updating student', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteStudentDetails/:id', async (req, res) => {

  try {
      const deletedStudent = await StudentModel.findByIdAndDelete(req.params.id);

      if (!deletedStudent) {
          return res.status(404).json({ message: 'Student not found' });
      }
      return res.status(200).json({ message: 'Student deleted successfully' });

  } catch (error) {
      console.error('Error deleting student', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});


app.post("/addFacultyDetails", async (req, res) => {
  try {
    let user = await FacultyModel.findOne({
      facultyId: req.body.facultyId,
    });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Faculty With This Enrollment Already Exists",
      });
    }
    user = await FacultyModel.create(req.body);
    const data = {
      success: true,
      message: "Faculty Details Added!",
      user,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/getFilteredFacultyDetails", async (req, res) => {
  const searchParams = req.body;
  try {
    let faculty = await FacultyModel.find(searchParams);
    if (!faculty) {
      return res.status(400).json({ success: false, message: "No Faculty Found" });
    }
    const data = {
      success: true,
      message: "Faculty Details Found!",
      faculty,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post('/changefacultyprofilepicture/:user', async (req, res) => {
  const { fileDownloadURL } = req.body;
  const { user } = req.params;

  try {
    const existingUser = await FacultyModel.findOne({ email: user });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await FacultyModel.updateOne({ email: user }, { $set: { profile: fileDownloadURL } });

    res.status(200).json({ success: true, message: 'Profile Picture changed successfully' });
  } catch (error) {
    console.error('Error changing profile picture', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get("/getFacultyDetails", cacheMiddleWare, async (req, res) => {
  FacultyModel.find()
  .then(faculties => res.json(faculties))
  .catch(err => res.json(err))
});

app.get("/getSingleFacultyDetails/:id", cacheMiddleWare, async (req, res) => {
  FacultyModel.findById(req.params.id)
  .then(faculties => res.json(faculties))
  .catch(err => res.json(err))
});

app.get("/FacultyCount", cacheMiddleWare, async (req, res) => {
  try {
    let faculties = await FacultyModel.countDocuments();
    const data = {
      success: true,
      message: "Count Successfull!",
      faculties,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.put("/editFacultyDetails/:id", async(req,res) => {
  try{
    const existingFaculty = await FacultyModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingFaculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    res.status(200).json({ success: true, message: 'Faculty Updated Successfully' });

  } catch (error) {
    console.error('Error updating Faculty', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteFacultyDetails/:id', async (req, res) => {

  try {
      const deletedFaculty = await FacultyModel.findByIdAndDelete(req.params.id);

      if (!deletedFaculty) {
          return res.status(404).json({ message: 'Faculty not found' });
      }
      return res.status(200).json({ message: 'Faculty deleted successfully' });

  } catch (error) {
      console.error('Error deleting Faculty', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});


app.post("/addStaffDetails", async (req, res) => {
  try {
    let user = await StaffModel.findOne({
      staffId: req.body.staffId,
    });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Staff With This Staff ID Already Exists",
      });
    }
    user = await StaffModel.create(req.body);
    const data = {
      success: true,
      message: "Staff Details Added!",
      user,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/getFilteredStaffDetails", async (req, res) => {
  const searchParams = req.body;
  try {
    let staff = await StaffModel.find(searchParams);
    if (!staff) {
      return res.status(400).json({ success: false, message: "No Staff Found" });
    }
    const data = {
      success: true,
      message: "Staff Details Found!",
      staff,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post('/changestaffprofilepicture/:user', async (req, res) => {
  const { fileDownloadURL } = req.body;
  const { user } = req.params;

  try {
    const existingUser = await StaffModel.findOne({ email: user });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await StaffModel.updateOne({ email: user }, { $set: { profile: fileDownloadURL } });

    res.status(200).json({ success: true, message: 'Profile Picture changed successfully' });
  } catch (error) {
    console.error('Error changing profile picture', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get("/getStaffDetails", cacheMiddleWare, async (req, res) => {
  StaffModel.find()
  .then(staffs => res.json(staffs))
  .catch(err => res.json(err))
});

app.get("/getSingleStaffDetails/:id", cacheMiddleWare, async (req, res) => {
  StaffModel.findById(req.params.id)
  .then(staffs => res.json(staffs))
  .catch(err => res.json(err))
});

app.get("/StaffCount", cacheMiddleWare, async (req, res) => {
  try {
    let staffs = await StaffModel.countDocuments();
    const data = {
      success: true,
      message: "Count Successfull!",
      staffs,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.put("/editStaffDetails/:id", async(req,res) => {
  try{
    const existingStaff = await StaffModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingStaff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.status(200).json({ success: true, message: 'Staff Updated Successfully' });

  } catch (error) {
    console.error('Error updating Staff', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteStaffDetails/:id', async (req, res) => {

  try {
      const deletedStaff = await StaffModel.findByIdAndDelete(req.params.id);

      if (!deletedStaff) {
          return res.status(404).json({ message: 'Staff not found' });
      }
      return res.status(200).json({ message: 'Staff deleted successfully' });

  } catch (error) {
      console.error('Error deleting Staff', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/StudentAttendance', async (req, res) => {
  const { attendanceData } = req.body;

  if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({ error: 'Invalid attendance data.' });
  }

  try {
      const bulkUpdateOps = attendanceData.map((attendanceRecord) => {
          // Check if an attendance record already exists for the given student and date
          return {
              updateOne: {
                  filter: {
                      enrollmentNo: attendanceRecord.enrollmentNo,
                      date: attendanceRecord.date,
                      subject: attendanceRecord.subject,
                  },
                  update: {
                      $set: {
                          fullName: attendanceRecord.fullName,
                          department: attendanceRecord.department,
                          semester: attendanceRecord.semester,
                          subject: attendanceRecord.subject,
                          attendance: attendanceRecord.attendance,
                      },
                  },
                  upsert: true, 
              },
          };
      });

      await AttendanceModel.bulkWrite(bulkUpdateOps);

      res.json({ success: true });
  } catch (error) {
      console.error('Error submitting attendance:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/getFilteredStudentAttendanceDetails", async (req, res) => {
  const searchParams = req.body;
  try {
    let studentattendance = await AttendanceModel.find(searchParams);
    if (!studentattendance) {
      return res.status(400).json({ success: false, message: "No Student Attendance Found" });
    }
    const data = {
      success: true,
      message: "Student Attendance Details Found!",
      studentattendance,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post('/getFilteredStudentAttendanceDetailsByDateRange', async (req, res) => {
  const { department, semester, enrollmentNo, subject, fromDate, toDate } = req.body;

  try {
      let query = {
          department,
          semester,
          enrollmentNo,
          subject,
      };

      if (enrollmentNo !== 'allStudents') {
        query.enrollmentNo = enrollmentNo;
      }

      if (fromDate && toDate) {
          query.date = {
              $gte: fromDate,
              $lte: toDate,
          };
      }

      const studentAttendance = await AttendanceModel.find(query);
      res.status(200).json({ studentattendance: studentAttendance });
  } catch (error) {
      console.error('Error fetching Student Attendance', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/getFilteredStudentAttendanceDetailsByDate', async (req, res) => {
  const { department, semester, enrollmentNo, subject, date } = req.body;

  try {
      let query = {
          department,
          semester,
          enrollmentNo,
          subject,
          date,
      };

      if (enrollmentNo !== 'allStudents') {
        query.enrollmentNo = enrollmentNo;
      }

      const studentAttendance = await AttendanceModel.find(query);
      res.status(200).json({ studentattendance: studentAttendance });
  } catch (error) {
      console.error('Error fetching Student Attendance', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post("/addtimetable", async(req,res) => {
  try {
    const timetable = await TimetableModel.create(req.body);

    if (timetable) {
      res.status(200).json({ success: true, message: 'Timetable Published Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
});

app.post("/getFilteredTimetable", async (req, res) => {
  const searchParams = req.body;
  try {
    let timetable = await TimetableModel.find(searchParams);
    if (!timetable) {
      return res.status(400).json({ success: false, message: "No Timetable Found" });
    }
    const data = {
      success: true,
      message: "Timetable Found!",
      timetable,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/getTimetableDetails", cacheMiddleWare, async (req, res) => {
  const searchParams = req.body;
  TimetableModel.find(searchParams)
  .then(timetable => res.json(timetable))
  .catch(err => res.json(err))
});

app.get("/getSingleTimetableDetails/:id", cacheMiddleWare, async (req, res) => {
  TimetableModel.findById(req.params.id)
  .then(timetable => res.json(timetable))
  .catch(err => res.json(err))
});

app.get("/TimetableCount", cacheMiddleWare, async (req, res) => {
  try {
    const searchParams = req.query;
    let timetables;

    if (Object.keys(searchParams).length === 0) {
      timetables = await TimetableModel.countDocuments();
    } else {
      timetables = await TimetableModel.countDocuments(searchParams);
    }

    const data = {
      success: true,
      message: "Count Successful!",
      timetables,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/editTimetableDetails/:id", async(req,res) => {
  try{
    const existingTimetable = await TimetableModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingTimetable) {
      return res.status(404).json({ error: 'Timetable not found' });
    }

    res.status(200).json({ success: true, message: 'Timetable Updated Successfully' });

  } catch (error) {
    console.error('Error updating Timetable', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteTimetableDetails/:id', async (req, res) => {

  try {
      const deletedTimetable = await TimetableModel.findByIdAndDelete(req.params.id);

      if (!deletedTimetable) {
          return res.status(404).json({ message: 'Timetable not found' });
      }
      return res.status(200).json({ message: 'Timetable deleted successfully' });

  } catch (error) {
      console.error('Error deleting Timetable', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addmaterial", async(req,res) => {
  try {
    const material = await MaterialModel.create(req.body);

    if (material) {
      res.status(200).json({ success: true, message: 'Material Published Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
});

app.get("/getmaterials", cacheMiddleWare, async (req, res) => {
  MaterialModel.find()
  .then(material => res.json(material))
  .catch(err => res.json(err))
});

app.get("/MaterialCount", cacheMiddleWare, async (req, res) => {
  try {
    const searchParams = req.query;
    let materials;

    if (Object.keys(searchParams).length === 0) {
      materials = await MaterialModel.countDocuments();
    } else {
      materials = await MaterialModel.countDocuments(searchParams);
    }

    const data = {
      success: true,
      message: "Count Successful!",
      materials,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/getFilteredMaterial", async (req, res) => {
  const searchParams = req.body;
  try {
    let material = await MaterialModel.find(searchParams);
    if (!material) {
      return res.status(400).json({ success: false, message: "No Material Found" });
    }
    const data = {
      success: true,
      message: "Material Found!",
      material,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post('/getFilteredSubjectMaterial', async (req, res) => {
  try {
    const { subject } = req.body;
    const materials = await MaterialModel.find({ subject });

    res.status(200).json({ material: materials });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/getSingleMaterialDetails/:id", cacheMiddleWare, async (req, res) => {
  MaterialModel.findById(req.params.id)
  .then(material => res.json(material))
  .catch(err => res.json(err))
});

app.post("/editMaterialDetails/:id", async(req,res) => {
  try{
    const existingMaterial = await MaterialModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingMaterial) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.status(200).json({ success: true, message: 'Material Updated Successfully' });

  } catch (error) {
    console.error('Error updating Material', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteMaterialDetails/:id', async (req, res) => {

  try {
      const deletedMaterial = await MaterialModel.findByIdAndDelete(req.params.id);

      if (!deletedMaterial) {
          return res.status(404).json({ message: 'Material not found' });
      }
      return res.status(200).json({ message: 'Material deleted successfully' });

  } catch (error) {
      console.error('Error deleting Material', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/addevent", async(req,res) => {
  try {
    const event = await EventModel.create(req.body);

    if (event) {
      res.status(200).json({ success: true, message: 'Event Saved Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.post("/addshowevent", async(req,res) => {
  try {
    const event = await ShowEventModel.create(req.body);

    if (event) {
      res.status(200).json({ success: true, message: 'Event added Successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Process Failed' });
    }
  } 
  catch (error) {
    console.error('Error during creation', error);
    res.status(500).json({ success: false, message: 'Internal server error'});
  }
})

app.get("/getevents", cacheMiddleWare, async (req, res) => {
  EventModel.find()
  .then(events => res.json(events))
  .catch(err => res.json(err))
});

app.get("/getshowevents", cacheMiddleWare, async (req, res) => {
  ShowEventModel.find()
  .then(events => res.json(events))
  .catch(err => res.json(err))
});

app.get("/getSingleShowEvent/:id", cacheMiddleWare, async (req, res) => {
  ShowEventModel.findById(req.params.id)
  .then(event => res.json(event))
  .catch(err => res.json(err))
});

app.post("/editShowEvent/:id", async(req,res) => {
  try{
    const existingEvent = await ShowEventModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ success: true, message: 'Event Updated Successfully' });

  } catch (error) {
    console.error('Error updating Event', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteShowEvent/:id', async (req, res) => {

  try {
      const deletedEvent = await ShowEventModel.findByIdAndDelete(req.params.id);

      if (!deletedEvent) {
          return res.status(404).json({ message: 'Event not found' });
      }
      return res.status(200).json({ message: 'Event deleted successfully' });

  } catch (error) {
      console.error('Error deleting ShowEvent', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/deleteevent', async (req, res) => {
  try {
    const { title, start } = req.body;

    const deletedEvent = await EventModel.findOneAndDelete({ title, start });

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json({ message: 'Event deleted successfully', deletedEvent });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/submitContactForm', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const savedContact = await EnquiryModel.create(req.body);

    res.status(200).json({ message: 'Form submitted successfully', data: savedContact });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/getEnquiries", cacheMiddleWare, async (req, res) => {
  EnquiryModel.find()
  .then(enquiries => res.json(enquiries))
  .catch(err => res.json(err))
});

app.post('/deleteEnquiry/:id', async (req, res) => {

  try {
      const deletedEnquiry = await EnquiryModel.findByIdAndDelete(req.params.id);

      if (!deletedEnquiry) {
          return res.status(404).json({ message: 'Enquiry not found' });
      }
      return res.status(200).json({ message: 'Enquiry deleted successfully' });

  } catch (error) {
      console.error('Error deleting Enquiry', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/EnquiryCount", cacheMiddleWare, async (req, res) => {
  try {
    let enquiries = await EnquiryModel.countDocuments();
    const data = {
      success: true,
      message: "Count Successfull!",
      enquiries,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/addBookDetails", async (req, res) => {
  try {
    let book = await BookModel.findOne({
      isbnNo: req.body.isbnNo,
    });
    if (book) {
      return res.status(400).json({
        success: false,
        message: "Book With This ISBN No. Already Exists",
      });
    }
    book = await BookModel.create(req.body);
    const data = {
      success: true,
      message: "Book Details Added!",
      book,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/getBookDetails", cacheMiddleWare, async (req, res) => {
  BookModel.find()
  .then(books => res.json(books))
  .catch(err => res.json(err))
});

app.get("/getSingleBookDetails/:id", cacheMiddleWare, async (req, res) => {
  BookModel.findById(req.params.id)
  .then(books => res.json(books))
  .catch(err => res.json(err))
});

app.get("/BookCount", cacheMiddleWare, async (req, res) => {
  try {
    let books = await BookModel.countDocuments();
    const data = {
      success: true,
      message: "Count Successfull!",
      books,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/getFilteredBookDetails", async (req, res) => {
  const searchParams = req.body;
  try {
    let book = await BookModel.find(searchParams);
    if (!book) {
      return res.status(400).json({ success: false, message: "No book Found" });
    }
    const data = {
      success: true,
      message: "book Details Found!",
      book,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/editBookDetails/:id", async(req,res) => {
  try{
    const existingBook = await BookModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ success: true, message: 'Book Updated Successfully' });

  } catch (error) {
    console.error('Error updating Book', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteBookDetails/:id', async (req, res) => {

  try {
      const deletedBook = await BookModel.findByIdAndDelete(req.params.id);

      if (!deletedBook) {
          return res.status(404).json({ message: 'Book not found' });
      }
      return res.status(200).json({ message: 'Book deleted successfully' });

  } catch (error) {
      console.error('Error deleting Book', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/addLibraryMember', async (req, res) => {
  const { fullName, enrollmentNo, email, phone, department, semester, password, status } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await LibraryModel.create({
      fullName,
      enrollmentNo,
      email,
      phone,
      department,
      semester,
      password: hashedPassword,
      status,
    });

    res.json(user);
  } catch (err) {
    console.error('Error during Library registration:', err);
    res.status(500).json(err);
  }
});

app.get("/getLibraryMemberDetails", cacheMiddleWare, async (req, res) => {
  LibraryModel.find()
  .then(librarymembers => res.json(librarymembers))
  .catch(err => res.json(err))
});

app.post("/addIssueBookDetails", async (req, res) => {
  try {
    let issuebook = await IssueBookModel.findOne({
      isbnNo: req.body.isbnNo,
    });
    if (issuebook) {
      return res.status(400).json({
        success: false,
        message: "Book With This ISBN No. Already Issued",
      });
    }
    issuebook = await IssueBookModel.create(req.body);
    const data = {
      success: true,
      message: "Book Issued Successfully!",
      issuebook,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/getIssueBookDetails", cacheMiddleWare, async (req, res) => {
  IssueBookModel.find()
  .then(issuebooks => res.json(issuebooks))
  .catch(err => res.json(err))
});

app.get("/IssuedBookCount", cacheMiddleWare, async (req, res) => {
  try {
    const searchParams = req.query;
    let issuedbooks;

    if (Object.keys(searchParams).length === 0) {
      issuedbooks = await IssueBookModel.countDocuments();
    } else {
      issuedbooks = await IssueBookModel.countDocuments(searchParams);
    }

    const data = {
      success: true,
      message: "Count Successful!",
      issuedbooks,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


app.post("/getFilteredIssueBookDetails", async (req, res) => {
  const searchParams = req.body;
  try {
    let issuebook = await IssueBookModel.find(searchParams);
    if (!issuebook) {
      return res.status(400).json({ success: false, message: "No book is Issued" });
    }
    const data = {
      success: true,
      message: "book Details Found!",
      issuebook,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post('/deleteIssueBookDetails/:id', async (req, res) => {

  try {
      const deletedIssueBook = await IssueBookModel.findByIdAndDelete(req.params.id);

      if (!deletedIssueBook) {
          return res.status(404).json({ message: 'Issue Book not found' });
      }
      return res.status(200).json({ message: 'Issued Book removed successfully' });

  } catch (error) {
      console.error('Error removing Issued Book', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/returnBook/:id", async(req,res) => {
  try{
    const existingBook = await IssueBookModel.findByIdAndUpdate(req.params.id, req.body);

    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ success: true, message: 'Book Returned Successfully' });

  } catch (error) {
    console.error('Error returning Book', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/updateBookStatus/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const { status, returnDate } = req.body;

  try {
    const updatedBook = await IssueBookModel.findByIdAndUpdate(
      bookId,
      { status, returnDate },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
