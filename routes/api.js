var crypto = require('crypto');
var fs = require('fs');

// var data = {
//   "posts": [
//     {
//       "title": "Lorem ipsum",
//       "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
//     },
//     {
//       "title": "Sed egestas",
//       "text": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
//     }
//   ]
// };

/**
 * [job description] Assignment model
 * @type {Object}
 */
var jobMode = {
  "jobs" : [
      {
        "index":"0",
        "title" : "Recipe",
        "refer": "http://my.ss.sysu.edu.cn/wiki/display/WEB/Homework+1+-+Recipe",
        // "start": "0",
        // "judge": "1000",
        // "end": "2000",
        "available": true
      },
      {
        "index":"1",
        "title" : "Movie Review",
        "refer": "http://my.ss.sysu.edu.cn/wiki/display/WEB/Homework+2+-+Movie+Review",
        // "start": "0",
        // "judge": "1000",
        // "end": "2000",
        "available": true
      }
  ],
  "starts" : 1
};

var CommentMode = {
    "comments" : [
        {
          "index" : 0,
          "jobIndex": jobMode.jobs[0].index,
          "title": "Good",
          "timeStamp": "none",
          "body": "It looks really Brilliant!",
          "senderId": "14331219",
          "senderName": "Maxwell Ou",
          "senderGroup": 1,
          "receiverId" : "14331279",
          "receiverName": "God Wen",
          "receiverGroup": 2,
          "receiverSource": '',
          "score": 100
        },
        {
          "index" : 1,
          "jobIndex": jobMode.jobs[0].index,
          "title":  "Awful!",
          "body": "It looks so stupid!",
          "senderId": "14331239",
          "senderName": "Nobody",
          "senderGroup": 1,
          "receiverId" : "14331279",
          "receiverName": "God Wen",
          "receiverGroup": 2,
          "receiverSource": '',
          "timeStamp": "none",
          "score": 60
        }
    ]
};


/**
 * [assMode description] Assignment Model
 * @type {Object}
 * Includes Job
 * and Comment Post and review , Rank and Upload File
 *
 */
var assMode = {
  "assignments" : [],
  "index": 1
};

var subMode = {
    "index": 0,
    "submissions": [
        {
            "index": 0,
            "icon": '#',
            "fileLoc": '#'
        },
        {
            "index": 1,
            "icon": '#',
            "fileLoc": '#'
        }
    ]
};

var groupMode = {
    "groups" : [],
    "index" : 1
};

var stuMode = {
  "students": [],
  "index": 1
};

var taMode = {
  "tas": [],
  "index": 2
};

var teacherMode = {
  "teachers": [],
  "index": 3
}



// GET

exports.posts = function (req, res) {
  var posts = [];
  data.posts.forEach(function (post, i) {
    posts.push({
      id: i,
      title: post.title,
      text: post.text.substr(0, 50) + '...'
    });
  });
  res.json({
    posts: posts
  });
};

exports.post = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.posts.length) {
    res.json({
      post: data.posts[id]
    });
  } else {
    res.json(false);
  }
};

// POST

exports.addPost = function (req, res) {
  data.posts.push(req.body);
  res.json(req.body);
};

// PUT

exports.initTask = function(req , res , next) {
    var Job = global.dbHandle.getModel('job');
    var Jobs = global.dbHandle.getModel('jobs');
    var Assignments = global.dbHandle.getModel('assignments');
    Jobs.create({
      jobPool: jobMode.jobs,
      index: jobMode.starts
    } , function(err , doc) {
      if (err) {
        res.json({
          status: false,
          why: "Init Task Failed!"
        });
      } else {
        var date = (new Date()).getTime();
        var endDate = date + 604800000;
        for (var i = 0 ; i < jobMode.jobs.length ; i++) {
          assMode.assignments.push({
            "index": i,
            "job" : jobMode.jobs[i],
            "recvComment": [],
            "sendComment": [],
            "assessGroup": "-1",
            "taComment": [],
            "rank": "-1",
            "position": "-1",
            "timeStamp": date,
            "finished": endDate,
            "scorelist": [],
            "ended": false,
            "source": [],
            "github": "#"
          });
        }
        Assignments.create({
          assPool: assMode.assignments,
          index: assMode.index
        } , function(err , doc) {
          if (err) {
            console.log("Assign Failed");
            console.log(err);
          } else {
            console.log("Assign Success!");
            res.json({
              status: true,
              why: "Create Successfully!",
              data: doc
            });
          }
        });
      }
    });
};

