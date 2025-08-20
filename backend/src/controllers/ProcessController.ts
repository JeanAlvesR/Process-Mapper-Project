import { Request, Response } from 'express';
import { CreateProcessDto, UpdateProcessDto } from '../dtos/ProcessDto';
import { IProcessService } from '../interfaces/IProcessService';
import { container } from '../container/DependencyContainer';

export class ProcessController {
  private processService: IProcessService;

  constructor() {
    this.processService = container.get<IProcessService>('IProcessService');
  }

  async createProcess(req: Request, res: Response): Promise<void> {
    try {
      const createProcessDto: CreateProcessDto = req.body;
      const process = await this.processService.createProcess(createProcessDto);
      res.status(201).json(process);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('required')) {
          res.status(400).json({ message: error.message });
        } else if (error.message === 'Area not found') {
          res.status(400).json({ message: error.message });
        } else if (error.message === 'Parent process not found') {
          res.status(400).json({ message: error.message });
        } else if (error.message === 'Parent process must be in the same area') {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Error creating process', error: error.message });
        }
      } else {
        res.status(500).json({ message: 'Error creating process' });
      }
    }
  }

  async getAllProcesses(req: Request, res: Response): Promise<void> {
    try {
      const { areaId } = req.query;
      const processes = await this.processService.getAllProcesses(areaId as string);
      res.status(200).json(processes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching processes' });
    }
  }

  async getProcessById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const process = await this.processService.getProcessById(id);
      res.status(200).json(process);
    } catch (error) {
      if (error instanceof Error && error.message === 'Process not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error fetching process' });
      }
    }
  }

  async getProcessWithDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const process = await this.processService.getProcessWithDetails(id);
      res.status(200).json(process);
    } catch (error) {
      if (error instanceof Error && error.message === 'Process not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error fetching process with details' });
      }
    }
  }

  async updateProcess(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateProcessDto: UpdateProcessDto = req.body;
      const process = await this.processService.updateProcess(id, updateProcessDto);
      res.status(200).json(process);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Process not found') {
          res.status(404).json({ message: error.message });
        } else if (error.message === 'Area not found') {
          res.status(400).json({ message: error.message });
        } else if (error.message === 'Parent process not found') {
          res.status(400).json({ message: error.message });
        } else if (error.message === 'Parent process must be in the same area') {
          res.status(400).json({ message: error.message });
        } else if (error.message === 'Failed to update process') {
          res.status(500).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Error updating process', error: error.message });
        }
      } else {
        res.status(500).json({ message: 'Error updating process' });
      }
    }
  }

  async deleteProcess(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.processService.deleteProcess(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Process not found') {
          res.status(404).json({ message: error.message });
        } else if (error.message === 'Cannot delete process with existing children') {
          res.status(400).json({ message: error.message });
        } else if (error.message === 'Failed to delete process') {
          res.status(500).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Error deleting process', error: error.message });
        }
      } else {
        res.status(500).json({ message: 'Error deleting process' });
      }
    }
  }
}
