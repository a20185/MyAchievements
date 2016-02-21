'use strict';
var isLogin = false;
var isRegister = false;
var isTA = false;
var isTeacher = false;
var currentUser = 'null';

/* Controllers */

function mainCtrl($scope) {
  $scope.currentUser = "Guest";
  $scope.showAuth = function() {
    if (currentUser != 'null') {
      $scope.currentUser = currentUser;
    }
    if (isLogin || isRegister) {
      return true;
    } else {
      return false;
    }
  }
  $scope.hello = function() {
    console.log('HELLO');
    console.log(isLogin);
  }
}

function TaCtrl($scope , $http , $location) {
  $scope.currentUser = currentUser;
  $scope.ass = [];
  $http.get('/api/assignments').
    success(function(data, status , headers , config) {
      $scope.ass = data.assignments;
      console.log('/** Successfully get Assignment Datas **/');
    });
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
      console.log("Date is: ");
      console.log(date);
      console.log("Start is :");
      console.log(timeStamp);
      console.log("End is :");
      console.log(finished);
      console.log($scope.ass[index]);
      if (date < timeStamp) {
        return "Coming";
      } else if (date <= finished) {
        return "Running";
      } else {
        return "Finished!";
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

function IndexCtrl($scope, $http , $location) {
  $http.get('/onlineStatus').
      success(function(data) {
        if (data.status == true) {
          isLogin = true;
          currentUser = data.username;
          if (data.isTeacher == true) {
            $location.path('/teacherIndex');
            isTeacher = true;
          } else if (data.isTA == true) {
            $location.path('/taindex');
            isTA = true;
          } else {
            $location.path('/assignments');
          }
        } else {
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
    $scope.count = 0;
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
        console.log("test::");
        console.log($scope.data[index].source[$routeParams.id]);
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
          console.log('data.why');
          if (data.status == true) {
            $location.path('/');
          }
        });
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

    $scope.getHref = function(index) {
      var x = '/commentAss/' + $routeParams.id + '/' + index + '/' + ($scope.data[index].source[$routeParams.id].submissions.length - 1);
      return x;
    };
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
  $scope.postJudge = function() {
    $http.post('/postJudge/' + $routeParams.id + '/' + $routeParams.studentId + '/' + $routeParams.subIndex, $scope.form).
      success(function(data) {
        $location.path('/taComment/' + $routeParams.id);
      });
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
function AssCtrl($scope , $http , $location) {
  $scope.ass = [];
  $http.get('/api/assignments').
    success(function(data, status , headers , config) {
      $scope.ass = data.assignments;
      console.log('/** Successfully get Assignment Datas **/');
    });
  $scope.haveSource = function(id) {
    if ($scope.ass[id].source.length <= 0) {
      return false;
    } else {
      return true;
    }
  };
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
      return "Coming.";
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
  }

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

function LogoutCtrl($scope , $http , $location) {
  $scope.logout = function() {
    $http.post('/logout' , {logout: "yes"}).
      success(function(data) {
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
        $window.alert(data.why);
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