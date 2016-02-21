'use strict';
var isLogin = false;
var isRegister = false;
var isTA = false;
var isTeacher = false;
var currentUser = 'null';

/* Controllers */

function mainCtrl($scope , $http , $window) {
  $scope.currentUser = "Guest";
  $scope.identity = "";
  // if (isTA == true) {
  //   $scope.identity = "TA";
  // } else if (isTeacher == true) {
  //   $scope.identity = "Teacher";
  // } else {
  //   $scope.identity = "Student";
  // }
  // if ($window.localStorage) {
    // $window.alert("OKOK");
  // }
  $http.get('/onlineStatus').
    success(function(data) {
      if (status == true) {
        // $window.localStorage.isLogin = true;
        isLogin = true;
        // $window.localStorage.currentUser = data.username;
        currentUser = data.username;
        // $window.localStorage.isTA = data.isTA;
        isTA = data.isTA;
        // $window.localStorage.isTeacher = data.isTeacher;
        isTeacher = data.isTeacher;
        // if (isTA == true) {
        //   $scope.identity = "TA";
        // } else if (isTeacher == true) {
        //   $scope.identity = "Teacher";
        // } else {
        //   $scope.identity = "Student";
        // }
      } else {
        // $window.localStorage.isLogin = false;
        isLogin = false;

        // $window.localStorage.isRegister = false;
        isRegister = false;

        // $window.localStorage.isTA = false;
        isTA = false;

        // $window.localStorage.isTeacher = false;
        isTeacher = false;

        // $window.localStorage.currentUser = 'null';
        currentUser = 'null';
      }
    });
  $scope.getIdentity = function() {
    if (isTA == true) {
      return "TA";
    } else if (isTeacher == true) {
      return "Teacher";
    } else {
      return "Student";
    }
  };

  // $scope.getCurrentUser = function() {
  //   if ($window.localStorage.currentUser == 'null' || $window.localStorage.currentUser == 'Guest') {
  //     return "Guest";
  //     $window.alert($window.localStorage.currentUser);
  //   } else {
  //     return $window.localStorage.currentUser;
  //   }
  // }
  $scope.showAuth = function() {
    if (currentUser != 'null') {
      $scope.currentUser = currentUser;
    }
    if (isLogin == true || isRegister == true) {
      return true;
    } else {
      return false;
    }
  };
  $scope.hello = function() {
    console.log('HELLO');
    console.log(isLogin);
  };
}

function TaCtrl($scope , $http , $location) {
  $scope.currentUser = currentUser;
  $scope.ass = [];
  $http.get('/api/assignments').
    success(function(data, status , headers , config) {
      $scope.ass = data.assignments;
      console.log('/** Successfully get Assignment Datas **/');
    });
  $scope.getStatus = function(index) {
    var date = new Date();
    var str = date.getTime();
    if (str < parseInt($scope.ass[index].timeStamp)) {
      return "Coming";
    } else if (str <= parseInt($scope.ass[index].finished)) {
      return "Running";
    } else {
      return "Finished";
    }
  };
  $scope.getTimeMessage = function(index) {
    var starts = new Date($scope.ass[index].timeStamp);
    var ends = new Date($scope.ass[index].finished);
    if ($scope.getStatus(index) == "Coming") {
      var str = "Starts at:" + starts.toDateString() + " " + starts.toTimeString();
      return str;
    } else {
      var str = "Ends at:" + ends.toDateString() + " " + ends.toTimeString();
      return str;
    }
  };
}

function TeacherCtrl($scope , $http , $location) {
  $scope.currentUser = currentUser;
  $scope.ass = [];
  $scope.job = [];
  /**
   * Get All Assignments
   */
  $http.get('/api/assignments').
    success(function(data , status , headers , config) {
      $scope.ass = data.assignments;
      console.log("Successfully get all assignments Database");
    });

    $scope.getStatus = function(index) {
      var date = (new Date()).getTime();
      var timeStamp = parseInt($scope.ass[index].timeStamp);
      var finished = parseInt($scope.ass[index].finished);
      if (date < timeStamp) {
        return "Coming";
      } else if (date <= finished) {
        return "Running";
      } else {
        return "Finished!";
      }
    };

    $scope.getTimeMessage = function(index) {
      var starts = new Date($scope.ass[index].timeStamp);
      var ends = new Date($scope.ass[index].finished);
      if ($scope.getStatus(index) == "Coming") {
        var str = "Starts at: " + starts.toDateString() + " " + starts.toTimeString();
        return str;
      } else {
        var str = "Ends at: " + ends.toDateString() + " " + ends.toTimeString();
        return str;
      }
    };
  /**
   * 
   */
}

