import { Router } from 'express';
import { AreaController } from '../controllers/AreaController';

const router = Router();
const areaController = new AreaController();

// Create Area
router.post('/', (req, res) => areaController.createArea(req, res));

// Get All Areas
router.get('/', (req, res) => areaController.getAllAreas(req, res));

// Get Area by ID
router.get('/:id', (req, res) => areaController.getAreaById(req, res));

// Get Area with Processes
router.get('/:id/processes', (req, res) => areaController.getAreaWithProcesses(req, res));

// Update Area
router.put('/:id', (req, res) => areaController.updateArea(req, res));

// Delete Area
router.delete('/:id', (req, res) => areaController.deleteArea(req, res));

export default router;

