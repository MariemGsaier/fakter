const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Op = db.Sequelize.Op;
var nodemailer = require("nodemailer");
// const Role = db.role;
// const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { password } = require("pg/lib/defaults");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then((user) => {
      if (user) {
        authEmail( user.email , user.username);
        res.send({ message: "User was registered successfully!" });
        
  
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
async function authEmail( email,username){
  var transport = await nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d40e8b0694c73d", 
      pass: "accfebdb847e90" 
    }
  });
  var mailOptions = {
  from: `"Omar Elloumi", "SuperAdmin@gmail.com"`,
  to: `<${email}>`,
  subject: "Accés Fakter ",
  html: "<p>Bonjour cher utilisateur, </p>  <p><strong>Bienvenue</strong>, vous pouvez accéder maintenant à votre espace chez Fakter.</p><br> <p>Votre nom d'utilisateur est : " + `${username}` + ".</p><br> Veuillez changer votre mot de passe immédiatement en raison de sécurité à travers ce   <a href='http://localhost:4200/change-pw'>lien<a>",
      
    
};
await transport.sendMail(mailOptions, (error, info) => {
  if (error) {
      return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});
}

exports.forgotPw = (req, res) => {
  const email= req.body.email;
  User.findOne({
    where: { email: email },
  })
  .then(data => {
    res.send(data);
    const secretk = config.secret + data.password ;
    const payload = {
      email : data.email,
      id : data.id

    }
    const resetlink = jwt.sign(payload,secretk,{expiresIn : '15m'})
    User
    .update(data.id, { resetlink })
    var transport =  nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "d40e8b0694c73d", 
        pass: "accfebdb847e90" 
      }
    });
    var mailOptions = {
    from: `"Omar Elloumi", "noreply@hello.com"`,
    to: `<${email}>`,
    subject: "Mot de passe oublié ",
    html: "<p>Bonjour cher utilisateur,<br><br> Une réinitialisation du mot de passe a été demandée pour le compte Fakter lié à cet e-mail.<br><br> Vous pouvez changer votre mot de passe en suivant <a href='http://localhost:4200/forgot-pw'>ce lien<a>. <br><br>Note : Si vous ne vous attendez pas à cela, vous pouvez ignorer cet e-mail.</p>",
        
      
  };
   transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "L'email est inexistant."
    });
  })

}
exports.changeFirstPw =(req,res) => {
  const username = req.body.username;
  const nouvpass = req.body.password
  // var condition = username ? { username: { [Op.iLike]: `%${username}%` } } : null;

  if (nouvpass != null) {
    req.body.password=bcrypt.hashSync(req.body.password, 8);
    User
    .update(req.body, {
      where: { username : username }
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "password was updated successfully.",
          
        });
        console.log ("hh",req.body);
      } else {
        res.send({
          message: `Cannot update password . Maybe user was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating user",
      });
    });

  }
}

    
 
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      var passwordIsValid  = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });
      if (!user) {
        return res
          .status(404)
          .send({ message: "User Not found or username is invalid!" });
      } else if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      } else {
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          accessToken: token,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