function PostAssCtrl($scope , $http , $location) {
    $scope.form = {};
    $scope.starts = {};
    $scope.start = {};
    var date = new Date();
    $scope.starts.year = date.getFullYear();
    $scope.starts.month = date.getMonth() + 1;
    $scope.starts.day = date.getDate();
    $scope.starts.hour = date.getHours();
    $scope.starts.minute = date.getMinutes();
    $scope.starts.second = date.getSeconds();
    $scope.getMsg = function() {
      if (!$scope.form.title || $scope.form.title == '') {
        return "Title is Required!";
      } else if (!$scope.form.description || $scope.form.description == '') {
        return "Description is Required!";
      } else if (!$scope.start.year || $scope.start.year == '') {
        return "Year is Required!";
      } else if (isNaN($scope.start.year)) {
        return "Year is A Integer!";
      } else if (parseInt($scope.start.year) < $scope.starts.year) {
        return "Year Must >= " + $scope.starts.year;
      } else if (!$scope.start.month || $scope.start.month == '') {
        return "month is Required!";
      } else if (isNaN($scope.start.month)) {
        return "month is A Integer!";
      } else if (!$scope.start.day || $scope.start.day == '') {
        return "day is Required!";
      } else if (isNaN($scope.start.day)) {
        return "day is A Integer!";
      } else if (!$scope.start.hour || $scope.start.hour == '') {
        return "hour is Required!";
      } else if (isNaN($scope.start.hour)) {
        return "hour is A Integer!";
      } else if (!$scope.start.minute || $scope.start.minute == '') {
        return "minute is Required!";
      } else if (isNaN($scope.start.minute)) {
        return "minute is A Integer!";
      } else if (!$scope.start.second || $scope.start.second == '') {
        return "second is Required!";
      } else if (isNaN($scope.start.second)) {
        return "second is A Integer!";
      } else {
        var one = date.getTime();
        var two = (new Date(parseInt($scope.start.year) , parseInt($scope.start.month - 1) , parseInt($scope.start.day) , parseInt($scope.start.hour) , parseInt($scope.start.minute) , parseInt($scope.start.second))).getTime();
        if (one > two) {
          return "You can't Use this time!";
        } else {
          return "OK";
        }
      }
    };
    $scope.canClick = function() {
      if ($scope.getMsg() == "OK") {
        return true;
      } else {
        return false;
      }
    };
    $scope.postAssignment = function() {
      var myDate = new Date(parseInt($scope.start.year) , parseInt($scope.start.month - 1) , parseInt($scope.start.day) , parseInt($scope.start.hour) , parseInt($scope.start.minute) , parseInt($scope.start.second));
      $scope.form.timeStamp = myDate.getTime();
      $scope.form.finished = $scope.form.timeStamp + (parseInt($scope.duration) * 86400000);
      console.log($scope.form.timeStamp);
      console.log($scope.form.finished);
      $http.post('/newAss' , $scope.form).
        success(function(data) {
          console.log(data.why);
          $location.path('/');
        });
    };
}

function IndexCtrl($scope, $http , $location , $window) {
  $http.get('/onlineStatus').
      success(function(data) {
        if (data.status == true) {
          // $window.localStorage.isLogin = true;
          isLogin = true;
          // $window.localStorage.currentUser = data.username;
          currentUser = data.username;
          if (data.isTeacher == true) {
            $location.path('/teacherIndex');
            // $window.localStorage.isTeacher = true;
            // $window.localStorage.isTA = false;
            isTeacher = true;
            isTA = false;
          } else if (data.isTA == true) {
            $location.path('/taindex');
            // $window.localStorage.isTA = true;
            // $window.localStorage.isTeacher = false;
            isTA = true;
            isTeacher = false;
          } else {
            $location.path('/assignments');
          }
        } else {
          // $window.localStorage.isLogin = false;
          // $window.localStorage.isRegister = false;
          // $window.localStorage.isTA = false;
          // $window.localStorage.isTeacher = false;
          // $window.localStorage.currentUser = 'null';
          isLogin = false;
          isRegister = false;
          isTA = false;
          isTeacher = false;
          currentUser = 'null';
          $location.path('/login');
        }
      });
  // if (isLogin == false && isRegister == false) {
  //   $location.path('/login');
  // } else {
  //   $location.path('/assignments');
  // }
}

