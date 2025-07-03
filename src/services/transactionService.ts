import { ApiResponse, Transaction, TransactionFilters, PaginatedResponse } from '../types';
import { API_ENDPOINTS } from '../constants';
import { apiService } from './apiService';

interface TransactionQueryParams {
  filters: Partial<TransactionFilters>;
  page: number;
  limit: number;
}

export class TransactionService {
  async getTransactions(params: TransactionQueryParams): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const queryParams = {
      page: params.page,
      limit: params.limit,
      ...params.filters,
    };
    return apiService.get<PaginatedResponse<Transaction>>(API_ENDPOINTS.TRANSACTIONS.LIST, queryParams);
  }

  async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
    return apiService.get<Transaction>(API_ENDPOINTS.TRANSACTIONS.UPDATE.replace(':id', id));
  }

  async createTransaction(data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Transaction>> {
    return apiService.post<Transaction>(API_ENDPOINTS.TRANSACTIONS.CREATE, data);
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
    return apiService.put<Transaction>(API_ENDPOINTS.TRANSACTIONS.UPDATE.replace(':id', id), data);
  }

  async deleteTransaction(id: string): Promise<ApiResponse<any>> {
    return apiService.delete(API_ENDPOINTS.TRANSACTIONS.DELETE.replace(':id', id));
  }

  async syncTransactions(): Promise<ApiResponse<Transaction[]>> {
    return apiService.post<Transaction[]>(API_ENDPOINTS.TRANSACTIONS.SYNC);
  }

  async categorizeTransactions(transactionIds: string[]): Promise<ApiResponse<Transaction[]>> {
    return apiService.post<Transaction[]>(API_ENDPOINTS.TRANSACTIONS.CATEGORIZE, { transactionIds });
  }

  async bulkCategorizeTransactions(data: {
    transactionIds: string[];
    category: string;
    subcategory?: string;
  }): Promise<ApiResponse<Transaction[]>> {
    return apiService.post<Transaction[]>(API_ENDPOINTS.TRANSACTIONS.BULK_CATEGORIZE, data);
  }

  async searchTransactions(query: string): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    return apiService.get<PaginatedResponse<Transaction>>(API_ENDPOINTS.TRANSACTIONS.LIST, { search: query });
  }

  async getTransactionsByCategory(category: string): Promise<ApiResponse<Transaction[]>> {
    return apiService.get<Transaction[]>(API_ENDPOINTS.TRANSACTIONS.LIST, { category });
  }

  async getTransactionsByAccount(accountId: string): Promise<ApiResponse<Transaction[]>> {
    return apiService.get<Transaction[]>(API_ENDPOINTS.TRANSACTIONS.LIST, { accountId });
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<ApiResponse<Transaction[]>> {
    return apiService.get<Transaction[]>(API_ENDPOINTS.TRANSACTIONS.LIST, { startDate, endDate });
  }

  async getRecurringTransactions(): Promise<ApiResponse<Transaction[]>> {
    return apiService.get<Transaction[]>('/transactions/recurring');
  }

  async markAsRecurring(transactionId: string, frequency: string): Promise<ApiResponse<Transaction>> {
    return apiService.post<Transaction>(`/transactions/${transactionId}/mark-recurring`, { frequency });
  }

  async unmarkAsRecurring(transactionId: string): Promise<ApiResponse<Transaction>> {
    return apiService.post<Transaction>(`/transactions/${transactionId}/unmark-recurring`);
  }

  async duplicateTransaction(transactionId: string): Promise<ApiResponse<Transaction>> {
    return apiService.post<Transaction>(`/transactions/${transactionId}/duplicate`);
  }

  async addNote(transactionId: string, note: string): Promise<ApiResponse<Transaction>> {
    return apiService.post<Transaction>(`/transactions/${transactionId}/note`, { note });
  }

  async addTags(transactionId: string, tags: string[]): Promise<ApiResponse<Transaction>> {
    return apiService.post<Transaction>(`/transactions/${transactionId}/tags`, { tags });
  }

  async removeTags(transactionId: string, tags: string[]): Promise<ApiResponse<Transaction>> {
    return apiService.delete(`/transactions/${transactionId}/tags`, { data: { tags } });
  }

  async getTransactionStats(dateRange?: { startDate: string; endDate: string }): Promise<ApiResponse<any>> {
    return apiService.get('/transactions/stats', dateRange);
  }

  async exportTransactions(format: 'csv' | 'pdf' | 'excel', filters?: Partial<TransactionFilters>): Promise<ApiResponse<any>> {
    return apiService.post('/transactions/export', { format, filters });
  }

  async importTransactions(file: File): Promise<ApiResponse<Transaction[]>> {
    const formData = new FormData();
    formData.append('file', file);
    return apiService.upload<Transaction[]>('/transactions/import', formData);
  }

  // AI-powered transaction categorization
  async suggestCategory(transactionId: string): Promise<ApiResponse<{ category: string; confidence: number }>> {
    return apiService.post(`/transactions/${transactionId}/suggest-category`);
  }

  async applySuggestedCategories(suggestions: Array<{ transactionId: string; category: string }>): Promise<ApiResponse<Transaction[]>> {
    return apiService.post<Transaction[]>('/transactions/apply-suggestions', { suggestions });
  }

  // Receipt processing
  async uploadReceipt(transactionId: string, receipt: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('receipt', receipt);
    return apiService.upload(`/transactions/${transactionId}/receipt`, formData);
  }

  async processReceipt(file: File): Promise<ApiResponse<Partial<Transaction>>> {
    const formData = new FormData();
    formData.append('receipt', file);
    return apiService.upload<Partial<Transaction>>('/transactions/process-receipt', formData);
  }
}

export const transactionService = new TransactionService();
