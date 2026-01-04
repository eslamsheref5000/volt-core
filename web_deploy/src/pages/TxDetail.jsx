import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { getApiConfig } from '../utils/apiConfig';

function TxDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tx, setTx] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const init = async () => {
            let currentBlock = 10452;
            try {
                const res = await axios.post(API_URL, { command: "get_chain_info" }, getApiConfig());
                if (res.data.status === 'success') currentBlock = res.data.data.height;
            } catch (e) { }

            // Try fetching REAL tx
            let realTx = null;
            try {
                const txRes = await axios.post(API_URL, { command: "get_transaction", hash: id }, getApiConfig());
                if (txRes.data.status === 'success') realTx = txRes.data.data;
                else setError(txRes.data.message || "Unknown API Error");
            } catch (e) { setError(e.message); }

            if (realTx) {
                let amountVal = 0;
                if (realTx.amount) amountVal = realTx.amount / 100000000;
                else if (realTx.outputs) amountVal = realTx.outputs.reduce((a, b) => a + b.amount, 0) / 100000000;

                setTx({
                    hash: realTx.hash,
                    status: 'Confirmed', // If fetched from get_transaction it's likely confirmed or in mempool (pending)
                    block: realTx.block_height || 'Pending',
                    time: realTx.timestamp ? new Date(realTx.timestamp * 1000).toLocaleString() : 'Unknown',
                    from: realTx.sender || (realTx.inputs ? realTx.inputs[0].address : "Coinbase"),
                    to: realTx.receiver || (realTx.outputs ? realTx.outputs[0].address : "Unknown"),
                    amount: amountVal,
                    fee: (realTx.fee || 0) / 100000000
                });
            } else {
                // Not Found
                setTx({ notFound: true });
            }
        };
        init();
    }, [id]);

    if (!tx && !error) return <div className="container">Loading...</div>;
    if (error) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}><h2 className="gradient-text">Error: {error}</h2><p style={{ color: '#888' }}>Ensure your Node is running v1.0.12+ and allows connections.</p></div>;
    if (tx.notFound) return <div className="container"><h2>Transaction Not Found</h2></div>;

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1000px' }}>
            <h1 className="gradient-text">Transaction Details</h1>

            <div className="glass-card" style={{ padding: '30px 40px' }}>
                <div style={{ wordBreak: 'break-all', fontSize: '1.2rem', fontFamily: 'monospace', marginBottom: '20px', color: '#f472b6' }}>{tx.hash}</div>

                <div style={{ display: 'grid', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#888' }}>Status:</span>
                        <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{tx.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#888' }}>Block:</span>
                        <span style={{ color: '#38bdf8', cursor: 'pointer' }} onClick={() => navigate('/block/' + tx.block)}>#{tx.block}</span>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#888' }}>
                                <span>From:</span>
                                <span style={{ fontFamily: 'monospace', color: '#fff', wordBreak: 'break-all', fontSize: '0.9rem' }}>{tx.from}</span>
                            </div>
                            <div style={{ textAlign: 'center', color: '#38bdf8' }}>⬇</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#888' }}>
                                <span>To:</span>
                                <span style={{ fontFamily: 'monospace', color: '#fff', wordBreak: 'break-all', fontSize: '0.9rem' }}>{tx.to}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '10px' }}>
                        <span style={{ color: '#888' }}>Value:</span>
                        <span>{tx.amount} VLT</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '10px' }}>
                        <span style={{ color: '#888' }}>Fee:</span>
                        <span>{tx.fee} VLT</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TxDetail;
