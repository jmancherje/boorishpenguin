var db = require('../db/index.js');

module.exports = {
  allCourses: function(req, res) {
    db.Course.findAll()
    .then(function(courses) {
      var formattedCourses = courses.map(function(course) {
        return {
          id: course.id,
          name: course.name
        };
      });

      courses = {};
      courses.results = formattedCourses;
      res.json(courses);
    });
  },

  createCourse: function(req, res) {
    var course = req.body;
    db.Course.create(course).then(function (course) {
      res.sendStatus(200);
    });
  },

  addUser: function(req, res) {
    var userCourse = req.body;
    db.CourseUser.create(userCourse).then(function () {
      res.sendStatus(200);
    });
  },

  allUsersCourses: function(req, res) {
    var uid = req.params.id;
    db.CourseUser.findAll({
      where: {
        UserId: uid
      }
    }).then(function(courses) {
      // get array of course Ids:
      console.log('This console.log has to be here..', courses);
      var courseIds = [];
      if (courses.length > 0){
        courseIds = courses.map(function(object) {
          return object.dataValues.CourseId;
        });
      }
      var courseObj = {
        courseIds: courseIds
      }
      res.json(courseObj);
    })
  },

  allCoursesForUser: function(req, res) {
    var uid = req.params.id;
    db.CourseUser.findAll({
      where: {
        UserId: uid
      }
    }).then(function(courses) {
      var courseIds = courses.map(function (obj) {
        return obj.CourseId;
      });
      var allCourses = {};
      allCourses.userCourseIds = courseIds;
      db.Course.findAll({
        where: {
          id: {
            $notIn: courseIds
          }
        }
      }).then(function (coursesNotIn) {
        allCourses.userNotIn = coursesNotIn;
        db.Course.findAll({
          where: {
            id: {
              $in: courseIds
            }
          }
        })
        .then(function (coursesIn) {
          allCourses.userIn = coursesIn;
          res.json(allCourses);
        });
      })

    });
  }
};
