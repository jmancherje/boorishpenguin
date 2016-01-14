angular.module('boorish.questions', [])

.controller('questionsController', function($scope, $location, $http, Questions, Auth, Courses) {
  $scope.questions = [];
  $scope.courses = [];
  $scope.userId = localStorage.getItem('com.boorish');
  $scope.listFilter = 'allQuestions';
  $scope.allCourses = [];


  $scope.createClass = function () {
    var courseObj = {name: $scope.newClass};
    $http.post('/townhall/courses', courseObj).success(function () {
      console.log('course added..');
      $scope.getAllCourses();
    });
  };

  $scope.createTag = function () {
    var tagObj = {name: $scope.newTag};
    $http.post('/townhall/tags', tagObj).success(function () {
      console.log('tag added..');
      $scope.getTags();
    });
  };

  $scope.filterQuestionsByClasses = function () {
    $scope.listFilter='myClasses';
    console.log('filtering..', $scope.questions);
    var questions = $scope.questions;
    $scope.userCourseQuestions = questions.reduce(function (array, question) {
      if ($scope.userCourseIds.indexOf(question.courseId) > -1) {
        array.push(question);
      }
      return array;
    }, []);
    // $scope.userCourseQuestions = questions.map(function (question) {
    //   if ($scope.userCourseIds.indexOf(question.courseId) > -1) {
    //     return question;
    //   }
    // });
    console.log('question for users courses: ', $scope.userCourseQuestions);
  };

  $scope.init = function() {

    $scope.getAllCourses = function () {
      Courses.getCourses().then(function (data) {
        console.log('get all courses: ', data);
        $scope.allCourses = data.results;
        // GET COURSES SPECIFIC FOR USER
        Courses.getUsersCourses($scope.userId).then(function(courseObj) {
          console.log(courseObj);
          // $scope.userCourses = courseObj.courses;
          $scope.userCourseIds = courseObj.courseIds;
          if ($scope.allCourses) {
            $scope.userCourses = $scope.allCourses.map(function (course) {
              if ($scope.userCourseIds.indexOf(course.id) > -1) {
                return course;
              }
            });
          }
        });
      });
    };
    // function for a user to join a course
    $scope.addToCourse = function (index) {
      console.log('all courses: ', $scope.allCourses);
      console.log('index of course: ', index);
      var course = $scope.allCourses[index];
      console.log('course: ', course);
      var id = course.id;
      $scope.userCourseIds.push(id);
      var associationObject = {
        UserId: +$scope.userId,
        CourseId: id
      };
      $http.post('/townhall/CourseUsers', associationObject)
        .success(function () {
          console.log('successful post to CourseUsers');
        });
    };

    $scope.getTags = function () {
      $http.get('/townhall/tags').success(function (data) {
        $scope.allTags = data.results;
      });
    };


    // GET ALL DATA
    Questions.getAllQuestions().then(function(data) {
      console.log('get all questions: ', data);
      $scope.questions = data.data.results;
      console.log('all questions: ', $scope.questions);
      
      $scope.getAllCourses();
      // get info for user after getting all questions
      // $scope.questions is default list of questions on main page
      // Courses.getAllCoursesForUser($scope.userId).then(function (data) {
      //   console.log('user course data: ', data);
      //   $scope.userCourseIds = data.userCourseIds;
      //   $scope.userInCourses = data.userIn;
      //   $scope.userNotInCourses = data.userNotIn;

      //   // get questions for classes user is in only
      //   // stored in %scope.userCourseQuestions
      //   // used for secondary view of questions ('My Classes')
      //   if ($scope.questions && $scope.userCourseIds) {
      //     $scope.userCourseQuestions = $scope.questions.reduce(function (array, question) {
      //       if ($scope.userCourseIds.indexOf(question.id)) {
      //         array.push(question);
      //       }
      //       return array;
      //     }, []);
      //     console.log('users course questions: ', $scope.userCourseQuestions);
      //   }
      // })
    });
    // get all tags and courses
    $scope.getTags();

  };


  //On initial reroute after Google Authentication Set the User
  Auth.setUser()
  .then(function(){
    // if user is not authenticated, reroute to /signin
    if (!Auth.isAuth()) {
      console.log("Failed isAuth check")
      $location.path('/signin') 
    // else show questions
    } else {
      $scope.init();
    }
  })

});