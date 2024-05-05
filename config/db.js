const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://datngo:datngo123@cluster0.zkx2xob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const userSchema = mongoose.Schema({
  username: String,
  password: String,
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
