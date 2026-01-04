import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { calculateTxHash } from '../utils/crypto';
import { getApiConfig } from '../utils/apiConfig';

function BlockDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [block, setBlock] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const init = async () => {
            let currentHeight = 1000;
            try {
                const res = await axios.post(API_URL, { command: "get_chain_info" }, getApiConfig());
                if (res.data.status === 'success') currentHeight = res.data.data.height;
            } catch (e) { }

            const blockHeight = id.length < 10 ? parseInt(id) : currentHeight;

            // Try fetching REAL block
            let bReal = null;
            let hasError = false;
            try {
                const cmd = id.length < 10 ? { command: "get_block", height: parseInt(id) } : { command: "get_block", hash: id };
                const bRes = await axios.post(API_URL, cmd, getApiConfig());
                if (bRes.data.status === 'success') bReal = bRes.data.data;
                else {
                    setError(bRes.data.message || "Unknown API Error");
                    hasError = true;
                }
            } catch (e) {
                setError(e.message);
                hasError = true;
            }

            if (bReal) {
                setBlock({
                    height: bReal.height || bReal.index,
                    hash: bReal.hash,
                    prevHash: bReal.previous_hash || "00000000000000000000000000000000",
                    merkleRoot: bReal.merkle_root || "???",
                    time: new Date(bReal.timestamp * 1000).toLocaleString(),
                    difficulty: bReal.difficulty || 0,
                    nonce: bReal.nonce || 0,
                    txs: bReal.transactions ? bReal.transactions.map(tx => ({
                        hash: tx.hash || calculateTxHash(tx), // Calculate if missing
                        amount: (tx.amount / 100000000).toLocaleString(),
                        isCoinbase: tx.inputs && tx.inputs.length === 0, // Simplified check
                        from: tx.sender || (tx.inputs ? tx.inputs[0].address : "Coinbase"),
                        to: tx.receiver || (tx.outputs ? tx.outputs[0].address : "Unknown"),
                        fee: (tx.fee || 0) / 100000000
                    })) : []
                });
            } else if (!hasError) {
                setBlock({ notFound: true });
            }
        };
        init();
    }, [id]);

    if (!block && !error) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    if (error) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}><h2 className="gradient-text">Error: {error}</h2><p style={{ color: '#888' }}>Ensure your Node is running v1.0.12+</p></div>;
    if (block.notFound) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}><h1 className="gradient-text">Block Not Found</h1></div>;

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1000px' }}>
            <h1 className="gradient-text">Block #{block.height}</h1>

            <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr><td style={{ padding: '10px', color: '#888' }}>Hash</td><td style={{ fontFamily: 'monospace' }}>{block.hash}</td></tr>
                        <tr><td style={{ padding: '10px', color: '#888' }}>Timestamp</td><td>{block.time}</td></tr>
                        <tr><td style={{ padding: '10px', color: '#888' }}>Difficulty</td><td>{block.difficulty.toLocaleString()}</td></tr>
                        <tr><td style={{ padding: '10px', color: '#888' }}>Nonce</td><td>{block.nonce}</td></tr>
                        <tr><td style={{ padding: '10px', color: '#888' }}>Merkle Root</td><td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{block.merkleRoot}</td></tr>
                        <tr><td style={{ padding: '10px', color: '#888' }}>Previous Block</td><td style={{ fontFamily: 'monospace', color: '#38bdf8', cursor: 'pointer' }} onClick={() => navigate('/block/' + block.prevHash)}>{block.prevHash.substr(0, 20)}...</td></tr>
                    </tbody>
                </table>
            </div>

            <h3>Transactions ({block.txs.length})</h3>
            <div className="glass-card" style={{ padding: '0' }}>
                {block.txs.map((tx, i) => (
                    <div key={i} style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ color: '#f472b6', fontFamily: 'monospace', cursor: 'pointer' }} onClick={() => navigate('/tx/' + tx.hash)}>{tx.hash}</div>
                        </div>
                        <div style={{ fontWeight: 'bold' }}>
                            {tx.amount} VLT
                            {tx.isCoinbase && <span style={{ marginLeft: '10px', fontSize: '0.7rem', background: '#38bdf8', color: '#000', padding: '2px 6px', borderRadius: '4px' }}>COINBASE</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BlockDetail;
