import { Router } from 'express';
import { AreaRepository } from '../repositories/AreaRepository';

const router = Router();

const areaRepository = new AreaRepository();

// Create Area
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const newArea = await areaRepository.create(name, description);
    res.status(201).json(newArea);
  } catch (error) {
    res.status(500).json({ message: 'Error creating area', error });
  }
});

// Get All Areas
router.get('/', async (req, res) => {
  try {
    const areas = await areaRepository.findAll();
    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching areas', error });
  }
});

// Get Area by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const area = await areaRepository.findById(id);
    if (!area) {
      return res.status(404).json({ message: 'Area not found' });
    }
    res.status(200).json(area);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching area', error });
  }
});

// Update Area
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedArea = await areaRepository.update(id, updates);
    if (!updatedArea) {
      return res.status(404).json({ message: 'Area not found' });
    }
    res.status(200).json(updatedArea);
  } catch (error) {
    res.status(500).json({ message: 'Error updating area', error });
  }
});

// Delete Area
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await areaRepository.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Area not found' });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ message: 'Error deleting area', error });
  }
});

export default router;

