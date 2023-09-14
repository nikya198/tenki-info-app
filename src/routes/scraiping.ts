import { Router } from 'express';
import { getScraipingData } from '../controllers/scraiping';

const router = Router();

router.get('/:reginCd/:prefCd/:districtCd/:cityCd', getScraipingData);

export default router;
