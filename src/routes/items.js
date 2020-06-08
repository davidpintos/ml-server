const { Router } = require('express');
const router = Router();

const { getItems, getItem } = require('../controllers/items.controller');

router.route('')
    .get(getItems);

router.route('/:id')
    .get(getItem);

module.exports = router;


