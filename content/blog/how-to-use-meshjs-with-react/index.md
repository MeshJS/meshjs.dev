---
title: "How to Use MeshJS with React: Build Cardano dApps"
description: "Learn how to integrate MeshJS with React to build Cardano blockchain applications. Complete guide covering installation, wallet connection, and asset management."
date: "2026-01-17"
summary: "A comprehensive guide to building Cardano dApps using MeshJS and React, from installation to wallet integration and beyond."
---

# How to Use MeshJS with React: Build Cardano dApps

Building decentralized applications on Cardano has never been more accessible. MeshJS provides a complete TypeScript SDK that simplifies blockchain development, and its React integration makes creating web3 frontends straightforward. This guide walks you through everything you need to start building Cardano dApps with React.

## What is MeshJS?

MeshJS is an open-source TypeScript SDK designed for Cardano blockchain development. With over 1 million downloads and a lightweight footprint under 60kB, it has become the go-to toolkit for developers building on Cardano.

The SDK offers:

- Transaction building with intuitive APIs
- Universal wallet support including browser wallets, seed phrases, and private keys
- Multiple blockchain data provider integrations (Blockfrost, Koios, Maestro, Ogmios)
- Pre-built React components and hooks
- Nine open-source smart contracts ready for deployment

## Prerequisites

Before starting, ensure you have:

- Node.js installed on your machine
- A code editor (VS Code recommended)
- Basic familiarity with React and TypeScript
- A Cardano browser wallet like Eternl, Nami, or Lace for testing

## Installation

MeshJS provides two packages for React development. Install both:

```bash
npm install @meshsdk/core @meshsdk/react
```

The `@meshsdk/core` package provides blockchain functionality including transaction building and wallet management. The `@meshsdk/react` package delivers UI components and hooks specifically designed for React applications.

## Setting Up MeshProvider

MeshJS uses React Context to share wallet state across your application. Wrap your root component with `MeshProvider` to enable this functionality.

For Next.js applications using the Pages Router, modify `pages/_app.tsx`:

```typescript
import "../styles/globals.css";
import "@meshsdk/react/styles.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <Component {...pageProps} />
    </MeshProvider>
  );
}

export default MyApp;
```

For applications using the App Router, add the provider to your root layout instead.

## Connecting Wallets with CardanoWallet

The `CardanoWallet` component provides a ready-made wallet connection interface. Users can select from installed browser wallets and connect with a single click.

Basic usage:

```typescript
import { CardanoWallet } from '@meshsdk/react';

function WalletButton() {
  return <CardanoWallet />;
}
```

### Customizing the Wallet Component

The component accepts several props for customization:

```typescript
<CardanoWallet
  label="Connect Wallet"
  isDark={true}
  persist={true}
  onConnected={() => console.log('Wallet connected!')}
/>
```

- **label**: Custom text for the connection button
- **isDark**: Enables dark mode styling
- **persist**: Remembers the user's wallet choice and reconnects automatically on return visits
- **onConnected**: Callback function triggered after successful connection

## Using the useWallet Hook

For more control over wallet interactions, the `useWallet` hook exposes the full wallet API and connection state.

```typescript
import { useWallet } from '@meshsdk/react';

function WalletInfo() {
  const { wallet, connected, name, connecting, connect, disconnect, error } = useWallet();

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (connecting) {
    return <p>Connecting...</p>;
  }

  if (!connected) {
    return <button onClick={() => connect('eternl')}>Connect Eternl</button>;
  }

  return (
    <div>
      <p>Connected to: {name}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
```

### Available Properties

| Property | Type | Description |
|----------|------|-------------|
| wallet | BrowserWallet | Instance providing CIP-30 wallet functions |
| state | string | Connection status: "NOT_CONNECTED", "CONNECTING", or "CONNECTED" |
| connected | boolean | Whether a wallet is currently connected |
| name | string | Identifier of the connected wallet |
| connecting | boolean | Whether connection is in progress |
| connect | function | Initiates connection to specified wallet |
| disconnect | function | Terminates current wallet session |
| error | Error | Error object from connection failures |

## Fetching Wallet Assets

Once connected, you can query the wallet for assets, addresses, and balances. Here's a complete example:

```typescript
import { useState } from "react";
import { useWallet, CardanoWallet } from '@meshsdk/react';

function AssetViewer() {
  const { connected, wallet } = useWallet();
  const [assets, setAssets] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getAssets() {
    if (wallet) {
      setLoading(true);
      const walletAssets = await wallet.getAssets();
      setAssets(walletAssets);
      setLoading(false);
    }
  }

  return (
    <div>
      <CardanoWallet />

      {connected && (
        <div>
          <button onClick={getAssets} disabled={loading}>
            {loading ? 'Loading...' : 'Get Assets'}
          </button>

          {assets && (
            <pre>{JSON.stringify(assets, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
```

## Building Transactions

MeshJS simplifies transaction creation with its Transaction Builder API. Here's an example of sending ADA:

```typescript
import { Transaction } from '@meshsdk/core';
import { useWallet } from '@meshsdk/react';

function SendAda() {
  const { wallet } = useWallet();

  async function handleSend() {
    const tx = new Transaction({ initiator: wallet })
      .sendLovelace(
        'addr_test1qz...',  // recipient address
        '5000000'           // amount in lovelace (5 ADA)
      );

    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);

    console.log('Transaction submitted:', txHash);
  }

  return <button onClick={handleSend}>Send 5 ADA</button>;
}
```

## Complete Example Application

Here's a full page component combining everything covered:

```typescript
import { useState } from "react";
import type { NextPage } from "next";
import { useWallet, CardanoWallet } from '@meshsdk/react';

const Home: NextPage = () => {
  const { connected, wallet } = useWallet();
  const [assets, setAssets] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getWalletData() {
    if (wallet) {
      setLoading(true);
      const [walletAssets, walletBalance] = await Promise.all([
        wallet.getAssets(),
        wallet.getLovelace()
      ]);
      setAssets(walletAssets);
      setBalance(walletBalance);
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>My Cardano dApp</h1>

      <section>
        <h2>Wallet Connection</h2>
        <CardanoWallet persist={true} />
      </section>

      {connected && (
        <section>
          <h2>Wallet Data</h2>
          <button onClick={getWalletData} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Wallet Data'}
          </button>

          {balance && (
            <p>Balance: {parseInt(balance) / 1000000} ADA</p>
          )}

          {assets && assets.length > 0 && (
            <div>
              <h3>Assets ({assets.length})</h3>
              <ul>
                {assets.map((asset, index) => (
                  <li key={index}>{asset.assetName || 'Unnamed'}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default Home;
```

## Testing on Testnet

For development, use Cardano's testnet instead of mainnet:

1. Configure your browser wallet to use the Preview or Preprod testnet
2. Obtain test ADA from the [Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnets/tools/faucet/)
3. Test your application without risking real funds

## Common Patterns and Best Practices

### Error Handling

Always wrap wallet operations in try-catch blocks:

```typescript
async function safeGetAssets() {
  try {
    const assets = await wallet.getAssets();
    setAssets(assets);
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    setError(error.message);
  }
}
```

### Loading States

Provide feedback during blockchain operations which may take time:

```typescript
const [status, setStatus] = useState('idle');

async function submitTransaction() {
  setStatus('building');
  const tx = await buildTransaction();

  setStatus('signing');
  const signed = await wallet.signTx(tx);

  setStatus('submitting');
  const hash = await wallet.submitTx(signed);

  setStatus('complete');
}
```

### Wallet Detection

Check for available wallets before rendering connection options:

```typescript
import { BrowserWallet } from '@meshsdk/core';

function WalletList() {
  const wallets = BrowserWallet.getInstalledWallets();

  if (wallets.length === 0) {
    return <p>No Cardano wallets detected. Please install one to continue.</p>;
  }

  return (
    <ul>
      {wallets.map((wallet) => (
        <li key={wallet.name}>{wallet.name}</li>
      ))}
    </ul>
  );
}
```

## Next Steps

With the fundamentals in place, explore these advanced topics:

- **NFT Minting**: Use MeshJS to create and mint NFTs on Cardano
- **Smart Contract Integration**: Interact with Plutus and Aiken smart contracts
- **Multi-signature Transactions**: Build transactions requiring multiple signers
- **Wallet Authentication**: Implement login flows using wallet signatures

The MeshJS documentation at [meshjs.dev](https://meshjs.dev) provides comprehensive guides and live demos for each of these topics.

## Conclusion

MeshJS transforms Cardano development by providing intuitive React components and hooks that handle the complexity of blockchain interactions. From wallet connection to transaction building, the SDK offers everything needed to build production-ready dApps.

Start with the examples in this guide, experiment with the various wallet functions, and gradually incorporate more advanced features as your application grows. The Cardano ecosystem is expanding rapidly, and MeshJS ensures you can build alongside it.