function TaCommentCtrl($scope , $http , $location , $routeParams) {
    $scope.getIndex = function() {
      return $routeParams.id;
    };
    $scope.data = [];
    $scope.sends = [];
    $scope.count = 0;
    $scope.comment = false;

    $scope.sender = function() {
      // console.log("LALALA");
      $http.get('/api/sendComment/' + $routeParams.id).
        success(function(data) {
          // console.log("NONONO");
          $scope.sends = data.sends;
          $scope.comment = true;
        });
    };

    $scope.showHide = function() {
      if ($scope.comment == true) {
        return true;
      } else {
        return false;
      }
    };
    $scope.getJudgeList = function() {
      $scope.comment = false;
    }
    $http.get('/getTACount/' + $routeParams.id).
      success(function(data) {
        if (data.count) $scope.count = data.count;
      });
    $http.get('/getJudgeStudents').
      success(function(data) {
        $scope.data = data.judgeStudents;
      });
    $scope.getLength = function(index) {
      if (!$scope.data[index].source[$routeParams.id]) {
        return false;
      } else {
        return true;
      }
    };
    $scope.getLocation = function(index) {
      if ($scope.getLength(index)) {
        // console.log("test::");
        // console.log($scope.data[index].source[$routeParams.id]);
        return $scope.data[index].source[$routeParams.id].submissions[$scope.data[index].source[$routeParams.id].submissions.length - 1];
      } else {
        return "Error";
      }
    };

    $scope.haveGithub = function(index) {
      if (!$scope.getLength(index) || !$scope.data[index].source[$routeParams.id].github || $scope.data[index].source[$routeParams.id].github == '#') {
        return false;
      } else {
        return true;
      }
    };

    $scope.getSort = function() {
      $http.get('/sortByTA/' + $routeParams.id).
        success(function(data){
          // console.log('data.why');
          if (data.status == true) {
            $location.path('/');
          }
        });
    };

    $scope.haveAGithub = function(sends) {
      if (!sends.receiverGithub || sends.receiverGithub == '#') {
        return false;
      } else {
        return true;
      }
    };
    $scope.getGithub = function(index) {
      if ($scope.haveGithub(index)) {
        return $scope.data[index].source[$routeParams.id].github;
      } else {
        return "NO Github!";
      }
    };

    $scope.getName = function(index) {
      var x = $scope.getLocation(index);
      if (x != "Error") {
        var t = x.lastIndexOf('/');
        return x.substring(t + 1);
      } else {
        return x;
      }
    };

    $scope.neverJudged = function(index) {
      if (!$scope.getLength(index)) {
        return true;
      } else if (!$scope.data[index].source[$routeParams.id].judged) {
        return true;
      } else {
        return false;
      }
    };

    $scope.getTime = function(timeStamp) {
      if (timeStamp) {
        var date = new Date(timeStamp);
        var str = date.toDateString() + date.toTimeString();
        return str;
      } else {
        return "Invalid Time";
      }
    };

    $scope.getHref = function(index) {
      var x = '/commentAss/' + $routeParams.id + '/' + index + '/' + ($scope.data[index].source[$routeParams.id].submissions.length - 1);
      return x;
    };

    // $scope.getSendComment = function(index) {

    // }
}

function JudgeCtrl($scope , $http , $location , $routeParams) {
  $scope.student = $routeParams.studentId;
  $scope.assName = $routeParams.id;
  $scope.submission = $routeParams.subIndex;
  console.log($scope.student);
  console.log($scope.assName);
  console.log($scope.submission);
  $scope.form = {};
  $scope.form.subId = $scope.submission;
  $scope.warningMsg = '';
  $scope.getMsg = function() {
    if (!$scope.form.title || $scope.form.title == '') {
      return "Title is Required!";
    } else if (!$scope.form.body || $scope.form.body == '') {
      return "Body is Required!";
    } else if (!$scope.form.score || $scope.form.score == '') {
      return "Score is Required!";
    } else if (isNaN($scope.form.score)) {
      return "Score is A Integer!";
    } else if (parseInt($scope.form.score) < 0) {
      return "Score Must > 0";
    } else if (parseInt($scope.form.score) > 100) {
      return "Score Must < 100";
    } else {
      return "OK";
    }
  };
  $scope.canClick = function() {
    if ($scope.getMsg() == 'OK') {
      return true;
    } else {
      return false;
    }
  };
  $scope.postJudge = function() {
    $http.post('/postJudge/' + $routeParams.id + '/' + $routeParams.studentId + '/' + $routeParams.subIndex, $scope.form).
      success(function(data) {
        $location.path('/taComment/' + $routeParams.id);
      });
  };
}

