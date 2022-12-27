require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const aboutContent = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";
const contactContent = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(process.env.DATABASE_URI).then().catch(err=>console.log(err);)
// const posts = [];


//Schema
const BlogSchema = new mongoose.Schema({
  myTitle: String,
  myContent: String
});

//Model or Collection
const Blog = mongoose.model('Blog', BlogSchema);





//home
app.get('/', function (req, res) {

  Blog.find({}, function (err, listResult) {
    res.render('home', {
      startingContent: homeStartingContent,
      posts: listResult
    });
  });




});

//about
app.get('/about', function (req, res) {
  res.render('about', { aboutContent: aboutContent });

});

//contact
app.get('/contact', function (req, res) {
  res.render('contact', { contactContent: contactContent });

});

//route parameter using express
app.get('/posts/:postid', function (req, res) {
  const requestedpostid = _.toLower(req.params.postid);

  Blog.findOne({_id:requestedpostid},function (err, foundId) {
    if (!err) {
      res.render('post',{
        myTitle:foundId.myTitle,
        myContent:foundId.myContent
      });
    }
  });

});


//compose

app.get('/compose', function (req, res) {
  res.render('compose');
});




app.post('/compose', function (req, res) {


  //Document
  const newBlog = new Blog({
    myTitle: req.body.postTitle,
    myContent: req.body.postBody

  });
  newBlog.save();

  res.redirect('/');


});


app.listen(3500, function () {
  console.log("Server started on port 3000");
});
