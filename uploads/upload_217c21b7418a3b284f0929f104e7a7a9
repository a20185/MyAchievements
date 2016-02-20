/*
 * Serve JSON to our AngularJS client
 */

// For a real app, you'd make database requests here.
// For this example, "data" acts like an in-memory "database"

// var loginHelper = require('./loginHelper.js');
// var registerHelper = require('./registerHelper.js');
var crypto = require('crypto');
var data = {
  "posts": [
    {
      "title": "Lorem ipsum",
      "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "owner" : "Maxwell",
      "comment" : [],
      "isHidden" : false
    },
    {
      "title": "Sed egestas",
      "content": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus.",
      "owner": "Maxwell",
      "comment": [],
      "isHidden" : false
    }
  ]
};

var neverBeenReadFromDataBase = true;

// GET

exports.posts = function (req, res, next) {
  var posts = [];
  var Datas = global.dbHandle.getModel('data');
  if (neverBeenReadFromDataBase) {
    Datas.findOne({neverBeenInitialized:"POSTS"},function(err,doc){
      if(err){
      // res.send(500);
        // res.json(false);
        console.log(err);
        console.log('AHHHHHHH');
      } else if(!doc){
        // req.session.error = '用户名不存在';
        console.log("Database Not Exists");
        /**
         * [description] If not Exists then create Database;
         * @param  {[type]} err  [description]
         * @param  {[type]} doc) {                   if (err) {          console.log("Create Database Failed!");        } else {          console.log(doc);          data.posts [description]
         * @return {[type]}      [description]
         */
        Datas.create({posts : data.posts , neverBeenInitialized : "POSTS"} , function(err , doc) {
          if (err) {
            console.log("Create Database Failed!");
          } else {
            console.log(doc);
            data.posts = doc.posts;
          }
        });
        // console.log(req.session.error);
        // res.writeHead(404, {'Content-Type': 'text/plain'});
        // res.end("" + req.session.error);
        // res.json(false);
      } else {
        console.log("Read From DataBase Succeed!");
        data.posts = doc.posts;
        neverBeenReadFromDataBase = false;
        console.log(data.posts);
      }

      data.posts.forEach(function (post, i) {
      posts.push({
        id: i,
        title: post.title,
        content: post.content.substr(0, 50) + '...',
        owner: post.owner,
        comment: post.comment,
        isHidden: post.isHidden
     });
    });

    res.json({
      posts: posts
    });
    });
  } else {
    data.posts.forEach(function (post, i) {
      posts.push({
        id: i,
        title: post.title,
        content: post.content.substr(0, 50) + '...',
        owner: post.owner,
        comment: post.comment,
        isHidden: post.isHidden
      });
    });
    res.json({
      posts: posts
    });
  }
  // data.posts.forEach(function (post, i) {
  //   posts.push({
  //     id: i,
  //     title: post.title,
  //     content: post.content.substr(0, 50) + '...',
  //     owner: post.owner,
  //     comment: post.comment
  //   });
  // });
  // res.json({
  //   posts: posts
  // });
};

exports.post = function (req, res, next) {
  var id = req.params.id;
  var retPost;
  if (id >= 0 && id < data.posts.length) {
    retPost = data.posts[id];
    retPost.id = id;
    for (var i = 0 ; i < retPost.comment.length ; i++) {
        retPost.comment[i].id = i;
    }
    res.json({
      post: retPost
    });
  } else {
    res.json(false);
  }
};


exports.isOnline = function(req , res , next) {
  if (!req.session.user || req.session.user != null) {
    res.json({status: true , user : req.session.user.username});
  } else {
    res.json({status: false , why : "NoLogin"});
  }
};

/**
 * FirstLy Commented!
 * @param {[type]}   req  [description]
 * @param {[type]}   res  [description]
 * @param {Function} next [description]
 */
