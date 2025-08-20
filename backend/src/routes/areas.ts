import { Router } from 'express';
import { AreaController } from '../controllers/AreaController';

const router = Router();
const areaController = new AreaController();

// Rotas básicas
router.post('/', (req, res) => areaController.createArea(req, res));
router.get('/', (req, res) => areaController.getAllAreas(req, res));

// Rotas com paginação
router.get('/paginated', (req, res) => areaController.getAreasWithPagination(req, res));
router.get('/count', (req, res) => areaController.getAreasCount(req, res));
router.get('/search/:name', (req, res) => areaController.getAreasByName(req, res));

// Rotas por ID
router.get('/:id', (req, res) => areaController.getAreaById(req, res));
router.get('/:id/with-processes', (req, res) => areaController.getAreaWithProcesses(req, res));
router.put('/:id', (req, res) => areaController.updateArea(req, res));
router.delete('/:id', (req, res) => areaController.deleteArea(req, res));

export default router;

