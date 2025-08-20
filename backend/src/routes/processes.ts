import { Router } from 'express';
import { ProcessRepository } from '../repositories/ProcessRepository';
import { AreaRepository } from '../repositories/AreaRepository';

const router = Router();

const processRepository = new ProcessRepository();
const areaRepository = new AreaRepository();

// Create Process
router.post('/', async (req, res) => {
  try {
    const { name, description, areaId, parentId, tools, responsible, documentation, type } = req.body;
    
    if (!name || !areaId || !type) {
      return res.status(400).json({ message: 'Name, areaId, and type are required' });
    }

    // Validate that the area exists
    const area = await areaRepository.findById(areaId);
    if (!area) {
      return res.status(400).json({ message: 'Area not found' });
    }

    // Validate that the parent process exists (if provided)
    if (parentId) {
      const parentProcess = await processRepository.findById(parentId);
      if (!parentProcess) {
        return res.status(400).json({ message: 'Parent process not found' });
      }
      // Ensure parent process is in the same area
      if (parentProcess.areaId !== areaId) {
        return res.status(400).json({ message: 'Parent process must be in the same area' });
      }
    }

    const newProcess = await processRepository.create({
      name,
      description,
      areaId,
      parentId: parentId || null,
      tools,
      responsible,
      documentation,
      type: type as 'manual' | 'systemic',
    });

    console.log('PRCEOSS JEANNNNN',newProcess)

    res.status(201).json(newProcess);
  } catch (error) {
    res.status(500).json({ message: 'Error creating process', error });
  }
});

// Get All Processes
router.get('/', async (req, res) => {
  try {
    const { areaId } = req.query;
    let processes;
    
    if (areaId) {
      processes = await processRepository.findByAreaId(areaId as string);
    } else {
      processes = await processRepository.findAll();
    }
    
    res.status(200).json(processes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching processes', error });
  }
});

// Get Process by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const process = await processRepository.findById(id);
    if (!process) {
      return res.status(404).json({ message: 'Process not found' });
    }
    res.status(200).json(process);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching process', error });
  }
});

// Update Process
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // If updating areaId, validate that the area exists
    if (updates.areaId) {
      const area = await areaRepository.findById(updates.areaId);
      if (!area) {
        return res.status(400).json({ message: 'Area not found' });
      }
    }

    // If updating parentId, validate that the parent process exists
    if (updates.parentId) {
      const parentProcess = await processRepository.findById(updates.parentId);
      if (!parentProcess) {
        return res.status(400).json({ message: 'Parent process not found' });
      }
      // Ensure parent process is in the same area
      const currentProcess = await processRepository.findById(id);
      const targetAreaId = updates.areaId || currentProcess?.areaId;
      if (parentProcess.areaId !== targetAreaId) {
        return res.status(400).json({ message: 'Parent process must be in the same area' });
      }
    }

    const updatedProcess = await processRepository.update(id, updates);
    if (!updatedProcess) {
      return res.status(404).json({ message: 'Process not found' });
    }
    res.status(200).json(updatedProcess);
  } catch (error) {
    res.status(500).json({ message: 'Error updating process', error });
  }
});

// Delete Process
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await processRepository.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Process not found' });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ message: 'Error deleting process', error });
  }
});

export default router;

