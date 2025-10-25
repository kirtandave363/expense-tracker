import api from '@/lib/api';

export interface CreateExpenseData {
    title: string;
    amount: number;
    category: string;
    date?: string;
    description?: string;
}

export interface UpdateExpenseData {
    title?: string;
    amount?: number;
    category?: string;
    date?: string;
    description?: string;
}

export interface Expense {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    description?: string;
}

export interface CreateExpenseResponse {
    message: string;
    expense: Expense;
}

export interface UpdateExpenseResponse {
    message: string;
    expense: Expense;
}

export interface DeleteExpenseResponse {
    message: string;
    id: string;
}

class ExpenseService {
    async createExpense(data: CreateExpenseData): Promise<CreateExpenseResponse> {
        const response = await api.post<CreateExpenseResponse>('/expenses', data);
        return response.data;
    }

    async updateExpense(id: string, data: UpdateExpenseData): Promise<UpdateExpenseResponse> {
        const response = await api.patch<UpdateExpenseResponse>(`/expenses/${id}`, data);
        return response.data;
    }

    async deleteExpense(id: string): Promise<DeleteExpenseResponse> {
        const response = await api.delete<DeleteExpenseResponse>(`/expenses/${id}`);
        return response.data;
    }
}

export default new ExpenseService();
