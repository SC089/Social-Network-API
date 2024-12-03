"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const thoughtController_1 = require("../../controllers/thoughtController");
const router = (0, express_1.Router)();
// Get all thoughts and create a new thought
router.route('/')
    .get(thoughtController_1.thoughtController.getThoughts) // GET all thoughts
    .post(thoughtController_1.thoughtController.createThought); // POST create a new thought
// Get, update, or delete a thought by its ID
router.route('/:id')
    .get(thoughtController_1.thoughtController.getThoughtById) // GET a single thought by ID
    .put(thoughtController_1.thoughtController.updateThought) // PUT update a thought by ID
    .delete(thoughtController_1.thoughtController.deleteThought); // DELETE a thought by ID
// Add a reaction to a specific thought
router.route('/:thoughtId/reactions')
    .post(thoughtController_1.thoughtController.addReaction); // POST add a reaction to a thought
router.route('/:thoughtId/reactions/:reactionId')
    .delete(thoughtController_1.thoughtController.removeReaction); // DELETE a reaction by reaction ID
exports.default = router;
