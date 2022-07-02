import express from 'express';
const router = express.Router();
import * as controller from './chapters.js';

router.post('/chapters/latest', controller.getLatest);

router.post('/chapters/search', controller.searchForChapters);

router.post('/chapters/read', controller.getChapter);

export default router;