const router = require('express').Router();
const knex = require('knex'); 

const knexConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './data/lambda.sqlite3',
    },
    debug: true,
};

const zooDB = knex(knexConfig);



router.get('/', (req, res) => {
    zooDB('zoos')
        .then(names => {
            res.status(200).json(names);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


router.get('/:id', (req, res) => {
    // const roleId = req.params.id;
    const { id } = req.params
    zooDB('zoos')
    // .where({ id: roleId }) // Same thing
        .where({ id })
        .first()
        .then(names => {
            res.status(200).json(names);
        })
        .catch(error => {
            res.status(500).json(error);
        })
})


router.post('/', (req, res) => {
    zooDB('zoos')
        .insert(req.body)
        .then(ids => {
            const id = ids[0]
            zooDB('zoos')
                .where({ id })
                .first()
                .then(name => {
                    res.status(201).json(name)
                })
        })
        .catch(error => {
            res.status(500).json(error)
        })
})


router.put('/:id', (req, res) => {
    zooDB('zoos')
        .where({ id: req.params.id })
        .update(req.body)
        .then(count => {
            if (count > 0) {
                res.status(200).json(count);
            } else {
                res.status(404).json({ 
                    message: 'Record not found' 
                });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


module.exports = router;

