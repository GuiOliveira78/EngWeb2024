var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET compositores listing. */
router.get('/', function (req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get("http://localhost:3000/compositores/")
    .then(resp => {
      compositores = resp.data
      res.status(200).render("compositoresListPage", {"compositores" : compositores, "date" : d})
      
    })
    .catch(erro => {
      res.status(501).render("error", {"error" : erro})
      
    })
});

// GET /compositores/:id --------------------------------------------------------------------
router.get('/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  id = req.params.id
  axios.get("http://localhost:3000/compositores/" + id)
      .then(resp =>{
          var compositor = resp.data
          res.status(200).render("compositorPage", {"compositor" : compositor, "date" : d})
      })
      .catch(erro =>{
        res.status(502).render("error", {"error" : erro})
      })
});

module.exports = router;
