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


// Get all
router.get('/', (req, res) => {
    zooDB('zoos')
        .then(names => {
            res.status(200).json(names);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


// Get by given id parameter. ID must match an existing ID
router.get('/:id', (req, res) => {
    // const roleId = req.params.id;
    const { id } = req.params
    zooDB('zoos')
        // .where({ id: roleId }) // Same thing
        .where({ id })
        .first()
        .then(names => {
            if(!names) {
                res.status(404).json({ message: "Sorry, zoo by given ID not found." })
            } else {
                res.status(200).json(names);
            }
        })
        .catch(error => {
            res.status(500).json(error);
        })
})


// Insert/add route. Creates a new zoo in the zoos table. Name required; fails if no name supplied.
// Name must be unique; fails if name already exists.
router.post('/', (req, res) => {
    if(!req.body.name) {
        return res.status(400).json({ message: "Name required. Please include a name for the new zoo." })
    }
    zooDB('zoos')
        .insert(req.body)
        .then(ids => {
            
            const id = ids[0]
            zooDB('zoos')
                .where({ id })
                .first()
                .then(name => {
                    res.status(201).json(name.id)
                })
        })
        .catch(error => {
            if (error.errno === 19) {
                res.status(409).json({ message: "Please choose a unique zoo name. Zoo name already exists." })
            }
            res.status(500).json(error)
        })
})


// Update route without ID Parameter
router.put('/', (req, res) => {
    res.status(500).json({ message: "ID required to update" })
})


// Update route. ID Parameter required
router.put('/:id', (req, res) => {
    zooDB('zoos')
        .where({ id: req.params.id })
        .update(req.body)
        .then(count => {
            if (count > 0) {
                res.status(200).json(count);
            } else {
                res.status(404).json({ 
                    message: "Record not found. Cannot update."
                });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


// Delete route without ID parameter
router.delete('/', (req, res) => {
    res.status(500).json({ message: "ID required to delete" })
})


// Delete route. ID parameter required
router.delete('/:id', (req, res) => {
    zooDB('zoos')
        .where({ id: req.params.id })
        .del()
        .then(count => {
            if (count > 0) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: "Record not found. Cannot delete." });
            }
        })
        .catch(error => {
            res.status(500).json(error);
    });
});


module.exports = router;