exports.addComment = function(req , res , next) {
  var commentTemplate = {
  "title": "None",
  "content": "None",
  "owner" : "guest",
  "id" : 0,
  "isHidden" : false
  };
  var Datas = global.dbHandle.getModel('data');
  commentTemplate.title = req.body.title;
  commentTemplate.content = req.body.content;
  if (req.session.user != null) {
    commentTemplate.owner = req.session.user.username;
    var id = req.params.id;
    if (id >= 0 && id < data.posts.length) {
      var len = data.posts[id].comment.length;
      commentTemplate.id = len;
      data.posts[id].comment.push(commentTemplate);
      Datas.findOneAndUpdate({neverBeenInitialized:"POSTS"} , {posts:data.posts} , function(err , doc) {
        if (err) {
          console.log("Update Datas Array Database Error!");
          res.json({status : false , why : "update Data Array Failed!"});
        } else {
          console.log(doc);
          res.json({status : true , why : "Succeed!!"});
        }
      });
    } else {
      res.json({status: false , why : "unexpected error!"});
    }
  } else {
    /**
     * [status description] Enhance Security
     * @type {Boolean} Must be Login then Post
     */
    res.json({status: false , why :"Please Login First!"});
  }


  // var id = req.params.id;
  // if (id >= 0 && id < data.posts.length) {
  //   var len = data.posts[id].comment.length;
  //   commentTemplate.id = len;
  //   data.posts[id].comment.push(commentTemplate);
  //   Datas.findOneAndUpdate({neverBeenInitialized:"POSTS"} , {posts:data.posts} , function(err , doc) {
  //     if (err) {
  //       console.log("Update Datas Array Database Error!");
  //       res.json({status : false , why : "update Data Array Failed!"});
  //     } else {
  //       console.log(doc);
  //       res.json({status : true , why : "Succeed!!"});
  //     }
  //   });
  // } else {
  //   res.json({status: false , why : "unexpected error!"});
  // }
};

// POST

exports.addPost = function (req, res, next) {
  var postTemplate = {
  "title": "None",
  "content": "None",
  "owner" : "guest",
  "comment" : [],
  "isHidden" : false
  };

  var Datas = global.dbHandle.getModel('data');
  // var Posts = global.dbHandle.getModel('post');

  postTemplate.title = req.body.title;
  postTemplate.content = req.body.content;
  if (req.session.user != null) {
    postTemplate.owner = req.session.user.username;
      /**
     * Starting to Update and Storage Data
     */
    data.posts.push(postTemplate);
    Datas.findOneAndUpdate({neverBeenInitialized:"POSTS"} , {posts:data.posts} , function(err , doc) {
      if (err) {
        console.log("Update Datas Array Database Error!");
        res.json({status: false , why:"database Error!"});
      } else {
        console.log(doc);
        var len = data.posts.length - 1;
        console.log(len);
        // Posts.create({id:len,
        //               title:postTemplate.title,
        //               content:postTemplate.content,
        //               owner:postTemplate.owner,
        //               comment:postTemplate.comment} , function(err , doc) {
        //                   if (err) {
        //                     console.log("Add entry to posts failed!");
        //                   } else {
        //                     console.log(doc);
                            res.json({status: true , why:"Succeed!"});
                      //     }
                      // });
      }
    });
  } else {
    /**
     * Enhance Safety For adding post
     * @type {Boolean} must login
     */
    res.json({status: false , why: "Please Login"});
  }

  // /**
  //  * Starting to Update and Storage Data
  //  */
  // data.posts.push(postTemplate);
  // Datas.findOneAndUpdate({neverBeenInitialized:"POSTS"} , {posts:data.posts} , function(err , doc) {
  //   if (err) {
  //     console.log("Update Datas Array Database Error!");
  //     res.json(false);
  //   } else {
  //     console.log(doc);
  //     var len = data.posts.length - 1;
  //     console.log(len);
  //     // Posts.create({id:len,
  //     //               title:postTemplate.title,
  //     //               content:postTemplate.content,
  //     //               owner:postTemplate.owner,
  //     //               comment:postTemplate.comment} , function(err , doc) {
  //     //                   if (err) {
  //     //                     console.log("Add entry to posts failed!");
  //     //                   } else {
  //     //                     console.log(doc);
  //                         res.json(true);
  //                   //     }
  //                   // });
  //   }
  // });
};