exports.initUsers = function(req , res , next) {
    /**
     * [for description] Create Local Groups
     * @param  {[type]} var i             [description]
     * @return {[type]}     [description]
     */
    for (var i = 0 ; i < 100 ; i++) {
      (function(i) {
        groupMode.groups.push({
        "index": i,
        "students": [],
        "matchingGroup": [],
        "bematchGroup": [],
        "correspondTA": [],
      });
      })(i);
    }

    /**
     * [for description] Create Local Students
     * @param  {[type]} var i             [description]
     * @return {[type]}     [description]
     */
    for (var i = 1000 ; i < 2000 ; i++) {
      (function(i) {
      var md5 = crypto.createHash('md5');
      var username = 1433 + "" + i;
      var myPasswd = md5.update(username).digest('hex');
      stuMode.students.push({
        "username": username,
        "password": myPasswd,
        "stuName": "noname",
        "isTA": false,
        "isTeacher": false,
        "isAdmin": false,
        "stuGroup": -1,
        "taindex": 0,
        "judgeGroup": [-1],
        "judgeStudents": [-1],
        "correspondTA": "-1",
        "stuScore": [-1],
        "stuRank": [-1],
        "assignments":assMode.assignments
      });
    })(i);
  }

    for (var i = 1000 ; i < 1050 ; i++) {
      (function(i) {
        var md5 = crypto.createHash('md5');
        var username = 1333 + "" + i;
        var myPasswd = md5.update(username).digest('hex');
        taMode.tas.push({
        "username": username,
        "password": myPasswd,
        "stuName": "TA",
        "isTA": true,
        "isTeacher": false,
        "isAdmin": false,
        "taindex": 0,
        "judgeGroup": [],
        "judgeStudents": [],
        "correspondTA": "-1",
        "stuGroup": -1,
        "stuScore": [-1],
        "stuRank": [-1],
        "assignments":assMode.assignments
        });
      })(i);
    }

    /**
     * Create Teachers
     * @param  {[type]} teacherNo [description]
     * @return {[type]}           [description]
     */
    (function(teacherNo) {
      var md5 = crypto.createHash('md5');
      var username = teacherNo;
      var myPasswd = md5.update(username).digest('hex');
      teacherMode.teachers.push({
        "username": username,
        "password": myPasswd,
        "stuName": "Teacher",
        "isTA": false,
        "isTeacher": true,
        "isAdmin": false,
        "taindex": 0,
        "judgeGroup": [-1],
        "judgeStudents": [],
        "correspondTA": "-1",
        "stuGroup": -1,
        "stuScore": [-1],
        "stuRank": [-1],
        "assignments":assMode.assignments
      })
    })('11111111');
};

exports.getta = function(req , res , next) {
  if (req.session.user) {
    res.json({
      status: true,
      why: "Get TA Count Successfully!",
      count: req.session.user.assignments[req.params.id].scorelist.length
    });
  } else {
    res.json({
      status: false,
      why: "Please Login First!"
    });
  }
};

