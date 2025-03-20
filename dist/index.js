"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const admin_ui_1 = require("@socket.io/admin-ui");
const redis_streams_adapter_1 = require("@socket.io/redis-streams-adapter");
const redis_1 = require("./redis");
const socket_1 = require("./socket");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [process.env.CLIENT_URL, "https://admin.socket.io"],
        methods: ["GET", "POST"],
        credentials: true
    },
    adapter: (0, redis_streams_adapter_1.createAdapter)(redis_1.redis)
});
(0, socket_1.setUpSocketServer)(io);
(0, admin_ui_1.instrument)(io, {
    auth: false,
    mode: "development",
});
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('Websocket server is running');
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`WebSocket server running on port ${PORT}`));
