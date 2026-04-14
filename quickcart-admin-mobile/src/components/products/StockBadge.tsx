// StockBadge — Colored badge showing stock level

import React from 'react';
import Badge from '../common/Badge';
import { getStockStatus } from '../../utils/helpers';
import { ViewStyle } from 'react-native';

interface StockBadgeProps {
  quantity: number;
  style?: ViewStyle;
}

export default function StockBadge({ quantity, style }: StockBadgeProps) {
  const status = getStockStatus(quantity);
  const variant = status === 'out_of_stock' ? 'error' : status === 'low_stock' ? 'warning' : 'success';
  const displayLabel = status === 'out_of_stock' ? 'Out of Stock' : status === 'low_stock' ? 'Low Stock' : 'In Stock';
  const label = `${displayLabel} (${quantity})`;

  return <Badge label={label} variant={variant} dot size="sm" style={style} />;
}
