const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SliderSchema = new Schema({
  image: {
    type: String,
    maxlength: 512,
    required: true
  },
  title : {
    type : String,
    requried: false,
  },
  order : {
      type : Number,
      required : true,
      default : 0
  },
  status: {
    type: Boolean,
    default: true
  }
},
{
  timestamps: true
})
module.exports = mongoose.model('Slider', SliderSchema)