function RejudgeCtrl($scope , $http , $location , $routeParams) {
  $scope.name = 14331000 + parseInt($routeParams.studentId);
  $scope.number = parseInt($routeParams.id) + 1;
  $scope.form = {};
  $scope.reJudge = function() {
    $http.post('/rejudge/' + $routeParams.id + '/' + $routeParams.studentId , $scope.form)
      .success(function(data) {
        if (data.status == true) $location.path('/teacherComment/' + $routeParams.id);
      });
  };
  $scope.getMsg = function() {
    if (!$scope.form.title || $scope.form.title == '') {
      return "Title is Required!";
    } else if (!$scope.form.body || $scope.form.body == '') {
      return "Body is Required!";
    } else if (!$scope.form.score || $scope.form.score == '') {
      return "Score is Required!";
    } else if (isNaN($scope.form.score)) {
      return "Score is A Integer!";
    } else if (parseInt($scope.form.score) < 0) {
      return "Score Must > 0";
    } else if (parseInt($scope.form.score) > 100) {
      return "Score Must < 100";
    } else {
      return "OK";
    }
  };
  $scope.canClick = function() {
    if ($scope.getMsg() == 'OK') {
      return true;
    } else {
      return false;
    }
  };
}

function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPost = function () {
    $http.post('/api/post', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}


function LoginCtrl($scope, $http, $location , $window) {
  console.log("Login");
  $scope.form = {};
  $scope.warning = {};
  console.log($scope.form);
  console.log($scope.warning);
  $scope.getLogin = function() {
      console.log('Button Clicked!');
      console.log($scope.form.username);
      console.log($scope.form.passwd);
      $http.post('/api/login' , $scope.form).
        success(function(data) {
          console.log(data);
          if (data.status == true) {
            isLogin = true;
            currentUser = data.user;
            $location.path('/');
          } else {
            $window.alert(data.why);
            // $scope.warning.user = 'Login Failed!';
          }
      });
  };
  $scope.validate = {user: false , passwd : false};
  $scope.userCheck = function() {
    $scope.validate.user = false;
    if (!$scope.form.username) {
      return '';
    } else if ($scope.form.username == '') {
      return '请输入用户名';
    } else if ($scope.form.username.length < 8) {
      return '用户名太短(至少8位)';
    } else if ($scope.form.username.length > 8) {
      return '用户名太长(至多8位)';
    } else {
      var pattern = /\b(^['0-9]{8}$)\b/;
      if (pattern.test($scope.form.username)) {
        $scope.validate.user = true;
        return 'OK!';
      } else {
        return '用户名应用ID No.';
      }
    }
  };

  $scope.passCheck = function() {
    $scope.validate.passwd = false;
    if (!$scope.form.passwd) {
      return '';
    } else if ($scope.form.passwd == '') {
      return '请输入密码';
    } else if ($scope.form.passwd.length < 6) {
      return '密码太短(至少6位)';
    } else if ($scope.form.passwd.length > 12) {
      return '密码太长(至多12位)';
    } else {
      $scope.validate.passwd = true;
      return 'OK!';
    }
  };

  $scope.canClick = function() {
    if ($scope.validate.passwd && $scope.validate.user) {
      return true;
    } else {
      return false;
    }
  };
}


// Read Assignment Data
function AssCtrl($scope , $http , $location , $window) {
  $scope.ass = [];
  $scope.availableNum = 0;
  $scope.judging = 0;
  $scope.completed = 0;
  $scope.coming = 0;
  $http.get('/api/assignments').
    success(function(data, status , headers , config) {
      $scope.ass = data.assignments;
      for (var i = 0 ; i < $scope.ass.length ; i++) {
        if ($scope.getStatus(i) == "Running") {
          $scope.availableNum++;
          if ($scope.ass[i].source.length != 0) {
            $scope.judging++;
          }
        } else if ($scope.getStatus(i) == "Coming") {
          $scope.coming++;
        } else {
          $scope.completed++;
        }
      }
      console.log('/** Successfully get Assignment Datas **/');
    });
  $scope.haveSource = function(id) {
    if ($scope.ass[id].source.length <= 0) {
      return false;
    } else {
      return true;
    }
  };
  $scope.getAvailable = function() {
    return $scope.availableNum;
  };

  $scope.getJudging = function() {
    return $scope.judging;
  };

  $scope.getCompleted = function() {
    return $scope.completed;
  };

  $scope.getComing = function() {
    return $scope.coming;
  }

  $scope.available = function(index) {
    if ($scope.getStatus(index) == "Running") {
      return true;
    } else {
      return false;
    }
  };

  $scope.getPosition = function(index) {
    if ($scope.ass[index].position != '-1') {
      return $scope.ass[index].position;
    } else {
      return 'No Rank';
    }
  };

  $scope.getScore = function(index) {
    if ($scope.ass[index].taComment.length > 0) {
      return $scope.ass[index].taComment[0].score;
    } else {
      return "No Score";
    }
  };

  $scope.getRank = function(index) {
    if ($scope.ass[index].rank != '-1') {
      return $scope.ass[index].rank;
    } else {
      return 'No Rank';
    }
  };

  $scope.getSource = function(id) {
    if(!$scope.haveSource(id)) {
      return "#";
    } else {
      return $scope.ass[id].source[$scope.ass[id].source.length - 1];
    }
  };
  var date = (new Date()).getTime();
  $scope.getStatus = function(index) {
    if (date < parseInt($scope.ass[index].timeStamp)) {
      return "Coming";
    } else if (date <= parseInt($scope.ass[index].finished)) {
      return "Running";
    } else {
      return "Finished";
    }
  };

  $scope.getGithub = function(index) {
    return $scope.ass[index].github;
  };

  $scope.haveGithub = function(index) {
    if (!$scope.ass[index].github || $scope.ass[index].github == '#') {
      return false;
    } else {
      return true;
    }
  };

  $scope.getTimeMessage = function(index) {
    var starts = new Date($scope.ass[index].timeStamp);
    var ends = new Date($scope.ass[index].finished);
    if ($scope.getStatus(index) == "Coming") {
      var str = "Starts at: " + starts.toDateString() + " " + starts.toTimeString();
      return str;
    } else {
      var str = "Ends at: " + ends.toDateString() + " " + ends.toTimeString();
      return str;
    }
  };

}

function UploadCtrl($scope , $http , $location , $routeParams) {
  // $scope.getSync = function() {
    $scope.id = $routeParams.id;
  // }
}


function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });
}

