const router = require('express').Router();
const { User, Messages, Room} = require('../models');
const auth = require('../utils/auth')

router.get('/', async (req, res) => {
    try {
        const roomData = await Room.findAll({
            include: [{
                model: User,
                through: Messages,
            }]
        });
        const newRoomData = roomData.map(room => room.get ({ plain:true }));
        //console.log(newRoomData);
        res.render('login', {newRoomData});
    } catch (error) {
        res.status(500).json(error)
    };
});
// router.get('/',(req,res)=>{
//     res.redirect('/chat')
// })
// router.get('/chat', (req, res) => {
//     res.render('chat')
// })
// // com
router.get('/chat', async (req, res) => {
    try {

        res.render('chat');
    } catch (error) {
        res.status(500).json(error)
    };
});

router.get('/signup', async (req,res) => {
    try {
        res.render('signup');
    } catch (error) {
        res.status(500).json(error);
    }
})

// router.get('/profile', async (req, res) => {
//     try {

//         res.render('profile');
//     } catch (error) {
//         res.status(500).json(error)
//     };
// });

// router.get('/sessions', async (req, res) => {
//     try {
//         const sessions = req.session.userName;
//         // Respond with the fetched sessions
//         res.json(sessions);
//     } catch (error) {
//         // Handle any errors that occurred during the database operation
//         console.error('Error retrieving sessions:', error);
//         res.status(500).json({ error: 'Failed to retrieve sessions' });
//     }
// });





module.exports = router;