import { Router, Request, Response } from 'express';
import { Task } from '../models/Task';
import { asyncHandler } from '../middleware/asyncHandler';
import { checkJwt } from '../middleware/checkJwt';

const router = Router();

// Get tasks for a specific user
router.get('/user/:userId', [checkJwt], asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const tasks = await Task.find({ userId });
    res.json(tasks);
}));

// Create a new task (FIXED: Uses spread operator to capture ALL fields instantly)
router.post('/', [checkJwt], asyncHandler(async (req: Request, res: Response) => {
    const newTask = new Task({ ...req.body });
    await newTask.save();
    res.status(201).json(newTask);
}));

// Update a task
router.patch('/:id', [checkJwt], asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedTask);
}));

// Delete a task
router.delete('/:id', [checkJwt], asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(204).send();
}));

export default router;