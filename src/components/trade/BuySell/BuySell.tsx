import React, { useState } from 'react';

const BuySell = ({ currentPair, onPlaceOrder }) => {
  const [orderType, setOrderType] = useState('buy');
  const [price, setPrice] = useState('0.2611');
  const [amount, setAmount] = useState('0');
  const [activeTab, setActiveTab] = useState('market');

  const handlePlaceOrder = () => {
    if (price && amount) {
      onPlaceOrder(orderType, parseFloat(price), parseFloat(amount));
    }
  };

  const [baseToken, quoteToken] = currentPair.split('/');

  return (
    <div className="w-full h-[600px] bg-black rounded-lg border border-white/10 flex flex-col">
      {/* Tab Selection */}
      <div className="p-4">
        <div className="flex bg-white/5 p-1 rounded-md">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${activeTab === 'market' 
                ? 'bg-white/20 text-white' 
                : 'text-white/80 hover:bg-white/10'}`}
            onClick={() => setActiveTab('market')}
          >
            Market
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${activeTab === 'limit' 
                ? 'bg-white/20 text-white' 
                : 'text-white/80 hover:bg-white/10'}`}
            onClick={() => setActiveTab('limit')}
          >
            Limit
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4">
          {/* Price Input */}
          <div className="mb-4">
            <label className="text-sm text-white/60 mb-2 block">Price</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-white/20 border-r-0 rounded-l-md bg-transparent text-white/60">
                ≈
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 bg-transparent border border-white/20 rounded-r-md p-2 text-white focus:outline-none focus:border-blue-500 hover:border-white/40"
              />
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <label className="text-sm text-white/60">Amount</label>
              <span className="text-sm text-red-400">Min 176.94</span>
            </div>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-white/20 border-r-0 rounded-l-md bg-transparent text-white/60">
                ≈
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent border border-white/20 rounded-r-md p-2 text-white focus:outline-none focus:border-blue-500 hover:border-white/40"
              />
            </div>
          </div>

          {/* Percentage Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {['25%', '50%', '75%', '100%'].map((value) => (
              <button
                key={value}
                className="py-1 px-2 text-xs font-medium text-white border border-white/20 rounded hover:bg-white/10 transition-colors"
              >
                {value}
              </button>
            ))}
          </div>

          {/* Available Balance */}
          <div className="flex justify-between mb-4">
            <span className="text-sm text-white/60">Available</span>
            <span className="text-sm text-white font-medium">50 USDT</span>
          </div>

          {/* Buy/Sell Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              className={`py-2 rounded font-medium transition-colors
                ${orderType === 'buy'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-transparent hover:bg-white/10 text-white border border-white/20'}`}
              onClick={() => {
                setOrderType('buy');
                handlePlaceOrder();
              }}
            >
              Buy
            </button>
            <button
              className={`py-2 rounded font-medium transition-colors
                ${orderType === 'sell'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-transparent hover:bg-white/10 text-white border border-white/20'}`}
              onClick={() => {
                setOrderType('sell');
                handlePlaceOrder();
              }}
            >
              Sell
            </button>
          </div>

          {/* Total Section */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-white/60">Total</span>
              <span className="text-sm text-white font-medium">0 USDT</span>
            </div>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-white/20 border-r-0 rounded-l-md bg-transparent text-white/60">
                ≈
              </span>
              <input
                type="number"
                value="0"
                readOnly
                className="flex-1 bg-transparent border border-white/20 rounded-r-md p-2 text-white"
              />
            </div>
          </div>

          <hr className="border-white/20 my-4" />

          {/* Network Fee */}
          <div className="flex justify-between mb-2">
            <span className="text-sm text-white/60">Network fee:</span>
            <span className="text-sm text-white font-medium">0.00192 ETH</span>
          </div>

          {/* Fee */}
          <div className="flex justify-between mb-4">
            <span className="text-sm text-white/60">Fee</span>
            <span className="text-sm text-white font-medium">0%</span>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-white/5 rounded-md mb-4 flex items-center gap-4">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 border-2 border-blue-500 rounded-full border-l-transparent animate-spin" />
            </div>
            <p className="text-sm text-white/80">
              The order will be executed directly on the Exchange Contract via Dexfin Pool
            </p>
          </div>

          {/* Max Slippage */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-white/60">Max slippage</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value="0.5"
                className="w-24 bg-transparent border border-white/20 rounded p-2 text-white text-right text-sm"
              />
              <span className="text-sm text-white">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Action Button at Bottom */}
      <div className="p-4 border-t border-white/10">
        <button
          className={`w-full py-4 rounded-md font-medium transition-colors
            ${orderType === 'buy'
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-transparent border border-white/20 text-white hover:bg-white/10'}`}
          onClick={handlePlaceOrder}
        >
          {orderType === 'buy' ? 'Buy' : 'Sell'} {baseToken} with {quoteToken}
        </button>
      </div>
    </div>
  );
};

export default BuySell;