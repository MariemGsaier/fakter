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
    num_boncommande : req.body.num_boncommande,
    date_facturation: req.body.date_facturation,
    date_echeance: req.body.date_echeance,
    etat_facture: req.body.etat_facture,
    etat_echeance: req.body.etat_echeance,
    total_ht: req.body.total_ht,
    total_ttc: req.body.total_ttc,
    total_devise: req.body.total_devise,
    id_client : req.body.id_client,
    num_compte : req.body.num_compte,
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
        message: err.message 
      });
    });
};

// fetch factures with users / clients 
exports.findAllDetails = (req, res) => {

facture.findAll({
    include: ["user","client"],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
      });
    });
};

// Find a single ligne facture of client with an id
exports.findOneArticle = (req, res) => {
  const id_client = req.params.id_client;
  facture
    .findOne({
      where: { id_client: id_client },
    })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(201).send({
          message: `Cannot find client with nom =${id_client}.`,
          status : 201
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving client with id =" + id_client,
      });
    });
};
// Find a single ligne facture of bank account with an id
exports.findOneAccount = (req, res) => {
  const num_compte = req.params.num_compte;
  facture
    .findOne({
      where: { num_compte: num_compte },
    })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(201).send({
          message: `Cannot find account with numéro =${num_compte}.`,
          status : 201
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving account with numéro =" + num_compte,
      });
    });
};


// Find a single ligne facture of devise with an id
exports.findOneDevise = (req, res) => {
  const nom_devise = req.params.nom_devise;
  facture
    .findOne({
      where: { nom_devise: nom_devise },
    })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(201).send({
          message: `Cannot find devise with nom =${nom_devise}.`,
          status : 201
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving devise with nom =" + nom_devise,
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


