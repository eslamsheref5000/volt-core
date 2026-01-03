import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function AddressDetail() {
    const { id } = useParams();
    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // const API_URL = '/api/rpc';
            let balance = 0;
            let txs = [];

            // 1. Get Balance
            try {
                const resBal = await axios.post(API_URL, { command: "get_balance", address: id });
                if (resBal.data.status === 'success') {
                    balance = resBal.data.data.balance; // Atomic Units
                }
            } catch (e) { setError(e.message); }

            // 2. Get History (Assuming we have get_address_history or filtering recent txs)
            // For now, we will use 'get_recent_txs' and filter client-side as a fallback MVP
            try {
                const resTxs = await axios.post(API_URL, { command: "get_recent_txs" });
                if (resTxs.data.status === 'success') {
                    const allTxs = resTxs.data.data.transactions;
                    txs = allTxs.filter(tx => tx.sender === id || tx.receiver === id);
                }
            } catch (e) { setError(e.message); }

            setData({
                address: id,
                balance: balance / 100000000, // Convert to VLT
                txCount: txs.length,
                history: txs.map(tx => ({
                    hash: tx.hash,
                    type: tx.receiver === id ? 'IN' : 'OUT',
                    amount: tx.amount / 100000000,
                    time: new Date(tx.timestamp * 1000).toLocaleString()
                }))
            });
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    if (error) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}><h2 className="gradient-text">Error: {error}</h2><p style={{ color: '#888' }}>Ensure your Node is running v1.0.12+ and Ngrok is active.</p></div>;

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1000px' }}>
            <h1 className="gradient-text">Address</h1>
            <div style={{ fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '1.1rem', marginBottom: '20px' }}>{data.address}</div>

            <div className="glass-card" style={{ padding: '30px', textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ color: '#888', marginBottom: '10px' }}>Balance</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#38bdf8' }}>{data.balance.toLocaleString()} VLT</div>
                <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>Total Transactions: {data.txCount}</div>
            </div>

            <h3>History</h3>
            <div className="glass-card" style={{ padding: '0' }}>
                {data.history.map((tx, i) => (
                    <div key={i} style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontFamily: 'monospace', color: '#f472b6' }}>{tx.hash.substr(0, 20)}...</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{tx.time}</div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: tx.type === 'IN' ? '#4ade80' : '#f43f5e' }}>
                            {tx.type === 'IN' ? '+' : '-'}{tx.amount} VLT
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AddressDetail;
