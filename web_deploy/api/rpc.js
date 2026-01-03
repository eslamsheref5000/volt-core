
import axios from 'axios';

// The address of your Home PC Node
const NODE_URL = 'http://volt-core.zapto.org:6001';

export default async function handler(req, res) {
    // CORS Handling
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        console.log(`[Vercel Proxy] Forwarding to ${NODE_URL}`);
        const response = await axios.post(NODE_URL, req.body, { timeout: 3000 });
        res.status(200).json(response.data);
    } catch (error) {
        console.error(`[Proxy Error]`, error.message);
        res.status(500).json({
            error: "Node unreachable",
            details: error.message,
            hint: "Make sure Port 6001 is forwarded on your router!"
        });
    }
}
