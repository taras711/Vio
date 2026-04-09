export interface Machine {
  id: string;
  name: string;
  description?: string;
  serialNumber?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMachineDto {
  name: string;
  description?: string;
  serialNumber?: string;
  location?: string;
}

export interface UpdateMachineDto {
  name?: string;
  description?: string;
  serialNumber?: string;
  location?: string;
  isActive?: boolean;
}