const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const validator = require("validator");

exports.signup = async (req, res, next) => {
  try {
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      role: req.body.role, // Ajoutez le rôle de l'utilisateur lors de l'inscription
      isAdmin: req.body.isAdmin || false, // Ajoutez le champ isAdmin
    });

    await user.save();
    res.status(201).json({ message: "compte cree avec succes" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "user not exists" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "incorrect password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, isAdmin: user.isAdmin,email:user.email }, // Ajoutez isAdmin dans le token
      "RANDOM_TOKEN_SECRET",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      user: user,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to log in" });
  }
};

exports.getById = (req, res, next) => {
  const userId = req.auth.userId;
  User.findOne({ _id: userId })
    .select('-password')
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};
exports.getAllUsers = (req, res, next) => {
  User.find()
    .select("-password")
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteUser = (req, res, next) => {
  const userId = req.params.id;
  User.findOne({ _id: userId }).then((user) => {
    if (!user) {
      res.status(404).json({
        error: new Error("No such User!"),
      });
    } else {
      User.deleteOne({ _id: userId })
        .then(() => {
          res.status(200).json({
            message: "Deleted!",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    }
  });
};

exports.updateUser = (req, res, next) => {
  const userId = req.params.id;
  const updateData = { ...req.body };

  if (updateData.password) {
    return res.status(400).json({ error: "Password update not allowed" });
  }

  if (updateData.email) {
    return res.status(400).json({ error: "Email update not allowed" });
  }

  const allowedFieldsToUpdate = {
    username: updateData.username,
    email: updateData.email,
  };

  User.updateOne({ _id: userId }, allowedFieldsToUpdate)
    .then(() => res.status(200).json({ message: allowedFieldsToUpdate }))
    .catch((error) => res.status(400).json({ error }));
};

exports.changePassword = (req, res, next) => {
  const userId = req.auth.userId;
  const { currentPassword, newPassword, newEmail } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      bcrypt
        .compare(currentPassword, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ error: "Incorrect current password" });
          }

          if (newPassword) {
            bcrypt
              .hash(newPassword, 10)
              .then((hash) => {
                user.password = hash;

                if (newEmail) {
                  user.email = newEmail;
                }

                user
                  .save()
                  .then(() =>
                    res.status(200).json({ message: "User updated successfully" })
                  )
                  .catch((error) => res.status(400).json({ error }));
              })
              .catch((error) => res.status(500).json({ error }));
          } else if (newEmail) {
            user.email = newEmail;

            user
              .save()
              .then(() =>
                res.status(200).json({ message: "User updated successfully" })
              )
              .catch((error) => res.status(400).json({ error }));
          } else {
            res.status(200).json({ message: "No changes made" });
          }
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
