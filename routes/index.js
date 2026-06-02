const express = require('express');
const router = express.Router();
var contactService = require("../services/contact.service");
const { loggedIn, isAdmin } = require('./authmiddlewares');


router.get('/', (req, res) => {
  try {
    return res.render('index', { title: 'OceanBytes – Moderne SaaS for dataflyt', index: true, username: req.user?.username, role: req.user?.role || 'user' });
  } catch (err) {
    console.error('Feil ved rendering av index:', err);
    return res.status(500).send('Noe gikk galt. Prøv igjen senere.');
  }
});

router.post('/contact', async (req, res) => {
  try {
    // const { name, email, message } = req.body;
    await contactService.contactUs(req.body)
    return res.redirect('/?contact=success');
  } catch (err) {
    console.error('Feil ved behandling av kontaktforespørsel:', err);
    return res.status(500).send('Noe gikk galt. Prøv igjen senere.');
  }
});


module.exports = router;