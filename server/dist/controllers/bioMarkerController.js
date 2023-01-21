"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBioMarkers = exports.createBioMarker = void 0;
const customError_1 = require("../errors/customError");
const CatchAsync_1 = __importDefault(require("../middlewares/CatchAsync"));
const BioMarker_1 = __importDefault(require("../models/BioMarker"));
exports.createBioMarker = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, unit, alias, bioMarkerTypes } = req.body;
    //Check if biomarker name already exists
    if (yield BioMarker_1.default.find({ name: name }))
        return next((0, customError_1.createCustomError)('Bio Marker already exists. Edit the existing one.', 403));
    //Check if any of the aliases exist
    if (alias) {
        if (yield BioMarker_1.default.findOne({ alias: { $in: [...alias, name] } }))
            return next((0, customError_1.createCustomError)('Bio Marker already exists. Edit the existing one.', 403));
    }
    const newBioMarker = yield BioMarker_1.default.create({
        name, unit, alias, bioMarkerTypes
    });
    res.status(201).json({ status: 'Success', message: 'Biomarker created.', data: newBioMarker });
}));
exports.getBioMarkers = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bioMarkers = yield BioMarker_1.default.find();
    res.status(200).json({ status: 'Success', results: bioMarkers.length, data: bioMarkers });
}));
