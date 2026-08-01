import { app } from './app.js';
import { config } from './config.js';
import { prisma } from './db.js';
const PORT = config.port;
async function startServer() {
    try {
        await prisma.$connect();
        console.log('[Playorithm Backend] Database connected successfully.');
        app.listen(PORT, () => {
            console.log(`[Playorithm Backend] Server listening on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('[Playorithm Backend] Startup failure:', error);
        process.exit(1);
    }
}
startServer();
