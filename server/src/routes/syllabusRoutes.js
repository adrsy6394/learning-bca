import express from 'express';
import { getSyllabus } from '../controller/syllabusController.js';

const router = express.Router();

router.get('/', getSyllabus);

export default router;
