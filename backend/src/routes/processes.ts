import { Router } from 'express';
import { ProcessController } from '../controllers/ProcessController';

const router = Router();
const processController = new ProcessController();

// Rotas básicas
router.post('/', (req, res) => processController.createProcess(req, res));
router.get('/', (req, res) => processController.getAllProcesses(req, res));

// Rotas com paginação
router.get('/paginated', (req, res) => processController.getProcessesWithPagination(req, res));
router.get('/hierarchical', (req, res) => processController.getProcessesHierarchical(req, res));
router.get('/count', (req, res) => processController.getProcessesCount(req, res));
router.get('/area/:areaId/paginated', (req, res) => processController.getProcessesByAreaWithPagination(req, res));
router.get('/area/:areaId/count', (req, res) => processController.getProcessesCountByArea(req, res));

// Rotas por ID
router.get('/:id', (req, res) => processController.getProcessById(req, res));
router.get('/:id/with-details', (req, res) => processController.getProcessWithDetails(req, res));
router.put('/:id', (req, res) => processController.updateProcess(req, res));
router.delete('/:id', (req, res) => processController.deleteProcess(req, res));

export default router;