function CommentCtrl($scope , $http , $location , $routeParams) {
    $scope.assname = ($routeParams.id + 1);
    $scope.send = false;
    $scope.recv = false;
    $scope.ta = false;
    $scope.sends = [];
    $scope.recvs = [];
    $scope.tas = [];
    $scope.getAss = function() {
      return $routeParams.id;
    };
    $scope.tata = function() {
      if ($scope.ta == true) return true;
      else return false;
    }
    $scope.sent = function() {
      if ($scope.send == true) return true;
      else return false;
    };
    $scope.recd = function() {
      if ($scope.recv == true) return true;
      else return false;
    };

    $scope.haveTAComment = function() {
      if (!$scope.taComment || $scope.taComment.length == 0) {
        return false;
      } else {
        return true;
      }
    };

    $scope.sendComments = function() {
        $http.get('/api/sendComment/' + $routeParams.id).
            success(function(data) {
              $scope.sends = data.sends;
              $scope.send = true;
              $scope.recv = false;
              $scope.ta = false;
            });
    };

    $scope.recvComments = function() {
        $http.get('/api/recvComment/' + $routeParams.id).
          success(function(data) {
            $scope.recvs = data.recvs;
            $scope.send = false;
            $scope.recv = true;
            $scope.ta = false;
          });
    };

    $scope.getScore = function() {
      $http.get('/api/score/' + $routeParams.id).
        success(function(data) {
          $scope.taComment = data.comment;
          $scope.ta = true;
          $scope.send = false;
          $scope.recv = false;
        });
    };

    $scope.getTime = function(timeStamp) {
      var x = new Date(parseInt(timeStamp));
      return x.toDateString() + " " + x.toTimeString();
    };

    $scope.haveGithub = function(comment) {
      if (!comment.receiverGithub || comment.receiverGithub == '#') {
        return false;
      } else {
        return true;
      }
    };
    $scope.getName = function(path) {
      var t = path.lastIndexOf('/');
      console.log(t);
      console.log(path);
      return path.substring(t + 1);
    }

    $scope.editBefore = function(score) {
      if (score == "-1") {
        return false;
      } else {
        return true;
      }
    };

    // $scope.getFileName = function(id , ass) {
    //     $http.get('/api/getFile/' + id + '/' + ass)
    // };
}


