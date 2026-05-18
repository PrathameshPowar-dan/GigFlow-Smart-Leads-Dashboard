export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Sales';
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface Lead {
    _id: string;
    name: string;
    email: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
    source: 'Website' | 'Instagram' | 'Referral';
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
    };
}