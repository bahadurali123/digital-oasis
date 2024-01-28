// require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 6565;
const routs = require("./src/routs/userrouts");
const adminrout = require("./src/routs/adminrout");
// const { authanticate, userauth, isAuthenticated } = require("./src/middleware/userauthanticate");
const { authanticate, userauth, flexebelauth } = require("./src/middleware/userauthanticate");
const Stat = require("./src/moduls/webstatus");
const uploadfile = require("./src/middleware/multer");


// // Middleware for counting page views
// app.use(async (req, res, next) => {
//   const allowedRoutes = ['/', '/blog/blogcategory', '/blog', '/services', '/contact', '/showblog']; // Add the routes you want to track
//   // Check if the current route is in the allowed routes
//   if (allowedRoutes.includes(req.path)) {
//     try {
//     const page = req.originalUrl;
//       const stat = await Stat.findOneAndUpdate(
//         { page },
//         { $inc: { visitors: 1 } },
//         { upsert: true, new: true }
//       );
//       req.pageStats = stat;
//     } catch (error) {
//       return res.status(500).send(error.message);
//     }
//   }
//   next();
// });
// pagination Middleware
const paginateMiddleware = async (req, res, next) => {
  try {
      const pageno = req.query.page || 1;
      console.log("pageno", pageno);
      const limit = 2;
      const skipblog = (pageno - 1) * limit;
      console.log("skip blogs: ", skipblog);

      // Adding pagination data to request object
      req.paginationData = {
          pageno,
          limit,
          skipblog,
          // totalpages,
      };

      next();
  } catch (error) {
      console.error("Pagination Middleware Error:", error);
      res.status(500).send("Internal Server Error");
  }
};

const ejs = require("ejs");
const { updateMany } = require("./src/moduls/teamdata");
require("./src/db/connection")

const cookieparser = require("cookie-parser");
const blogdata = require("./src/moduls/blogschema");
app.use(cookieparser());

// // Models
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: true,
// }));

// app.use(isAuthenticated);


// This is the static path of this website
const staticpath = path.join(__dirname, "../fulweb1");
app.use(express.static(staticpath));

// Template Engine
app.set("view engine", "ejs");
// ejs.registerPartials("views/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get("/", flexebelauth, routs); // ok
app.get("/services", flexebelauth, routs); // ok
app.get("/blog", flexebelauth, paginateMiddleware, routs); // ok
app.get("/blogsearch/:search", flexebelauth, paginateMiddleware, routs); // test true row JSON search page
app.get("/blog/:blogcategory", flexebelauth, paginateMiddleware, routs); // ok
app.get("/showblog/:blogtitle", flexebelauth, routs); // ok
app.post("/showblog/:blogtitle/:like", userauth, routs); // test true row JSON
app.post("/blog/:postId/comments", userauth, routs); // test true row JSON
app.get("/contact", flexebelauth, routs); // ok
app.post("/contact", userauth, routs); // test true row JSON
app.get("/userregister", routs); // test true
app.post("/userregister", uploadfile.single("image"), routs); // test true form-data
app.get("/userlogin", routs); // ok
app.post("/userlogin", routs); // test true row JSON
app.get("/userlogout", userauth, routs); // test true

// for admin pannel
// post=creat
// get=read 
// put=update 
// delete=delete

app.get("/register", routs, adminrout); // ok
app.post("/register", routs, adminrout); // test true row JSON
app.get("/login", routs, adminrout); // ok
app.post("/login", routs, adminrout); // test true row JSON
app.get("/logout", authanticate, routs, adminrout); // ok
app.get("/admin", authanticate, adminrout); // ok
app.get("/admin/team", authanticate, adminrout); // ok
app.post("/admin/team", authanticate, adminrout); // test true row JSON
app.get("/admin/team/delete/:id", authanticate, adminrout); // ok
app.get("/admin/team/edit/:id", authanticate, adminrout); // ok
app.post("/admin/team/edit/:id", authanticate, adminrout); // test true row JSON

app.get("/admin/social", authanticate, adminrout); // ok
app.post("/admin/social", authanticate, adminrout); // test true row JSON
app.get("/admin/social/delete/:id", authanticate, adminrout); // ok
app.get("/admin/social/edit/:id", authanticate, adminrout); // ok
app.post("/admin/social/edit/:id", authanticate, adminrout); // test true row JSON

app.get("/admin/contact", authanticate, adminrout); // ok
app.post("/admin/contact", authanticate, adminrout); // test true row JSON
app.get("/admin/contact/delete/:id", authanticate, adminrout); // ok
app.get("/admin/contact/edit/:id", authanticate, adminrout); // ok
app.post("/admin/contact/edit/:id", authanticate, adminrout); // test true row JSON

app.get("/admin/adminblog", authanticate, adminrout); // ok
app.post("/admin/adminblog", authanticate, adminrout); // test true row JSON
app.get("/admin/blog/delete/:id", authanticate, adminrout); // ok
app.get("/admin/blog/edit/:id", authanticate, adminrout); // ok
app.post("/admin/blog/edit/:id", authanticate, adminrout); // test true row JSON

app.get("/admin/address", authanticate, adminrout); // ik
app.post("/admin/address", authanticate, adminrout); // test true row JSON

app.get("/admin/comments", authanticate, adminrout);
app.get("/admin/users", authanticate, adminrout);
app.get("/admin/messages", authanticate, adminrout);
app.get("/admin/likes", authanticate, adminrout);

app.listen(port, () => {
  console.log(`Server listen at port: ${port}`);
});