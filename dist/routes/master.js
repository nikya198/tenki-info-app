"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const master_1 = require("../controllers/master");
const router = express_1.default.Router();
router.get('/region', master_1.getRegin);
router.get('/region/:reginCd/pref', master_1.getPref);
router.get('/pref/:prefCd/city', master_1.getCity);
exports.default = router;
