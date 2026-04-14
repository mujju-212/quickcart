// StatusBadge — Order/offer status-specific badge with dot indicator

import React from 'react';
import Badge from './Badge';
import { ViewStyle } from 'react-native';

type OrderStatusType = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type OfferStatusType = 'active' | 'expired' | 'upcoming';
type ReviewStatusType = 'pending' | 'approved' | 'flagged';

const orderVariantMap: Record<OrderStatusType, 'warning' | 'info' | 'primary' | 'info' | 'success' | 'error'> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'primary',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

const offerVariantMap: Record<OfferStatusType, 'success' | 'error' | 'warning'> = {
  active: 'success',
  expired: 'error',
  upcoming: 'warning',
};

const reviewVariantMap: Record<ReviewStatusType, 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  approved: 'success',
  flagged: 'error',
};

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'offer' | 'review';
  style?: ViewStyle;
}

export default function StatusBadge({ status, type = 'order', style }: StatusBadgeProps) {
  let variant: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'neutral';
  const normalized = status.toLowerCase();

  if (type === 'order' && normalized in orderVariantMap) {
    variant = orderVariantMap[normalized as OrderStatusType];
  } else if (type === 'offer' && normalized in offerVariantMap) {
    variant = offerVariantMap[normalized as OfferStatusType];
  } else if (type === 'review' && normalized in reviewVariantMap) {
    variant = reviewVariantMap[normalized as ReviewStatusType];
  }

  const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);

  return <Badge label={label} variant={variant} dot style={style} />;
}
