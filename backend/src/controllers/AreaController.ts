import { Request, Response } from 'express';
import { CreateAreaDto, UpdateAreaDto } from '../dtos/AreaDto';
import { IAreaService } from '../interfaces/IAreaService';
import { container } from '../container/DependencyContainer';

export class AreaController {
  private areaService: IAreaService;

  constructor() {
    this.areaService = container.get<IAreaService>('IAreaService');
  }

  async createArea(req: Request, res: Response): Promise<void> {
    try {
      const createAreaDto: CreateAreaDto = req.body;
      const area = await this.areaService.createArea(createAreaDto);
      res.status(201).json(area);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Name is required') {
          res.status(400).json({ message: error.message });
        } else if (error.message === 'Area with this name already exists') {
          res.status(409).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Error creating area', error: error.message });
        }
      } else {
        res.status(500).json({ message: 'Error creating area' });
      }
    }
  }

  async getAllAreas(req: Request, res: Response): Promise<void> {
    try {
      const areas = await this.areaService.getAllAreas();
      res.status(200).json(areas);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching areas' });
    }
  }

  async getAreaById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const area = await this.areaService.getAreaById(id);
      res.status(200).json(area);
    } catch (error) {
      if (error instanceof Error && error.message === 'Area not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error fetching area' });
      }
    }
  }

  async getAreaWithProcesses(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const area = await this.areaService.getAreaWithProcesses(id);
      res.status(200).json(area);
    } catch (error) {
      if (error instanceof Error && error.message === 'Area not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error fetching area with processes' });
      }
    }
  }

  async updateArea(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateAreaDto: UpdateAreaDto = req.body;
      const area = await this.areaService.updateArea(id, updateAreaDto);
      res.status(200).json(area);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Area not found') {
          res.status(404).json({ message: error.message });
        } else if (error.message === 'Area with this name already exists') {
          res.status(409).json({ message: error.message });
        } else if (error.message === 'Failed to update area') {
          res.status(500).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Error updating area', error: error.message });
        }
      } else {
        res.status(500).json({ message: 'Error updating area' });
      }
    }
  }

  async deleteArea(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.areaService.deleteArea(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Area not found') {
          res.status(404).json({ message: error.message });
        } else if (error.message === 'Cannot delete area with existing processes') {
          res.status(400).json({ message: error.message });
        } else if (error.message === 'Failed to delete area') {
          res.status(500).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Error deleting area', error: error.message });
        }
      } else {
        res.status(500).json({ message: 'Error deleting area' });
      }
    }
  }
}