// PUT

exports.editPost = function (req, res, next) {
  var id = req.params.id;
  if (id >= 0 && id < data.posts.length) {
    if (req.session.user == null || req.session.user.username != data.posts[id].owner) {
      /**
       * [status description]Enhance Security
       * @type {Boolean}
       */
      res.json({status: false , why:"你没有权限修改这篇文章"});
    } else {
      if (data.posts[id].isHidden == true) {
        res.json({status : false , why:"Post is Hidden by the Administrator!"});
      } else {
        data.posts[id].title = req.body.title;
        data.posts[id].content = req.body.content;
        var Datas = global.dbHandle.getModel('data');
        Datas.findOneAndUpdate({neverBeenInitialized:"POSTS"} , {posts:data.posts} , function(err , doc) {
          if (err) {
            console.log("Update Datas Array Database Error!");
            res.json({status: false , why:"Update Failed!"});
          } else {
            console.log(doc);
            res.json({status: true , why:"Updata Successfully!"});
          }
        });
      }
    }
  } else {
    res.json({status: false , why:"unexpected error!"});
  }
};

// DELETE

exports.deletePost = function (req, res, next) {
  var id = req.params.id;
  var Datas = global.dbHandle.getModel('data');
  if (id >= 0 && id < data.posts.length) {
    if (req.session.user == null || req.session.user.username != data.posts[id].owner) {
      /**
       * [status description]Enhance Security
       * @type {Boolean}
       */
      res.json({status: false , why:"你没有权限删除这篇文章"});
    } else {
      if (data.posts[id].isHidden == true) {
        res.json({status : false , why:"Post is Hidden by the Administrator!"});
      } else {
        data.posts.splice(id, 1);
        Datas.findOneAndUpdate({neverBeenInitialized:"POSTS"} , {posts:data.posts} , function(err , doc) {
          if (err) {
            console.log("Delete Datas Array Database Error!");
            res.json({status: false , why: "Delete Datas array Error!"});
          } else {
            console.log(doc);
            res.json({status: true , why:"Deletion is Succeeded!"});
          }
        });
      }
    }
  } else {
    res.json({status: false , why:"unexpected Error!"});
  }
};


exports.hidePost = function(req , res , next) {
  var id = req.params.id;
  var Datas = global.dbHandle.getModel('data');
  if (id >= 0 && id < data.posts.length) {
    if (req.session.user == null || req.session.user.username != 'rootuser') {
      /**
       * [status description]Enhance Security
       * @type {Boolean}
       */
      res.json({status: false , why:"你没有权限隐藏这篇文章"});
    } else {
      data.posts[id].isHidden = true;
      Datas.findOneAndUpdate({neverBeenInitialized:"POSTS"} , {posts:data.posts} , function(err , doc) {
          if (err) {
            console.log("Hidden Datas Array Database Error!");
            res.json({status: false , why: "Hidden Failed!"});
          } else {
            console.log(doc);
            res.json({status: true , why:"Hidden Successfully!"});
          }
      });
    }
  } else {
    res.json({status: false , why:"Problems Occured!"});
  }
};

