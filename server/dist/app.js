"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const bioMarkerRoutes_1 = __importDefault(require("./routes/bioMarkerRoutes"));
const unitsRoutes_1 = __importDefault(require("./routes/unitsRoutes"));
const labTestRoutes_1 = __importDefault(require("./routes/labTestRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const ocrDataRoutes_1 = __importDefault(require("./routes/ocrDataRoutes"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    max: 1000,
    windowMs: 60 * 1000 * 1000,
    message: 'Too many requests from this ip. Try again later.'
});
app.use((0, cors_1.default)({
    credentials: true,
    // origin: "http://3.6.178.87/", 
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));
app.use((0, helmet_1.default)());
app.use('/api', limiter);
app.use(express_1.default.json({ limit: '25kb' }));
app.use((0, express_mongo_sanitize_1.default)());
app.get('/', (req, res) => {
    res.send('Jeevan Khata');
});
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/roles', roleRoutes_1.default);
app.use('/api/v1/bioMarkers', bioMarkerRoutes_1.default);
app.use('/api/v1/units', unitsRoutes_1.default);
app.use('/api/v1/labTests', labTestRoutes_1.default);
app.use('/api/v1/uploads', uploadRoutes_1.default);
app.use('/api/v1/ocrData', ocrDataRoutes_1.default);
app.use(errorHandler_1.default);
exports.default = app;
