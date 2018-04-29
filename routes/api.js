'use strict';


   var  get_file = (req,res) => {
        console.log("sasas")
    }

    var update_file = (req,res) => {
        console.log("sasas")
    }

    var delete_file = (req,res) => {
        console.log("sasas")
    }


module.exports = function(app) {
    app.use('/files/:fileId')
        .get(get_file)
        .post(update_file)
        .delete(delete_file)
};