exports.initSys = function(req , res , next) {
    for (var i = 0 ; i < 1000 ; i++) {
      (function(index) {
        teacherMode.teachers[0].judgeStudents.push({
            "index" : index,
            "id" : stuMode.students[index].username,
            "source": []
        });
      })(i);
    }

    /**
     * [description] Shuffle Students and Groups for Grouping
     * @param  {[type]} ){return Math.random() > 0.5 ? -1 : 1;} [description]
     * @return {[type]}           [description]
     */
    stuMode.students.sort(function(){return Math.random() > 0.5 ? -1 : 1;});
    groupMode.groups.sort(function(){return Math.random() > 0.5 ? -1 : 1;});

    // Pair Students and groups
    for (var i = 0 ; i < 100 ; i++) {
      for (var ii = 0 ; ii < 10 ; ii++) {
        // Group in students
        groupMode.groups[i].students.push(
          stuMode.students[i * 10 + ii].username);
        // Students in Group
        stuMode.students[i * 10 + ii].stuGroup = groupMode.groups[i].index;
      }
    }


    // Make Assessment Group Pairs (not except for the self-assignments)
    for (var i = 0 ; i < 1000 ; i++) {
      groupMode.groups[0].matchingGroup.push(groupMode.groups[99].index);
      groupMode.groups[99].bematchGroup.push(groupMode.groups[0].index);
      for (var ii = 1 ; ii < 100 ; ii++) {
        (function(ii) {
          groupMode.groups[ii].matchingGroup.push(groupMode.groups[ii - 1].index);
          groupMode.groups[ii - 1].bematchGroup.push(groupMode.groups[ii].index);
        })(ii);
      }
        /**
         *
         * Method 2: Pair of  2-way Binding
         */
        // groupMode.groups[ii].matchingGroup[0] = groupMode.groups[100 - 1 - ii].index;
        // groupMode.groups[100 - 1 - ii].matchingGroup[0] = groupMode.groups[ii].index;
      groupMode.groups.sort(function(){return Math.random() > 0.5 ? -1 : 1;});
      // taMode.tas.sort(function() {return Math.random() > 0.5 ? -1 : 1;});
    }

    // res.redirect('/');

    // Make TAS and Groups Students;
    for (var j = 0 ; j < 50 ; j++) {
            (function(j) {
              for (var jj = 0 ; jj < 2 ; jj++) {
                (function(j , jj) {
                  groupMode.groups[j * 2 + jj].correspondTA.push(taMode.tas[j]);
                  taMode.tas[j].judgeGroup.push(groupMode.groups[j * 2 + jj].index);
                  teacherMode.teachers[0].judgeGroup.push(groupMode.groups[j * 2 + jj].index);
                })(j , jj);
              }
              // taMode.tas[j].judgeGroup.push(test);
          })(j);
    }

    for (var k = 0 ; k < 50 ; k++) {
      for (var kk = 0 ; kk < 20 ; kk++) {
        (function(first , second){
          taMode.tas[first].judgeStudents.push({
            "index" : second,
            "id" : stuMode.students[first * 20 + second].username,
            "source": []
          });
          // teacherMode.teachers[0].judgeStudents.push({
          //   "index" : first * 20 + second,
          //   "id" : stuMode.students[first * 20 + second].username,
          //   "source": []
          // });
          stuMode.students[first * 20 + second].correspondTA = taMode.tas[first].username;
          stuMode.students[first * 20 + second].taindex = second;
        })(k , kk);
      }
    }

    res.json({
      status: true,
      why: "Please Wait a Little Bit"
    });

    /**
     * [Group description] Create Database Structure for Groups.
     * @type {[type]}
     */
    var Group = global.dbHandle.getModel('group');
    for (var i = 0 ; i < 100 ; i++) {
      (function(group) {
        Group.create({
          index: group.index,
          students: group.students,
          matchingGroup: group.matchingGroup,
          bematchGroup: group.bematchGroup,
          correspondTA: group.correspondTA
        } , function(err , doc) {
          if (err) {
            console.log("Error: Create Group Failed!");
          } else {
            console.log("Success: Create Group [" + doc.index + "] Successfully!");
          }
        });
      })(groupMode.groups[i]);
    }

    /**
     * Create Database Structure for students
     */
     var Students = global.dbHandle.getModel('user');
     for (var ii = 0 ; ii < 1000 ; ii++) {
        (function(student) {
          Students.create({
            username: student.username,
            password: student.password,
            stuName: student.stuName,
            stuGroup: student.stuGroup,
            stuScore: student.stuScore,
            stuRank: student.stuRank,
            judgeGroup: student.judgeGroup,
            judgeStudents: student.judgeStudents,
            correspondTA: student.correspondTA,
            isTA: student.isTA,
            taindex: student.taindex,
            isTeacher: student.isTeacher,
            isAdmin: student.isAdmin,
            assignments: student.assignments
          } , function(err , doc) {
            if (err) {
              console.log("Warning: Create Student failed!");
              console.log(err);
            } else {
              console.log("SUCCESS: Create Student [" + doc.username + "] successfully!");
            }
          });
        })(stuMode.students[ii]);
     }

     for (var ii = 0 ; ii < 50 ; ii++) {
      (function(ta){
        Students.create({
          username: ta.username,
          password: ta.password,
          stuName: ta.stuName,
          stuGroup: ta.stuGroup,
          stuScore: ta.stuScore,
          taindex: ta.taindex,
          stuRank: ta.stuRank,
          judgeGroup: ta.judgeGroup,
          judgeStudents: ta.judgeStudents,
          correspondTA: ta.correspondTA,
          isTA: ta.isTA,
          isTeacher: ta.isTeacher,
          isAdmin: ta.isAdmin,
          assignments: ta.assignments
        } , function(err , doc) {
          if (err) {
            console.log("Warning: Create TA failed.");
            console.log(err);
          } else {
            console.log("Success: Create TA [" + doc.username + "] Successfully!");
          }
        });
      })(taMode.tas[ii]);
     }

     /**
      * Create Teachers
      * @param  {[type]} teacher [description]
      * @return {[type]}         [description]
      */
     (function(teacher) {
       Students.create({
            username: teacher.username,
            password: teacher.password,
            stuName: teacher.stuName,
            stuGroup: teacher.stuGroup,
            stuScore: teacher.stuScore,
            taindex: teacher.taindex,
            stuRank: teacher.stuRank,
            judgeGroup: teacher.judgeGroup,
            judgeStudents: teacher.judgeStudents,
            correspondTA: teacher.correspondTA,
            isTA: teacher.isTA,
            isTeacher: teacher.isTeacher,
            isAdmin: teacher.isAdmin,
            assignments: teacher.assignments
          } , function(err , doc) {
            if (err) {
              console.log("Warning: Create Teacher failed.");
              console.log(err);
            } else {
              console.log("Success: Create Teacher [" + doc.username + "] Successfully!");
            }
          });
     })(teacherMode.teachers[0]);
};

