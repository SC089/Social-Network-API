import { Router } from 'express';
import { userController } from '../../controllers/userController';

const router = Router();

router.route('/')
    .get(userController.getUsers) // GET all users
    .post(userController.createUser); // POST create new user

router.route('/:id')
    .get(userController.getUserById) // GET a user by id
    .put(userController.updateUser) // PUT update user
    .delete(userController.deleteUser); // DELETE a user

router.route('/:userId/friends/:friendId')
    .post(userController.addFriend) // POST add friend
    .delete(userController.removeFriend); // DELETE remove a friend
    
export default router;
