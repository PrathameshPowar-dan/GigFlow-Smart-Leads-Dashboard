import { Router } from 'express';
import { createLead, getLeads, getLead, updateLead, deleteLead, exportLeadsCSV } from '../controllers/lead.controller.js';
import { protect, authorizeRoles } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createLeadSchema, updateLeadSchema, getLeadSchema, getLeadsSchema } from '../validators/lead.validator.js';

const router = Router();

router.use(protect);

// CSV Export
router.get('/export/csv', exportLeadsCSV);

// Lead Routes
router.post('/', validate(createLeadSchema), createLead);
router.get('/', validate(getLeadsSchema), getLeads);

router.get('/:id', validate(getLeadSchema), getLead);
router.put('/:id', validate(updateLeadSchema), updateLead);
router.delete('/:id', validate(getLeadSchema), authorizeRoles('Admin'), deleteLead);

export default router;