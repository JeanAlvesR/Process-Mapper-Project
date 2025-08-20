import { Router } from 'express';
import { ProcessController } from '../controllers/ProcessController';

const router = Router();
const processController = new ProcessController();

// Create Process
router.post('/', (req, res) => processController.createProcess(req, res));

// Get All Processes
router.get('/', (req, res) => processController.getAllProcesses(req, res));

// Get Process by ID
router.get('/:id', (req, res) => processController.getProcessById(req, res));

// Get Process with Details
router.get('/:id/details', (req, res) => processController.getProcessWithDetails(req, res));

// Update Process
router.put('/:id', (req, res) => processController.updateProcess(req, res));

// Delete Process
router.delete('/:id', (req, res) => processController.deleteProcess(req, res));

export default router;

