"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../../controllers/userController");
const router = (0, express_1.Router)();
router.route('/')
    .get(userController_1.userController.getUsers) // GET all users
    .post(userController_1.userController.createUser); // POST create new user
router.route('/:id')
    .get(userController_1.userController.getUserById) // GET a user by id
    .put(userController_1.userController.updateUser) // PUT update user
    .delete(userController_1.userController.deleteUser); // DELETE a user
router.route('/:userId/friends/:friendId')
    .post(userController_1.userController.addFriend) // POST add friend
    .delete(userController_1.userController.removeFriend); // DELETE remove a friend
exports.default = router;
