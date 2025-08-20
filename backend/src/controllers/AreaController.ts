import { Request, Response } from 'express';
import { CreateAreaDto, UpdateAreaDto } from '../dtos/AreaDto';
import { AreaPaginationQueryDto } from '../dtos/PaginationDto';
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

  async getAreasWithPagination(req: Request, res: Response): Promise<void> {
    try {
      const query: AreaPaginationQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC',
        name: req.query.name as string,
        description: req.query.description as string
      };

      const result = await this.areaService.getAreasWithPagination(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching areas with pagination' });
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

  async getAreasByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const result = await this.areaService.getAreasByName(name, page, limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching areas by name' });
    }
  }

  async getAreasCount(req: Request, res: Response): Promise<void> {
    try {
      const count = await this.areaService.getAreasCount();
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching areas count' });
    }
  }
}
