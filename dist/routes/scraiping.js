"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scraiping_1 = require("../controllers/scraiping");
const router = (0, express_1.Router)();
router.get('/:reginCd/:prefCd/:districtCd/:cityCd', scraiping_1.getScraipingData);
exports.default = router;
