const express = require("express");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const port = process.env.PORT || 3000;

const dbProtocol = process.env.DB_PROTOCOL || "mongodb";
const dbUsername = process.env.MONGO_DB_USERNAME || "root";
const dbPassword = process.env.MONGO_DB_PASSWORD || "root";
const dbAddress = process.env.MONGO_DB_ADDRESS || "127.0.0.1:27017";

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbProtocol + '://' + dbUsername + ':' + dbPassword + '@' + dbAddress);
}

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const Post = mongoose.model("Post", postSchema);


app.get('/', (req, res) => {
  Post.find({}).then((posts) => {
    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: posts,
      _: _
    });
  })
})

app.get('/about', (req, res) => {
  res.render("about", { aboutContent: aboutContent });
})

app.get('/contact', (req, res) => {
  res.render("contact", { contactContent: contactContent });
})

app.get('/compose', (req, res) => {
  res.render("compose");
})

app.post('/compose', (req, res) => {
  const title = req.body.title;
  const content = req.body.post;

  const post = new Post({
    title: title,
    content: content
  });

  post.save();
  res.redirect("/");
})

app.get('/posts/:postTitle', (req, res) => {
  const postId = req.params.postTitle
  Post.findOne({_id: postId}).then((post) => {
    if (post) {
      res.render('post', {
        title: post.title,
        content: post.content
      });
    } else {
      res.redirect("/");
    }
  });
});






app.listen(port, function () {
  console.log("Server started on port 3000");
});