exports.newAss = function(req , res , next) {
    var Users = global.dbHandle.getModel('user');
    /**
     * Make Assignment Models
     */
    var newJob = {
      "index": req.session.user.assignments.length,
      "title": req.body.title,
      "refer": req.body.description,
      "available": true
    };
    var toBePushed = {
      "index": req.session.user.assignments.length,
      "job" : newJob,
      "recvComment": [],
      "sendComment": [],
      "assessGroup": "-1",
      "taComment": [],
      "rank": "-1",
      "position": "-1",
      "timeStamp": req.body.timeStamp,
      "finished": req.body.finished,
      "ended": false,
      "source": [],
      "github": "#",
      "scorelist": []
    };
    /**
     * Update Teacher's Session
     */
    req.session.user.assignments.push(toBePushed);
    /**
     * Update Teacher's Database
     */
    Users.findOneAndUpdate({username: req.session.user.username} , {
      assignments: req.session.user.assignments
    } , function(err , doc) {
      if (err) {
        console.log(err);
        console.log("Update Teacher's Database Failed!");
        res.json({
          status: false,
          why: "Update Teacher's DataBase failed!"
        })
      } else {
        console.log("Update Teacher database Successfully!");
        res.json({
          status: true,
          why: "Update Teacher Database Successfully!"
        });
      }
    });

    /**
     * Update Student's Database
     */
    for (var i = 1000 ; i < 2000 ; i++) {
      (function(index){
        var studentIndex = '1433' + '' + i;
        Users.findOne({username: studentIndex} , function(err , doc) {
          if (err) {
            console.log("Find Student *" + studentIndex + "* failed!");
          } else {
            var x = doc.assignments;
            x.push(toBePushed);
            Users.findOneAndUpdate({username: doc.username} , {
              assignments: x
            } , function(err , doc) {
              if (err) {
                console.log("Update Student *" + studentIndex + "* failed!");
              } else {
                console.log("Update Student [" + doc.username + "] successfully!");
              }
            });
          }
        });
      })(i);
    }

    /**
     * Update TA's Database
     */

    for (var i = 1000 ; i < 1050 ; i++) {
      (function(index) {
        var taIndex = '1333' + '' + i;
        Users.findOne({username: taIndex} , function(err , doc) {
          if (err) {
            console.log("Find TA *" + taIndex + "* faild!");
          } else {
            var x = doc.assignments;
            x.push(toBePushed);
            Users.findOneAndUpdate({username: doc.username} , {assignments: x} , function(err , doc) {
              if (err) {
                console.log("Update TA *" + taIndex + "* failed");
              } else {
                console.log("Update TA *" + doc.username + "* successfully!");
              }
            });
          }
        });
      })(i);
    }

};


exports.rejudge = function(req , res , next) {
    /**
     * Step 1 : Modify Teacher's Session Storage of TA-Score
     *         And Sync to his Database
     */
    req.session.user.judgeStudents[req.params.studentId].source[req.params.id].tascore = req.body.score;
    var newIndex = parseInt(req.params.studentId) + 14331000;
    for (var i = 0 ; i < 1000 ; i++) {
      if (req.session.user.assignments[req.params.id].scorelist[i].username == newIndex) {
        req.session.user.assignments[req.params.id].scorelist[i].score = req.body.score;
        break;
      }
    }

    var Users = global.dbHandle.getModel('user');
    Users.findOneAndUpdate({username: req.session.username} , {
      assignments: req.session.user.assignments,
      judgeStudents: req.session.user.judgeStudents
    } , function(err , doc) {
      if (err) {
        console.log(err);
        res.json({
          status: false,
          why: "Update Teacher Database Failed!",
        });
      } else {
        console.log("Updata Teacher Database Success!");
        res.json({
          status: true,
          why: "Update Teacher Databses Successfully!"
        });
      }
    });


    /**
     * Step 2: Modify Student's ScoreList Records
     */
    Users.findOne({username: (newIndex + '')} , function(err , doc) {
      if (err) {
        console.log(err);
      } else {
        console.log(doc.username);
        var x = doc.assignments;
        var newTimeStamp = (new Date()).getTime();
        x[req.params.id].taComment[0].title = req.body.title;
        x[req.params.id].taComment[0].body = req.body.body;
        x[req.params.id].taComment[0].score = req.body.score;
        x[req.params.id].taComment[0].timeStamp = newTimeStamp;
        console.log(x[req.params.id].taComment);
        Users.findOneAndUpdate({username: doc.username} , {assignments: x} , function(err , doc) {
          if (err) {
            console.log(err);
          } else {
            console.log("Update Student's Database Success!");
           /**
            * Step 3: Modify TA's ScoreList Record
            */
            var myTAindex = doc.taindex;
            var myName = doc.username;
            console.log(myTAindex);
            console.log(myName);
            Users.findOne({username: doc.correspondTA} , function(err , doc) {
              if (err) {
                console.log(err);
              } else {
                var xx = doc.judgeStudents;
                // var yy = doc.sendComments;
                var zz = doc.assignments;
                xx[myTAindex].source[req.params.id].tascore = req.body.score;
                for (var i = 0 ; i < zz[req.params.id].sendComment.length ; i++) {
                  if (zz[req.params.id].sendComment[i].receiverId == myName) {
                    zz[req.params.id].sendComment[i].score = req.body.score;
                    zz[req.params.id].sendComment[i].title = req.body.title;
                    zz[req.params.id].sendComment[i].body = req.body.body;
                    zz[req.params.id].sendComment[i].timeStamp = newTimeStamp;
                    break;
                  }
                }
                for (var ii = 0 ; ii < zz[req.params.id].scorelist.length ; ii++) {
                  if (zz[req.params.id].scorelist[ii].username == myName) {
                    zz[req.params.id].scorelist[ii].score = req.body.score;
                    break;
                  }
                };
                console.log(xx);
                console.log(zz);
                Users.findOneAndUpdate({username: doc.username} , {
                  judgeStudents: xx,
                  assignments: zz
                } , function(err , doc) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Update TA Success!");
                  }
                })
              }
            });
          }
        });
      }
    });
};

