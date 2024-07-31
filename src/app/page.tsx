'use client';
import { MAINNET_API_URL } from '@/constants';
import { getTimestampMs, hashAction, signStandardL1Action } from '@/signing';
import { Exchange } from '@/exchange';
import { useEffect, useState } from 'react';
import { useSignTypedData } from 'wagmi';

export default function Home() {
  const [message, setMessage] = useState('');
  const { data, isError, isSuccess, signTypedData } = useSignTypedData();
  const timestamp = getTimestampMs();

  var action = {
    type: 'spotSend',
    hyperliquidChain: 'Mainnet',
    signatureChainId: '0xa4b1',
    destination: '0x0000000000000000000000000000000000000000',
    amount: 1,
    time: timestamp,
    token: 'PURR:0xc4bf3f870c0e9465323c0b6ed28096c2',
  };

  const phantomAgent = {
    source: 'a',
    connectionId: hashAction(action, null, timestamp),
  };

  const phantomDomain = {
    name: 'Exchange',
    version: '1',
    chainId: 42161,
    verifyingContract: '0x0000000000000000000000000000000000000000' as const,
  };

  const agentTypes = {
    Agent: [
      { name: 'source', type: 'string' },
      { name: 'connectionId', type: 'bytes32' },
    ],
  } as const;

  const payloadToSign = {
    domain: phantomDomain,
    types: agentTypes,
    primaryType: 'Agent',
    message: phantomAgent,
  } as const;

  const exchange = Exchange.create(MAINNET_API_URL);

  const handleSign = async () => {
    signTypedData(payloadToSign);
    // signStandardL1Action(action, wallet, null, timestamp);
  };

  useEffect(() => {
    if (isSuccess) {
      exchange.postAction(action, data, timestamp);
    }
  }, [action, data, exchange, isSuccess, timestamp]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <w3m-button />
      <button onClick={() => handleSign()}>sign</button>
      {isSuccess && <div>Signature: {data}</div>}
      {isError && <div>Error signing message</div>}
    </main>
  );
}
