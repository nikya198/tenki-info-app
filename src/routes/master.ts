import mysql2 from 'mysql2/promise';
import express from 'express';
import { getRegin, getPref, getCity } from '../controllers/master';

const router = express.Router();

router.get('/region', getRegin);
router.get('/region/:reginCd/pref', getPref);
router.get('/pref/:prefCd/city', getCity);
export default router;