function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

function LogoutCtrl($scope , $http , $location , $window) {
  // $window.alert($window.localStorage.currentUser);
  $scope.logout = function() {
    $http.post('/logout' , {logout: "yes"}).
      success(function(data) {
        // $window.localStorage.currentUser = 'null';
        // $window.localStorage.isTA = false;
        // $window.localStorage.isTeacher = false;
        // $window.localStorage.isLogin = false;
        // $window.localStorage.isRegister = false;
        $location.url('/');
      });
  };
  $scope.home = function() {
    $location.url('/');
  };
}

function SendCtrl($scope , $http , $routeParams , $location) {
    $scope.form = {};
    $scope.comment = {};
    $http.get('/api/getValue').
      success(function(data) {
        $scope.comment = data.comment;
        console.log(data.why);
      });
    $scope.getMsg = function() {
      if (!$scope.form.title || $scope.form.title == '') {
        return "Title is Required!";
      } else if (!$scope.form.body || $scope.form.body == '') {
        return "Body is Required!";
      } else if (!$scope.form.score || $scope.form.score == '') {
        return "Score is Required!";
      } else if (isNaN($scope.form.score)) {
        return "Score is A Integer!";
      } else if (parseInt($scope.form.score) < 0) {
        return "Score Must > 0";
      } else if (parseInt($scope.form.score) > 100) {
        return "Score Must < 100";
      } else {
        return "OK";
      }
    };

    $scope.canClick = function() {
      if ($scope.getMsg() == "OK") {
        return true;
      } else {
        return false;
      }
    };
    $scope.modify = function() {
      console.log($scope.form);
      $http.post('/api/send/' + $routeParams.id + '/' + $routeParams.commentId , $scope.form).
        success(function(data) {
          console.log(data.why);
          $location.url('/comment/' + $routeParams.id);
        });
    };
}

function RegisterCtrl($scope , $http , $location , $routeParams , $window) {
  $scope.initTask = function() {
    $http.get('/initTask').
      success(function(data) {
        $window.alert(data.why);
        // $location.url('/');
      });
  };
  $scope.initUsers = function() {
    $http.get('/makegroup').
      success(function(data) {
        $window.alert(data.why);
      });
  };
  $scope.initSys = function() {
    $http.get('/inits').
      success(function(data) {
        $location.path('/');
      });
  };
}

function TeacherCommentCtrl($scope , $http , $location , $routeParams) {
  $scope.count = 0;
  $scope.data = [];
  $http.get('/teachers').
    success(function(data) {
      $scope.data = data.judgeStudents;
    });

  $scope.sortStudents = function() {
    $http.get('/sortByTeacher/' + $routeParams.id).
      success(function(data) {
        if (data.status == true) $location.path('/');
      });
  };

  $scope.taJudged = function(index) {
    if(!$scope.data[index].source || !$scope.data[index].source[$routeParams.id]) {
      return false;
    } else if (!$scope.data[index].source[$routeParams.id].tajudged) {
      return false;
    } else {
      return true;
    }
  };

  $scope.rejudge = function(index) {
    return '/rejudge/' + $routeParams.id + '/' + index;
  }

  $scope.getScore = function(index) {
    if (!$scope.data[index].source[$routeParams.id].tascore) {
      return 0;
    } else {
      return $scope.data[index].source[$routeParams.id].tascore;
    }
  };

  $scope.getSource = function(index) {
    if (!$scope.data[index].source[$routeParams.id] || $scope.data[index].source[$routeParams.id].length == 0) {
      return '/';
    } else {
      return $scope.data[index].source[$routeParams.id].submissions[$scope.data[index].source[$routeParams.id].submissions.length - 1];
    }
  };

  $scope.haveGithub = function(index) {
    if (!$scope.data[index].source[$routeParams.id].github || $scope.data[index].source[$routeParams.id].github == '#') {
      return false;
    } else {
      return true;
    }
  };

  $scope.getGithub = function(index) {
    if (!$scope.haveGithub(index)) {
      return '/';
    } else {
      return $scope.data[index].source[$routeParams.id].github;
    }
  };

}