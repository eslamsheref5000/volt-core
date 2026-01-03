# Volt Blockchain (VLT) - Official Repository

![Volt Logo](https://volt-core.zapto.org/logo.png)

## ⚡ Welcome to Volt
Volt is a high-performance, CPU-minable blockchain built for everyone.

### 📥 Download Latest Release
[Download v1.0.19 (Auto-Connect Wallet)](https://github.com/eslamsheref5000/volt-core/releases/latest)

---

## 📖 User Guide & Documentation

### ⚠️ IMPORTANT: SECURITY WARNING
**Your coins are stored in a file named `wallet.key` (or `wallet.dat`).**
- IF YOU DELETE THIS FILE, YOU LOSE YOUR COINS FOREVER.
- IF YOU OVERWRITE THIS FILE WITH A NEW VERSION, YOU LOSE YOUR COINS FOREVER.

**🛡️ BACK UP YOUR `wallet.key` FILE NOW!**
Copy it to a USB drive or a Google Drive folder.

---

### 1. Installation & Updates
1. **New Install**: Unzip the downloaded file to a folder (e.g., `C:\Volt`).
2. **Updating**:
   - **Backup your existing `wallet.key` file first.**
   - Delete the old `.exe` files.
   - Copy the NEW `.exe` files into the folder.
   - **Ensure your original `wallet.key` is still there.**
   - DO NOT replace the entire folder without preserving your key file!

### 2. How to Start
1. Run `run_node.bat` (or `volt_core.exe`).
   - This connects you to the network. **Keep this black window OPEN.**
   - Allow through Firewall if asked.
2. Run `volt_wallet.exe`.
   - It will connect automatically to the public node (`volt-core.zapto.org`).
   - Wait for status: **Connected**.

### 3. Wallet Backup & Restore
- **To Backup**: 
  - Go to `Menu -> Settings -> Security -> Show Mnemonic` and WRITE DOWN your 12 words.
  - Or manually copy `wallet.key` to a safe location.
- **To Restore**:
  - **File**: Place your `wallet.key` in the same folder as `volt_wallet.exe`.
  - **Mnemonic**: Open Wallet -> Click `Import` -> Enter your 12 words.

### 4. Mining Guide
To mine Volt (VLT), use an external miner (like `cpuminer-opt`).
**Command:**
```bash
cpuminer -a sha256d -o stratum+tcp://volt-core.zapto.org:3333 -u <YOUR_ADDRESS> -p x
```

### 5. Troubleshooting
- **"Connecting..." forever**: Check internet, allow Firewall on Port 6000 & 6001.
- **"Transaction Failed"**: 
  - Ensure you have enough balance for fees (0.01 VLT minimum).
  - Fees increase during network congestion.
- **"Lost Address"**: You likely deleted `wallet.key`. Restore using your Mnemonic phrase.

---
*Built with ❤️ by the Volt Community.*
