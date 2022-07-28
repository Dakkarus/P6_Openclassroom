const express =require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

router.post('/', saucesCtrl.createSauce );
router.get('/',saucesCtrl.getAllSauce);
router.get('/:id',saucesCtrl.getOneSauce );
router.put('/:id', saucesCtrl.updateSauce );
router.delete(':id', saucesCtrl.deleteSauce );

module.exports = router;
