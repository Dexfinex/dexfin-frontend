import React from 'react';
import { DEFAULT_ICON_URL } from '../../../constants/mock/tradepairs';
import { convertNumberIntoFormat } from '../../../utils/trade.util';

interface PriceLevelRowProps {
  total: string;
  size: string;
  price: string;
  reversedFieldsOrder: boolean;
  windowWidth: number;
  isSelected: boolean;
  exchangesImgUrls: string[];
}

const PriceLevelRow: React.FC<PriceLevelRowProps> = ({
  total,
  size,
  price,
  isSelected,
  reversedFieldsOrder,
  exchangesImgUrls,
  windowWidth
}) => {
  const bgStyle = reversedFieldsOrder
    ? 'before:bg-red-500/20'
    : 'before:bg-green-500/20';

  const priceColor = reversedFieldsOrder
    ? 'text-red-500'
    : 'text-green-500';

  return (
    <div 
      className={`
        relative flex items-center py-0.5 text-sm text-gray-400 hover:bg-white/5 cursor-pointer
        before:content-[''] before:absolute before:top-0 before:h-full before:z-0
        before:opacity-75 ${bgStyle}
        ${reversedFieldsOrder ? 'before:left-0' : 'before:right-0'}
        ${isSelected ? 'bg-white/5' : ''}
      `}
    >
      {/* Price Column */}
      <div className={`z-10 min-w-[100px]  ${priceColor}`}>
        {price}
      </div>

      {/* Size Column */}
      <div className="z-10 min-w-[80px] px-2 text-right">
        {convertNumberIntoFormat(size)}
      </div>

      {/* Total Column */}
      <div className="z-10 min-w-[80px] pl-1 text-right">
        {convertNumberIntoFormat(total)}
      </div>

      {/* Exchange Icons */}
      <div className="z-10 flex items-center gap-0.5 px-5 ml-auto">
        {exchangesImgUrls.map((url, index) => (
          <img
            key={`${url}-${index}`}
            src={url}
            alt="Exchange"
            className="w-4 h-4 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_ICON_URL;
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PriceLevelRow;