// It was decided to handle user routes in three separate files: "loginRoutes", "logoutRoutes" and "signupRoutes".
// This is the login route.  It finds the user and then validates the password with the checkPassword call.
const router = require('express').Router();
const { User } = require('../../models');
const auth = require('../../utils/auth')

// router.get('/', async (req, res) => {
//     console.log('test route');
//     res.status(200).json({ message: 'test route' });
// });

// router.post('/test', async (req, res) => {
//     console.log('Post route');
//     res.status(200).json({ message: 'Post route' });
// });

router.post('/', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { username: req.body.username } });
        // console.log('userData');
        // console.log(userData);
        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect Username or password, please try again' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);
        // console.log('validPassword');

        // console.log(validPassword);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect Username or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.userName = userData.username;
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'You are now logged in!' });


        });

        // console.log('req.session on log in');
        // console.log(req.session);


    } catch (err) {
        // console.log(err);

        res.status(400).json(err);
    }
});

module.exports = router;
