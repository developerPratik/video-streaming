let Schema = require('mongoose').Schema;

let vSchema = new Schema({
    title: { type: String, required: true },
    url: {type: String, required: true },
    type: {type: String, required: true}
});


let vModel = require('mongoose').model("Videos", vSchema, "Videos");

module.exports = vModel;