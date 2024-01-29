const Stat = require("../moduls/webstatus");

// Middleware for counting page views
const visturecount = async (req, res, next)=>{
        const allowedRoutes = ['/', '/blog/blogcategory', '/blog', '/services', '/contact', '/showblog']; // Add the routes you want to track
        // Check if the current route is in the allowed routes
        if (allowedRoutes.includes(req.path)) {
          try {
          const page = req.originalUrl;
            const stat = await Stat.findOneAndUpdate(
              { page },
              { $inc: { visitors: 1 } },
              { upsert: true, new: true }
            );
            req.pageStats = stat;
          } catch (error) {
            console.error("Path error:", error);
            // return res.status(500).send(error.message);
          }
        }
        next();
};

module.exports = { visturecount };