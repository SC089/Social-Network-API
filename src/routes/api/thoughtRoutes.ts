import { Router } from 'express';
import { thoughtController } from '../../controllers/thoughtController';

const router = Router();

// Get all thoughts and create a new thought
router.route('/')
    .get(thoughtController.getThoughts) // GET all thoughts
    .post(thoughtController.createThought); // POST create a new thought

// Get, update, or delete a thought by its ID
router.route('/:id')
    .get(thoughtController.getThoughtById) // GET a single thought by ID
    .put(thoughtController.updateThought) // PUT update a thought by ID
    .delete(thoughtController.deleteThought); // DELETE a thought by ID

// Add a reaction to a specific thought
router.route('/:thoughtId/reactions')
    .post(thoughtController.addReaction) // POST add a reaction to a thought

router.route('/:thoughtId/reactions/:reactionId')
    .delete(thoughtController.removeReaction); // DELETE a reaction by reaction ID

export default router;
