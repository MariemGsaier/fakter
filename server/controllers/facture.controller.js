const db = require("../models");
const facture = db.facture;
const Op = db.Sequelize.Op;
const client = db.client;
var nodemailer = require("nodemailer");
exports.create = (req, res) => {
  if (!req.body.reference) {
    res.status(400).send({
      message: "contenu vide !",
    });
    return;
  }
  const fact = {
    reference: req.body.reference,
    créé_par: req.body.créé_par,
    date_facturation: req.body.date_facturation,
    date_echeance: req.body.date_echeance,
    etat_facture: req.body.courriel,
    etat_echeance: req.body.etat_echeance,
    total_ht: req.body.total_ht,
    total_ttc: req.body.total_ttc,
    total_devise: req.body.total_devise,
    id_client : req.body.id_client,
    id_compte : req.body.id_compte,
    id_user : req.body.id_user,
    nom_devise : req.body.nom_devise,
  };

  facture
    .create(fact)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message 
      });
    });
};

// fetch all factures from the database.
exports.findAll = (req, res) => {
  const reference = req.query.reference;
  var condition = reference
    ? { reference: { [Op.iLike]: `%${reference}%` } }
    : null;
  facture
    .findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while fetching factures.",
      });
    });
};

// Update a facture by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  facture
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "facture was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update facture with id=${id}. Maybe facture was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
      });
    });
};

exports.factureEmail= (req, res) => {
  const courriel = req.body.courriel;
  client.findOne({
    where: {
      courriel: courriel,
    },
  })
  .then((client)  => {
    if(client){
      res.status(200).send({ message: "le courrriel existed !" });
      var transport =  nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "d40e8b0694c73d", 
          pass: "accfebdb847e90" 
        }
      });
      var mailOptions = {
      from: `"Omar Elloumi", "noreply@fakter.com"`,
      to: `<${courriel}>`,
      subject: "Mot de passe oublié ",
      html: "<p>Bonjour cher"+ `<${client.nom}>` +" ,<br><br> Une réinitialisation du mot de passe a été demandée pour le compte Fakter lié à cet e-mail.<br><br> Vous pouvez changer votre mot de passe en suivant <a href='http://localhost:4200/forgot-pw'>ce lien<a>. <br><br>Note : Si vous ne vous attendez pas à cela, vous pouvez ignorer cet e-mail.</p>",
          
        
    };
     transport.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });

    }
    else {
      res.status(500).send({ message: "le courriel est inexistant !" });

    }
   
  } )
}