exports.unhidePost = function(req , res , next) {
  var id = req.params.id;
  var Datas = global.dbHandle.getModel('data');
  if (id >= 0 && id < data.posts.length) {
    if (req.session.user == null || req.session.user.username != 'rootuser') {
      /**
       * [status description]Enhance Security
       * @type {Boolean}
       */
      res.json({status: false , why:"你没有权限取消隐藏这篇文章"});
    } else {
      data.posts[id].isHidden = false;
      Datas.findOneAndUpdate({neverBeenInitialized:"POSTS"} , {posts:data.posts} , function(err , doc) {
          if (err) {
            console.log("Unhidden Datas Array Database Error!");
            res.json({status: false , why: "unhidden Failed!"});
          } else {
            console.log(doc);
            res.json({status: true , why:"Unhidden Successfully!"});
          }
      });
    }
  } else {
    res.json({status: false , why:"Problems Occured!"});
  }
}

exports.hideComment = function(req , res , next) {
  var id = req.params.id;
  var commentId = req.params.commentId;
  var Datas = global.dbHandle.getModel('data');
  if (id >= 0 && id < data.posts.length) {
    if (commentId >= 0 && commentId < data.posts[id].comment.length) {
      if (req.session.user == null || req.session.user.username != 'rootuser') {
        /**
         * [status description] Enhance Security
         * @type {Boolean}
         */
        res.json({status: false , why:"你没有权限隐藏这篇评论"});
      } else {
        data.posts[id].comment[commentId].isHidden = true;
        Datas.findOneAndUpdate({neverBeenInitialized:"POSTS"} , {posts:data.posts} , function(err , doc) {
          if (err) {
            console.log("Hidden Datas Array Database Error!");
            res.json({status: false , why: "Hidden Failed!"});
          } else {
            console.log(doc);
            res.json({status: true , why:"Hidden Successfully!"});
          }
        });
      }
    } else {
      res.json({status: false , why:"Comment Index Out of Bounds."});
    }
  } else {
    res.json({status: false , why:"Post index out of bounds."});
  }
};

exports.unhideComment = function(req , res , next) {
  var id = req.params.id;
  var commentId = req.params.commentId;
  var Datas = global.dbHandle.getModel('data');
  if (id >= 0 && id < data.posts.length) {
    if (commentId >= 0 && commentId < data.posts[id].comment.length) {
      if (req.session.user == null || req.session.user.username != 'rootuser') {
        /**
         * [status description] Enhance Security
         * @type {Boolean}
         */
        res.json({status: false , why:"你没有权限取消隐藏这篇评论"});
      } else {
        data.posts[id].comment[commentId].isHidden = false;
        Datas.findOneAndUpdate({neverBeenInitialized:"POSTS"} , {posts:data.posts} , function(err , doc) {
          if (err) {
            console.log("Hidden Datas Array Database Error!");
            res.json({status: false , why: "Hidden Failed!"});
          } else {
            console.log(doc);
            res.json({status: true , why:"Hidden Successfully!"});
          }
        });
      }
    } else {
      res.json({status: false , why:"Comment Index Out of Bounds."});
    }
  } else {
    res.json({status: false , why:"Post index out of bounds."});
  }
}

/**
 * [comment description] Experiment 1
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.comment = function(req , res , next) {
  var id = req.params.id;
  var commentId = req.params.commentId;
  var retComment;
  if (id >= 0 && id < data.posts.length) {
    if (commentId >= 0  && commentId < data.posts[id].comment.length) {
    retComment = data.posts[id].comment[commentId];
    retComment.postId = id;
    retComment.id = commentId;
    res.json({
      status: true,
      comment: retComment
    });
  } else {
    res.json({status : false , why : "Comment Index out of bounds!"});
  }
} else {
  res.json({status: false , why:"Index out of bounds!"});
}

}

/**
 * [editComment description] Experiment 1
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.editComment = function(req , res , next) {
  var id = req.params.id;
  // console.log("Already IN!!!!!");
  var commentId = req.params.commentId;
  if (id >= 0 && id < data.posts.length) {
    if (commentId >= 0 && commentId < data.posts[id].comment.length) {
      if (req.session.user == null || req.session.user.username != data.posts[id].comment[commentId].owner) {
        /**
         * [status description] Enhance Security
         * @type {Boolean}
         */
        res.json({status: false , why:"你没有权限编辑这篇评论"});
      } else {
        if (data.posts[id].comment[commentId].isHidden == true) {
          res.json({status: false , why: "Comment is hidden by the Administrator!"});
        } else {
          data.posts[id].comment[commentId].title = req.body.title;
          data.posts[id].comment[commentId].content = req.body.content;
          var Datas = global.dbHandle.getModel('data');
          Datas.findOneAndUpdate({neverBeenInitialized:"POSTS"} , {posts:data.posts} , function(err , doc) {
            if (err) {
              console.log("Update Datas Array Database Error!");
              res.json({status: false , why : "Updation Failed!"});
            } else {
              console.log(doc);
              res.json({status : true , why: "Succeed!"});
            }
          });
        }
      }
    } else {
      res.json({status: false , why: "Comment out of Bounds!"});
    }
  } else {
    res.json({status: false , why:"Posts out of bounds!"});
  }
};

