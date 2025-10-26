import api from '@/lib/api';

export interface CreateEMIData {
    title: string;
    amount: number;
    startDate: string;
    endDate: string;
    dayOfMonth: number;
}

export interface UpdateEMIData {
    title?: string;
    amount?: number;
    startDate?: string;
    endDate?: string;
    dayOfMonth?: number;
    isActive?: boolean;
}

export interface EMI {
    id: string;
    title: string;
    amount: number;
    startDate: string;
    endDate: string;
    dayOfMonth: number;
    isActive: boolean;
}

export interface CreateEMIResponse {
    message: string;
    emi: EMI;
}

export interface GetEMIsResponse {
    emis: EMI[];
}

export interface UpdateEMIResponse {
    message: string;
    emi: EMI;
}

export interface DeleteEMIResponse {
    message: string;
    id: string;
}

class EMIService {
    async createEMI(data: CreateEMIData): Promise<CreateEMIResponse> {
        const response = await api.post<CreateEMIResponse>('/emis', data);
        return response.data;
    }

    async getEMIs(): Promise<GetEMIsResponse> {
        const response = await api.get<GetEMIsResponse>('/emis');
        return response.data;
    }

    async updateEMI(id: string, data: UpdateEMIData): Promise<UpdateEMIResponse> {
        const response = await api.patch<UpdateEMIResponse>(`/emis/${id}`, data);
        return response.data;
    }

    async deleteEMI(id: string): Promise<DeleteEMIResponse> {
        const response = await api.delete<DeleteEMIResponse>(`/emis/${id}`);
        return response.data;
    }
}

export default new EMIService();
