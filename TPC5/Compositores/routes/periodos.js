var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET periodos listing. */
router.get('/', function (req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get("http://localhost:3000/periodos/")
    .then(resp => {
      periodos = resp.data
      res.status(200).render("periodosListPage", {"periodos" : periodos, "date" : d})
    })
    .catch(erro => {
      res.status(501).render("error", {"error" : erro})
      
    })
});

// GET /compositores/:id --------------------------------------------------------------------
router.get('/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  id = req.params.id
  
  axios.get("http://localhost:3000/periodos/" + id)
      .then(resp =>{
          var periodo = resp.data
          res.status(200).render("periodoPage", {"periodo" : periodo, "date" : d})
      })
      .catch(erro =>{
        res.status(502).render("error", {"error" : erro})
      })
});

module.exports = router;