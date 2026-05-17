import { z } from 'zod';

export const createLeadSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
        source: z.enum(['Website', 'Instagram', 'Referral']),
    }),
});

export const updateLeadSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
        source: z.enum(['Website', 'Instagram', 'Referral']).optional(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Lead ID'),
    }),
});

export const getLeadSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Lead ID'),
    }),
});

export const getLeadsSchema = z.object({
    query: z.object({
        status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
        source: z.enum(['Website', 'Instagram', 'Referral']).optional(),
        search: z.string().optional(),
        sort: z.enum(['latest', 'oldest']).optional(),
        page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
    }),
});