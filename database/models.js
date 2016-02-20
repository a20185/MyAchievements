module.exports = {
    user : {
        username : {type:String , required : true},
        password : {type:String , required : true},
        stuName : {type: String ,required: true},
        stuGroup: {type: String , required: true},
        isTA: {type: Boolean , required: true},
        isAdmin: {type: Boolean , required: true},
        isTeacher: {type: Boolean , required: true},
        stuScore: {type: Array , required: true},
        stuRank: {type: Array , required: true},
        taindex: {type: Number , required: true},
        judgeGroup: {type: Array , required: true},
        judgeStudents: {type: Array , required: true},
        correspondTA: {type: String , required: true},
        assignments : {type: Array , required: true},
    },

    group: {
        students: {type: Array , required: true},
        matchingGroup: {type: Array , required: true},
        bematchGroup: {type: Array , required: true},
        index: {type: String , required: true},
        correspondTA: {type: Array , required: true}
    },

    source: {
        index: {type: String , required: true},
        submissions: {type: Array , required: true}
    },

    submission: {
        index: {type: String , required: true},
        timeStamp: {type: String , required: true},
        location: {type: String , required: true}
    },

    comment:{
          index : {type: String , required: true},
          jobIndex: {type: String , required: true},
          title: {type: String , required: true},
          timeStamp: {type: String , required: true},
          body: {type: String , required: true},
          senderId: {type: String , required: true},
          senderName: {type: String , required: true},
          senderGroup: {type: String , required: true},
          receiverId : {type: String , required: true},
          receiverName: {type: String , required: true},
          receiverGroup: {type: String , required: true},
          receiverSource: {type: String , required: true},
          score: {type: String , required: true}
        },
    jobs: {
        jobPool: {type: Array , required: true},
        index: {type: String , required: true}
    },
    job: {
        title: {type: String , required: true},
        refer: {type: String , required: true},
        index: {type: String , required: true},
        available: {type: Boolean , required: true},
        startDate: {type: String},
        endDate: {type: String},
        assessDate: {type: String}
    },
    assignments: {
        index: {type: String , required: true},
        assPool: {type: Array , required: true}
    },
    assignment: {
        index: {type: String , required: true},
        job : {type: Object , required: true},
        recvComment: {type: Array , required: true},
        sendComment: {type: Array , required: true},
        assessGroup: {type: String , required: true},
        timeStamp: {type: String , required: true},
        finished: {type: String , required: true},
        taComment: {type: Array , required: true},
        rank: {type: String , required: true},
        position: {type: Object , required: true},
        ended: {type: Boolean , required: true},
        source: {type: Object , required: true},
        github: {type: String},
        scorelist: {type: Array}
    }
};