/**
 * [deleteComment description] First Experiment
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.deleteComment = function (req, res, next) {
  var id = req.params.id;
  var commentId = req.params.commentId;

  var Datas = global.dbHandle.getModel('data');
  if (id >= 0 && id < data.posts.length) {
    if(commentId >= 0 && data.posts.length) {
      if (req.session.user == null || req.session.user.username != data.posts[id].comment[commentId].owner) {
        /**
         * [status description] Enhance Security
         * @type {Boolean}
         */
        res.json({status: false , why:"你没有权限删除这篇评论"});
      } else {
        if (data.posts[id].comment[commentId].isHidden == true) {
          res.json({status: false , why:"Comment is Hidden By the Administrator!"});
        } else {
          data.posts[id].comment.splice(commentId, 1);
          /**
           * Solve undefinded problem
           * @param  {[type]} var i             [description]
           * @return {[type]}     [description]
           */
          for (var i = 0 ; i < data.posts[id].comment.length ; i++) {
            data.posts[id].comment[i].id = i;
          }
        // If it's ok for deleting without reSigned?
        // for (var i = 0 ; i < data.posts[id].comment.length ; i++)
          Datas.findOneAndUpdate({neverBeenInitialized:"POSTS"} , {posts:data.posts} , function(err , doc) {
            if (err) {
              console.log("Delete Datas Array Database Error!");
              res.json({status: false , why :"Error Occured when finding Databases"});
            } else {
              console.log(doc);
              res.json({status: true , why:"Succeed!"});
            }
          });
        }
      }
    } else {
      res.json({status:false , why : "unexpected Error!"});
    }
  } else {
    res.json({status: false , why:"Index Out of Bounds Error!"});
  }
};


exports.register = function(req , res , next) {
  console.log(req.session);
};

exports.login = function(req , res , next) {
  console.log(req.session);
};

exports.logout = function(req , res , next) {
  console.log("Logging Out!");
  req.session.user = null;
  res.json(true);
};