exports.assignments = function(req , res , next) {
    var assignment = [];
    req.session.user.assignments.forEach(function (ass, i) {
    assignment.push({
      job : ass.job,
      recvComment: ass.recvComment,
      sendComment: ass.sendComment,
      assessGroup: ass.assessGroup,
      taComment: ass.taComment,
      rank: ass.rank,
      index: ass.index,
      finished: ass.finished,
      position: ass.position,
      timeStamp: ass.timeStamp,
      ended: ass.ended,
      source: ass.source,
      github: ass.github,
      scorelist: ass.scorelist
    });
  });
    res.json({
        assignments : assignment,
        status: true,
        why: "Get Data Successfully"
    });
};

exports.editPost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts[id] = req.body;
    res.json(true);
  } else {
    res.json(false);
  }
};

exports.login = function(req , res , next) {

};

exports.register = function(req , res , next) {

};

exports.loginPost = function(req , res , next) {
  var User = global.dbHandle.getModel('user');
  var myName = req.body.username;
  User.findOne({username:myName},function(err,doc){
        if(err){
            // res.send(500);
            res.json({status: false , why:"NetWork Error!"});
            console.log(err);
            console.log('USERFAILED');
        }else if(!doc){
            req.session.error = '用户名不存在';
            console.log("userName == " + myName);
            console.log(req.session.error);
            // res.writeHead(404, {'Content-Type': 'text/plain'});
            // res.end("" + req.session.error);
            res.json({status: false , why:"用户名不存在"});
        }else{
            var md5 = crypto.createHash('md5');
            var myPasswd = md5.update(req.body.passwd).digest('hex');
            console.log("Encrypted:: " + myPasswd);
            if(myPasswd != doc.password){
                req.session.error = "密码错误";
                console.log("Password Wrong!");
                console.log("The password should be:" + doc.password);
                res.json({status: false , why:"密码错误"});
            }else{
                req.session.user = doc;
                console.log(req.session.user);
                // res.send(200);
                // console.log(doc.username);
                console.log(req.session.user.assignments[0].taComment);
                res.json({status: true , why:"Success" , user: doc.username , isTA: doc.isTA , isTeacher: doc.isTeacher});
            }
        }
  });
};

exports.online = function(req , res , next) {
  if (req.session.user) {
    res.json({
      status: true,
      why: "Already Logged In!",
      username: req.session.user.username,
      isTA: req.session.user.isTA,
      isTeacher: req.session.user.isTeacher,
    });
  } else {
    res.json({
      status: false,
      why: "Not yet Logged In !"
    });
  }
}

exports.judge = function(req , res , next) {
    if (req.session.user) {
      console.log("Get Student List Success!");
      res.json({
        judgeStudents: req.session.user.judgeStudents,
        status: true,
        why: "GEt Student List Success!"
      });
    } else {
      res.json({
        status: false,
        why: "Please Login As TA!"
      });
    }
};

exports.sortByTA = function(req , res , next) {
  /**
   * Find Students' scoreList;
   */
  var User = global.dbHandle.getModel('user');
  var scorelist = req.session.user.assignments[req.params.id].scorelist;
  scorelist.sort(function(a , b) {return b.score - a.score});
  console.log(scorelist);
  /**
   * Save Modify To TA
   */
  User.findOneAndUpdate({username: req.session.user.username} , {assignments: req.session.user.assignments} , function(err ,doc) {
    if (err) {
      console.log("Save To TA failed!");
    } else {
      console.log("Save To TA Successfully!");
      res.json({
        status: true,
        why: "Update TA ranking Status Successfully!"
      });
    }
  });

  for (var i = 0 ; i < scorelist.length ; i++) {
    (function(index) {
      /**
       * Update Each Student's Database
       * @param  {[type]} req   [description]
       * @param  {[type]} res   [description]
       * @param  {[type]} next) {               var assId [description]
       * @return {[type]}       [description]
       */
      User.findOne({username: req.session.user.assignments[req.params.id].scorelist[index].username} ,
        function(err , doc) {
          if (err) {
            console.log('find Student Error');
            console.log(err);
          } else {
            var x = doc.assignments;
            x[req.params.id].rank = index + 1;
            User.findOneAndUpdate({username: doc.username} , {assignments: x} , function(err , doc) {
              if (err) {
                console.log('Update Database Error');
                console.log(err);
              } else {
                console.log('Update Student Rank Successfully!');
              }
            });
          }
        });
    })(i);
  }
  // res.json({
  //   status: true,
  //   why: "Function Success!"
  // });
};

