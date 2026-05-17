import type { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/Lead.models.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

// Create a new lead
// POST /api/leads
// @access  Private
export const createLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const lead = await Lead.create({
            ...req.body,
            createdBy: req.user?.id
        });

        res.status(201).json({ success: true, data: lead });
    } catch (error) {
        next(error);
    }
};

// Get all leads
// GET /api/leads
// @access  Private
export const getLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status, source, search, sort = 'latest', page = '1' } = req.query;

        const query: any = {};
        if (status) query.status = status;
        if (source) query.source = source;
        if (search) {
            query.$text = { $search: search as string };
        }

        // Logic
        const sortOption: any = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

        // Pagination (10 records per page)
        const limit = 10;
        const currentPage = parseInt(page as string, 10) || 1;
        const skip = (currentPage - 1) * limit;

        // Execute Query
        const leads = await Lead.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name email');

        const total = await Lead.countDocuments(query);

        res.status(200).json({
            success: true,
            pagination: {
                currentPage,
                totalPages: Math.ceil(total / limit),
                totalRecords: total
            },
            data: leads
        });
    } catch (error) {
        next(error);
    }
};

// Get single lead
// GET /api/leads/:id
// @access  Private
export const getLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
        if (!lead) {
            res.status(404);
            throw new Error('Lead not found');
        }
        res.status(200).json({ success: true, data: lead });
    } catch (error) {
        next(error);
    }
};

// Update lead
// PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!lead) {
            res.status(404);
            throw new Error('Lead not found');
        }

        res.status(200).json({ success: true, data: lead });
    } catch (error) {
        next(error);
    }
};

// Delete lead
// DELETE /api/leads/:id
// @access  Private/Admin
export const deleteLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) {
            res.status(404);
            throw new Error('Lead not found');
        }
        res.status(200).json({ success: true, message: 'Lead deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Export leads to CSV
// GET /api/leads/export/csv
// @access  Private
export const exportLeadsCSV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const leads = await Lead.find({}).populate('createdBy', 'name');
        
        const headers = ['Name', 'Email', 'Status', 'Source', 'Created By', 'Created At'];
        const rows = leads.map(lead => [
            `"${lead.name}"`,
            `"${lead.email}"`,
            `"${lead.status}"`,
            `"${lead.source}"`,
            `"${(lead.createdBy as any)?.name || 'Unknown'}"`,
            `"${lead.createdAt.toISOString()}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');
        res.status(200).send(csvContent);
    } catch (error) {
        next(error);
    }
};