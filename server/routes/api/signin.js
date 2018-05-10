const User = require("./../../models/User");
const UserSession = require("./../../models/UserSession");
module.exports = app => {
  /* app.get("/api/counters", (req, res, next) => {
    Counter.find()
      .exec()
      .then(counter => res.json(counter))
      .catch(err => next(err));
  });

  app.post("/api/counters", function(req, res, next) {
    const counter = new Counter();

    counter
      .save()
      .then(() => res.json(counter))
      .catch(err => next(err));
  });*/
  //Signup
  app.post("/api/account/signup", (req, res, next) => {
    const { body } = req;
    const { firstName, lastName, email, password } = body;

    if (!firstName) {
      return res.send({
        success: "false",
        message: "Error: First name cannot be empty"
      });
    }
    if (!lastName) {
      return res.send({
        success: "false",
        message: "Error: Last name cannot be empty"
      });
    }
    if (!email) {
      return res.send({
        success: "false",
        message: "Error: email cannot be empty"
      });
    }
    if (!password) {
      return res.send({
        success: "false",
        message: "Error: Password cannot be empty"
      });
    }

    //Steps required and nopt done!!
    //Verify email, can be doen lodash
    //save

    User.find(
      {
        email: email
      },
      (err, previousUsers) => {
        if (err) {
          return res.send({
            success: "false",
            message: "Error: Server Error"
          });
        } else if (previousUsers.length > 0) {
          return res.send({
            success: "false",
            message: "Error: User already exists"
          });
        }
        //Save the new USer

        const newUser = new User();
        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.password = newUser.generateHash(password);
        newUser.save((err, user) => {
          if (err) {
            return res.send({
              success: "false",
              message: "Error: Server Error"
            });
          }
          return res.send({
            success: "true",
            message: "Error: Signed-Up"
          });
        });
      }
    );
  });
  app.post("/api/account/signin", (req, res, next) => {
    const { body } = req;
    const { email, password } = body;

    if (!email) {
      return res.send({
        success: "false",
        message: "Error: email cannot be empty"
      });
    }
    if (!password) {
      return res.send({
        success: "false",
        message: "Error: Password cannot be empty"
      });
    }

    User.find(
      {
        email: email
      },
      (err, userExists) => {
        if (err) {
          return res.send({
            success: "false",
            message: "Error: Server Error"
          });
        } else if (userExists.length != 1) {
          return res.send({
            success: "true",
            message: "Error: Invalid username"
          });
        }

        const user = userExists[0];
        if (!user.validPassword(password)) {
          return res.send({
            success: "false",
            message: "Error: Invalid password"
          });
        }

        // return res.send({
        //   success: 'true',
        //   message: 'logged-in'
        // });
        //New User Session
        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err, doc) => {
          if (err) {
            return res.send({
              success: false,
              message: "Error: server error"
            });
          }
          return res.send({
            success: "true,",
            message: "Valid sigin",
            token: doc._id
          });
        });
      }
    );
  });
};