exports.sortByTeacher = function(req , res , next) {
  var scoreList = req.session.user.assignments[req.params.id].scorelist;
  var Users = global.dbHandle.getModel('user');
  scoreList.sort(function(a , b) {return b.score - a.score});
  req.session.user.assignments[req.params.id].scorelist = scoreList;
  /**
   * Save Teacher Updation
   */
  Users.findOneAndUpdate({username: req.session.user.username} , {assignments: req.session.user.assignments} , function(err , doc) {
    if (err) {
      console.log("Update Teacher Error");
    } else {
      console.log("Update Teacher Successfully!");
      res.json({
        status: true,
        why: "Update Teacher Successfully!"
      });
    }
  });

  console.log(scoreList);
  for (var i = 0 ; i < scoreList.length ; i++) {
    (function(index) {
      /**
       * Update Each Student's Profile
       * @param  {[type]} req   [description]
       * @param  {[type]} res   [description]
       * @param  {[type]} next) {               var assId [description]
       * @return {[type]}       [description]
       */
      Users.findOne({username: req.session.user.assignments[req.params.id].scorelist[index].username}, function(err , doc) {
        if (err) {
          console.log("Update Student Error!");
        } else {
          var x = doc.assignments;
          x[req.params.id].position = index;
          Users.findOneAndUpdate({username: doc.username} , {assignments: x} , function(err , doc) {
            if (err) {
              console.log("Update Student Failed!");
            } else {
              console.log("success!");
            }
          });
        }
      });
    })(i);
  }
};

exports.postJudge = function(req , res , next) {
  /**
   * Update Session User Data First
   */
  var assId = req.params.id;
  var studentId = req.params.studentId;
  var submitId = req.params.submitId;
  var date = new Date();
  var Users = global.dbHandle.getModel('user');
  var timeStamp = date.getTime();
  var modifyJson = {
    "index" : req.session.user.assignments[assId].sendComment.length,
    "jobIndex": assId,
    "title": req.body.title,
    "timeStamp": timeStamp,
    "body": req.body.body,
    "senderId": req.session.user.username,
    "senderName": "TA",
    "senderGroup": "TA Group",
    "receiverId" : req.session.user.judgeStudents[studentId].id,
    "receiverName": "noname",
    "receiverGroup": "-1",
    "receiverSource": req.session.user.judgeStudents[studentId].source[assId].submissions[submitId],
    "receiverGithub": req.session.user.judgeStudents[studentId].source[assId].github,
    "score": req.body.score
  };
  req.session.user.assignments[assId].sendComment.push(modifyJson);
  req.session.user.judgeStudents[studentId].source[assId].judged = true;
  req.session.user.judgeStudents[studentId].source[assId].tajudged = true;
  req.session.user.judgeStudents[studentId].source[assId].tascore = req.body.score;

  req.session.user.assignments[assId].scorelist.push({
    "username": req.session.user.judgeStudents[studentId].id,
    "score": req.body.score,
    "index": studentId
  });

  /**
   * Code to Sync To the Teacher's Database
   */
  Users.findOne({username: '11111111'} , function(err , doc) {
    if (err) {
      console.log(err);
    } else {
      var sync = doc.assignments;
      sync[req.params.id].scorelist.push({
        "username": req.session.user.judgeStudents[req.params.studentId].id,
        "score": req.body.score,
        "index": sync[req.params.id].scorelist.length
      });
      var index = parseInt(req.session.user.judgeStudents[req.params.studentId].id) - 14331000;
      var jj = doc.judgeStudents;
      console.log("index == " + index);
      jj[index].source = req.session.user.judgeStudents[req.params.studentId].source;
      console.log(jj[index]);
      console.log(jj[index].source[req.params.id]);
      jj[index].source[req.params.id].tajudged = true;
      jj[index].source[req.params.id].tascore = req.body.score;

      Users.findOneAndUpdate({username: doc.username} , {assignments: sync , judgeStudents: jj} , function(err , doc) {
        if (err) {
          console.log(err);
        } else {
          console.log("Update teacher's ranking List Successfully!");
        }
      });
    }
  });

  /**
   * Codes to Sync Teacher's StudentList
   *
   */
  // var index = parseInt(req.session.user.judgeStudents[req.params.studentId].id) - 14331000;



  Users.findOneAndUpdate({username: req.session.user.username} , {assignments: req.session.user.assignments , judgeStudents: req.session.user.judgeStudents} , function(err , doc) {
    if (err) {
      console.log("Write Database of TA comment failed!");
      res.json({
        status: false,
        why: "Update TA failed!"
      });
    } else {
      console.log("Write Database of TA comment successfully!");
      Users.findOne({username: modifyJson.receiverId} , function(err , doc) {
        if (err) {
          console.log("Find Student Failed!");
        } else {
          var k = doc.assignments;
          modifyJson.receiverGroup = doc.stuGroup;
          k[assId].taComment.push(modifyJson);
          Users.findOneAndUpdate({username: doc.username} , {assignments: k} , function(err , doc) {
            if (err) {
              console.log(err);
              console.log("Update Student Database Failed!");
              res.json({
                status: false,
                why:"Update Student Database Failed!"
              });
            } else {
              console.log("Success!");
              res.json({
                status: true,
                why:"Update Student Success!"
              });
            }
          });
        }
      });
      // res.json({
      //   status: true,
      //   why: "Update TA Success!!";
      // });
    }
  });
}