/**--Completed , but with a little bug
 * [loginPost description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
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
                console.log(doc.username);
                res.json({status: true , why:"Success" , user: doc.username});
            }
        }
  });
};

exports.registerPost = function(req , res , next) {
    var flag = {
    email:false,
    nickname:false,
    ids:false,
    phone:false
  };
    var User = global.dbHandle.getModel('user');
    var myName = req.body.username;
    var myEmail = req.body.email;
    var myId = req.body.id;
    var myPhone = req.body.phone;
    var myPassword = req.body.passwd;
    console.log(myName);
    console.log(myEmail);
    console.log(myId);
    console.log(myPhone);
    console.log(myPassword);
    User.findOne({username: myName},function(err,doc){
        if(err){
            // res.send(500);
            req.session.error =  '网络异常错误！';
            console.log("网络异常错误！!!!");
            console.log(err);
            // res.writeHead(500, {'Content-Type': 'text/plain'});
            // res.end("" + req.session.error);
            res.json({status:false , why:'Network Error'});
            flag.nickname = false;
        }else if(doc){
            req.session.error = '用户名已存在！';
            console.log("用户名已存在！!!!");
            // res.writeHead(500, {'Content-Type': 'text/plain'});
            // res.end("" + req.session.error);
            res.json({status:false , why:'用户名已存在！'});
            flag.nickname = false;
        } else {
          flag.nickname = true;
            console.log("用户名OK!!!");
            User.findOne({email: myEmail},function(err,doc){
                if(err){
                    req.session.error =  '网络异常错误！';
                    console.log("网络异常错误！!!!");
                    console.log(err);
                    // res.writeHead(500, {'Content-Type': 'text/plain'});
                    // res.end("" + req.session.error);
                    flag.email = false;
                    res.json({status:false , why:'Network Error'});
                }else if(doc){
                    req.session.error = 'email已使用过！';
                    console.log("email已使用过！!!!");
                    // res.writeHead(500, {'Content-Type': 'text/plain'});
                    // res.end("" + req.session.error);
                    flag.email = false;
                    res.json({status:false , why:'email已使用过！'});
                } else {
                    flag.email = true;
                    console.log("email OK！!!!");
                    User.findOne({id: myId},function(err,doc) {
                        if(err){
                            // res.writeHead(500, {'Content-Type': 'text/plain'});
                            // res.end("" + req.session.error);
                            req.session.error =  '网络异常错误！';
                            console.log("网络异常错误！!!!");
                            console.log(err);
                            flag.ids = false;
                            res.json({status:false , why:'Network Error'});
                        }else if(doc){
                            req.session.error = '学号已存在！';
                            console.log("学号已存在！!!!");
                            // res.writeHead(500, {'Content-Type': 'text/plain'});
                            // res.end("" + req.session.error);
                            flag.ids = false;
                            res.json({status:false , why:'学号已存在！'});
                        } else {
                            console.log("学号OK！!!!");
                            flag.ids = true;
                            User.findOne({phone: myPhone},function(err,doc){
                                if(err){
                                    // res.writeHead(500, {'Content-Type': 'text/plain'});
                                    // res.end("" + req.session.error);
                                    req.session.error =  '网络异常错误！';
                                    console.log("网络异常错误！!!!");
                                    console.log(err);
                                    flag.phone = false;
                                    res.json({status:false , why:'Network Error'});
                                } else if (doc) {
                                    req.session.error = '手机号已存在！';
                                    console.log("手机号已存在！!!!");
                                    // res.writeHead(500, {'Content-Type': 'text/plain'});
                                    // res.end("" + req.session.error);
                                    flag.phone = false;
                                    res.json({status:false , why:'手机号已存在！'});
                                } else {
                                    console.log("手机号OK！!!!");
                                    flag.phone = true;
                                    console.log("SUCCESS!!!");
                                    var md5 = crypto.createHash('md5');
                                    var myPasswd = md5.update(myPassword).digest('hex');
                                    console.log("New passwd:" + myPasswd);
                                    User.create({
                                        username: myName,
                                        password: myPasswd,
                                        email:myEmail,
                                        phone:myPhone,
                                        id : myId
                                    } , function(err , doc) {
                                         if (err) {
                                                console.log(err);
                                                // res.writeHead(500, {'Content-Type': 'text/plain'});
                                                // res.end("" + err);
                                                res.json({status:false , why:'Unknown Error'});
                                        } else {
                                                req.session.error = '用户创建成功！';
                                                req.session.user = doc;
                                                console.log(req.session.error);
                                                console.log(req.session.user);
                                                // res.writeHead(200, {'Content-Type': 'text/plain'});
                                                // res.end("" + req.session.error);
                                              res.json({status:true , why:'用户创建成功！' , user : doc.username});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};