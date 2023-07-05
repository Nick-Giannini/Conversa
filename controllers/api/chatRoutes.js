// This is the route that gets a specific room and its associated users and messages.  A team member must have changed this route because when Dave annotated this file, the param ":id" was missing from the "router.get" line and this was previously working in Insomnia using the "/api/chat/:id" route.  It now uses the "/api/:id route."
const router = require('express').Router();
const {Messages, User, Room} = require('../../models')

// router.get('/', async (req, res) => {
//     try {
//         const roomData = await Room.findByPk(req.params.id, {
//             include:[{model:User, through:Messages}],
//         });


router.get('/:id', async (req, res) => {
    try {
        const roomData = await Room.findByPk(req.params.id, {
            include:[{model:User, through:Messages}],
        });

        console.log(roomData);
        res.json(roomData)

    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;