exports.registerPost = function(req , res , next) {

};

exports.sending = function(req , res , next) {
    var assid = req.params.id;
    var user;
    if (!req.session.user) {
        res.json({
            status: false,
            why: "Please Login First!"
        });
    } else {
        user = req.session.user;
        var comments = user.assignments[assid].sendComment;
        console.log("send A result!");
        res.json({
            status: true,
            why: "Get Information Success!",
            sends: comments
        });
    }
};

exports.receiving = function(req , res , next) {
    var assid = req.params.id;
    var user;
    if (!req.session.user) {
        res.json({
          status: false,
          why: "Please Login First!"
        });
    } else {
      user = req.session.user;
      var comments = user.assignments[assid].recvComment;
      res.json({
        status: true,
        why:" Get Information Success!",
        recvs: comments
      });
    }
};

exports.teachers = function(req , res , next) {
  if (!req.session.user) {
    res.json({
      status: false,
      why: "Please Login First!"
    });
  } else {
    res.json({
      status: true,
      why: "Get Student List Success!",
      judgeStudents: req.session.user.judgeStudents
    });
  }
};

exports.upload = function(req, res, next) {
  // console.log(req.body);
  // console.log(req.files);
  // 获得文件的临时路径
    // var id = req.params.id;
    console.log(req.body.id);
    var Users = global.dbHandle.getModel('user');
    var Groups = global.dbHandle.getModel('group');
    var tmp_path = req.files.thumbnail.path;
    var user = 'guest';
    if (!req.session || !req.session.user) {
        var target_path = './uploads/guest/' + req.files.thumbnail.name;
    } else {
        user = req.session.user.username;
        var target_path = './public/upload/' + user + '/' + req.files.thumbnail.name;
        req.session.user.assignments[req.body.id].source.push('/upload/' + user + '/' + req.files.thumbnail.name);
        if (req.body.github && req.body.github != '') {
          req.session.user.assignments[req.body.id].github = req.body.github;
        }
    }
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
    // 删除临时文件夹文件,
      fs.unlink(tmp_path, function() {
         if (err) {
            console.log('/** An error Occured! **/');
            res.json({
                status: false,
                why: "Upload Failed!"
            });
            throw err;
         }
         console.log('/** Upload Successfully **/');
         Users.findOneAndUpdate({
            username: req.session.user.username
         } , {assignments: req.session.user.assignments} , function(err , doc) {
            if (err) {
              console.log("Sync to Database Failed!");
              res.json({
                status: false,
                why: "Sync Failed!"
              });
            } else {
              // console.log("Upload Successfully!");
              // res.json({
              //     status: true,
              //     why: "Upload Successfully!"
              //  });
              /**
               * Send Infos to the judgers.
               */
                var groupLoc = req.session.user.stuGroup;
                //Telling TAs.
                Users.findOne({username: req.session.user.correspondTA} , function(err , doc) {
                  if (err) {
                    res.json({
                      status: false,
                      why: "Update Error!"
                    });
                  } else {
                    var x = doc.judgeStudents;
                    // Find The Correspond Students;
                    //
                    if (x[req.session.user.taindex].source.length < req.body.id) {
                      for (var i = x[req.session.user.taindex].source.length ; i < req.body.id ; i++) {
                        x[req.session.user.taindex].source.push({
                          "index": i,
                          "submissions": [],
                          "github" : "#"
                        });
                      }

                      x[req.session.user.taindex].source.push({
                        "index": req.body.id,
                        "submissions": [req.session.user.assignments[req.body.id].source[req.session.user.assignments[req.body.id].source.length - 1]],
                        "github": req.session.user.assignments[req.body.id].github
                      });
                    } else if (x[req.session.user.taindex].source.length == req.body.id) {
                      x[req.session.user.taindex].source.push({
                        "index": req.body.id,
                        "submissions": [req.session.user.assignments[req.body.id].source[req.session.user.assignments[req.body.id].source.length - 1]],
                        "github": req.session.user.assignments[req.body.id].github
                      });
                    } else {
                      x[req.session.user.taindex].source[req.body.id].submissions.push(req.session.user.assignments[req.body.id].source[req.session.user.assignments[req.body.id].source.length - 1]);
                      x[req.session.user.taindex].source[req.body.id].github = req.session.user.assignments[req.body.id].github;
                      // x[req.session.user.taindex].source[req.body.id].submissions
                    }

                    Users.findOneAndUpdate({username:req.session.user.correspondTA} , {
                      judgeStudents: x
                    } , function(err , doc) {
                        if (err) {
                          console.log("Telling TA failed!");
                          console.log(err);
                          res.json({
                            status: false,
                            why: "Telling TA failed!"
                          });
                        } else {
                          console.log("Telling TA successfully");
                          // res.json({
                          //   status: true,
                          //   why:"Telling TA Successfully!"
                          // });
                          // res.redirect('/');
                        }
                    });
                  }
                });


                Groups.findOne({
                  index: groupLoc
                } , function(err , doc) {
                    if (err) {
                      console.log("User : " + req.session.user.username + " 's Group Non-Exists!");
                      res.json({
                        status: false,
                        why: "Telling Judges Failed!"
                      });
                    } else {
                      console.log("Hisgtoup:");
                      // console.log(doc);
                      var tellingGroup = doc.bematchGroup[req.body.id];
                      Groups.findOne({
                        index: tellingGroup
                      } , function(err , doc) {
                          if (err) {
                            console.log("Cannot find the corresponding Group!");
                            res.json({
                              status: false,
                              why: "Group Nonexist!"
                            });
                          } else {
                            console.log(doc.students);
                            for (var i = 0 ; i < 10 ; i++) {
                              (function(student) {
                                // Update Each Student's CommentPlace
                                Users.findOne({username: student} , function(err , doc) {
                                  // console.log(req.session.user);
                                  var originalAss = doc.assignments;
                                  originalAss[req.body.id].sendComment.push({
                                    "index" : originalAss[req.body.id].sendComment.length,
                                    "jobIndex": req.body.id,
                                    "title": "none",
                                    "timeStamp": "none",
                                    "body": "none",
                                    "senderId": doc.username,
                                    "senderName": "noname",
                                    "senderGroup": doc.stuGroup,
                                    "receiverId" : req.session.user.username,
                                    "receiverName": "noname",
                                    "receiverGroup": req.session.user.stuGroup,
                                    "receiverSource": req.session.user.assignments[req.body.id].source[req.session.user.assignments[req.body.id].source.length - 1],
                                    "receiverGithub": req.session.user.assignments[req.body.id].github,
                                    "score": -1
                                  } , function() {
                                    // Users.findOneAndUpdate({username: student} , {assignments: originalAss});
                                    console.log(originalAss[req.body.id].sendComment[0]);
                                  // });
                                  });
                                  Users.findOneAndUpdate({username: doc.username} , {assignments: originalAss} , function(err , doc) {
                                    if (err) {
                                      console.log(err);
                                    } else {
                                      console.log("Update Success!");
                                      // console.log(originalAss[req.body.id].sendComment[0]);
                                      // console.log(doc);
                                    }
                                  });
                                });
                              })(doc.students[i]);
                            }
                            // Notify TAs
                            // res.redirect('/');
                          }
                      })
                    }
                });
                // console.log(req.session.user);
                res.redirect('/');
            }
         });
         // ('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
      });
    });
};

// DELETE

exports.deletePost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts.splice(id, 1);
    res.json(true);
  } else {
    res.json(false);
  }
};


exports.logout = function(req , res , next) {
  req.session.user = null;
  res.json({
    status: true,
    why: "Log out Successfully!"
  });
};

exports.senders = function(req , res , next) {
  /**
   * Firstly : Modify a persons' own profile
   *  ** In Session **
   */
  // Get User model modifier
  var Users = global.dbHandle.getModel('user');
  // Get Timestamp First
  var date = (new Date()).getTime();
  // var secs = date.parse();
  // console.log(date);
  // console.log(typeof(date));
  // console.log(req.body);
  req.session.user.assignments[req.params.id].
    sendComment[req.params.commentId].title = req.body.titie;
  req.session.user.assignments[req.params.id].
    sendComment[req.params.commentId].body = req.body.body;
  req.session.user.assignments[req.params.id].
    sendComment[req.params.commentId].score = req.body.score;
  req.session.user.assignments[req.params.id].
    sendComment[req.params.commentId].timeStamp = '' + date;

  /**
   * Next: Modify his data in DataBase;
   *
   */
    Users.findOneAndUpdate({username: req.session.user.username} , {
      assignments: req.session.user.assignments
    } , function(err , doc) {
      if (err) {
        console.log("Error: No User");
        console.log(err);
        res.json({
          status: false,
          why: "Error When finding Receiver"
        });
      } else {
      /**
       * Then Modify the Receiver's Database
       */
      // here only add to the Bottom of Receiver's Databses
        Users.findOne({username: doc.assignments[req.params.id].sendComment[req.params.commentId].receiverId} , function(err , doc) {
          if (err) {
            console.log("Error: No User");
            console.log(err);
            res.json({
              status: false,
              why: "Error When finding Receiver"
            });
          } else {
            var myAss = doc.assignments;
            myAss[req.params.id].recvComment.push(req.session.user.assignments[req.params.id].
    sendComment[req.params.commentId]);
            Users.findOneAndUpdate({username: doc.username} , {assignments: myAss} , function(err , doc) {
              if(err) {
                console.log('Error When updating Receiver\'s Database');
                console.log(err);
                res.json({
                  status: false,
                  why: "Error When finding Receiver"
                });
              } else {
                console.log("update Successfully");
                res.json({
                  status: true,
                  why: "Update Successfully"
                });
              }
            });
          }
        });
      }
    });
}

exports.score = function(req , res , next) {
  var assid = req.params.id;
  var myData = req.session.user.assignments[assid].taComment;
  res.json({
    status: true,
    why: "Get Score Successfully",
    comment: myData
  });
};

