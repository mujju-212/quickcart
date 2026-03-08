import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import AnimatedRN, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Clock,
  ShieldCheck,
  FileText,
} from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { Header } from '@components/common';

// ──────────────────────────────────────────
//  FAQ items
// ──────────────────────────────────────────

const FAQS = [
  {
    question: 'How do I track my order?',
    answer:
      'Go to My Orders, tap your order, and you\'ll see a live tracking timeline with estimated delivery date.',
  },
  {
    question: 'What is the return policy?',
    answer:
      'We offer 7-day easy returns on most products. Go to the order detail screen and tap "Return" to initiate.',
  },
  {
    question: 'How do I apply a coupon?',
    answer:
      'Add items to your cart, then enter the coupon code in the coupon field on the cart screen before checkout.',
  },
  {
    question: 'Is Cash on Delivery available?',
    answer:
      'Yes! COD is available for orders up to ₹5,000 in most pin codes across India.',
  },
  {
    question: 'How do I change my delivery address?',
    answer:
      'You can manage addresses from Account → My Addresses, or select a different address during checkout.',
  },
];

// ──────────────────────────────────────────
//  Help / Support Screen
// ──────────────────────────────────────────

export default function HelpScreen() {
  const { top } = useSafeAreaInsets();
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  const ContactCard = ({
    icon,
    label,
    detail,
    onPress,
    delay,
  }: {
    icon: React.ReactNode;
    label: string;
    detail: string;
    onPress: () => void;
    delay: number;
  }) => (
    <AnimatedRN.View entering={FadeInUp.delay(delay).springify()}>
      <TouchableOpacity
        style={styles.contactCard}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.contactIcon}>{icon}</View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>{label}</Text>
          <Text style={styles.contactDetail}>{detail}</Text>
        </View>
        <ExternalLink size={16} color={colors.textTertiary} />
      </TouchableOpacity>
    </AnimatedRN.View>
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header title="Help & Support" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Contact Options ── */}
        <AnimatedRN.View entering={FadeInUp.springify()}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
        </AnimatedRN.View>

        <ContactCard
          icon={<Phone size={20} color={colors.success} />}
          label="Call Us"
          detail="+91 1800-123-4567 (Toll Free)"
          onPress={() => Linking.openURL('tel:18001234567')}
          delay={50}
        />
        <ContactCard
          icon={<Mail size={20} color={colors.info} />}
          label="Email Support"
          detail="support@quickcart.app"
          onPress={() => Linking.openURL('mailto:support@quickcart.app')}
          delay={100}
        />
        <ContactCard
          icon={<MessageCircle size={20} color={colors.primary} />}
          label="Live Chat"
          detail="Available 9 AM – 9 PM IST"
          onPress={() => Linking.openURL('https://quickcart.app/chat')}
          delay={150}
        />

        {/* ── Hours ── */}
        <AnimatedRN.View
          entering={FadeInUp.delay(200).springify()}
          style={styles.hoursCard}
        >
          <Clock size={18} color={colors.textSecondary} />
          <View>
            <Text style={styles.hoursTitle}>Support Hours</Text>
            <Text style={styles.hoursText}>
              Monday – Saturday, 9:00 AM – 9:00 PM IST
            </Text>
          </View>
        </AnimatedRN.View>

        {/* ── FAQ ── */}
        <AnimatedRN.View entering={FadeInUp.delay(250).springify()}>
          <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>
            Frequently Asked Questions
          </Text>
        </AnimatedRN.View>

        {FAQS.map((faq, index) => (
          <AnimatedRN.View
            key={index}
            entering={FadeInUp.delay(300 + index * 50).springify()}
          >
            <TouchableOpacity
              style={styles.faqItem}
              onPress={() =>
                setExpandedFaq(expandedFaq === index ? null : index)
              }
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <HelpCircle size={18} color={colors.primary} />
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <ChevronRight
                  size={16}
                  color={colors.textTertiary}
                  style={
                    expandedFaq === index
                      ? { transform: [{ rotate: '90deg' }] }
                      : undefined
                  }
                />
              </View>
              {expandedFaq === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          </AnimatedRN.View>
        ))}

        {/* ── Legal links ── */}
        <AnimatedRN.View
          entering={FadeInUp.delay(550).springify()}
          style={styles.legalRow}
        >
          <TouchableOpacity
            onPress={() => Linking.openURL('https://quickcart.app/terms')}
          >
            <Text style={styles.legalLink}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.legalDot}>•</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://quickcart.app/privacy')}
          >
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </AnimatedRN.View>
      </ScrollView>
    </View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xxl * 2,
  },

  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  // Contact cards
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs,
    gap: spacing.sm,
    ...shadows.sm,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '600',
  },
  contactDetail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 1,
  },

  // Hours
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  hoursTitle: {
    ...typography.labelMedium,
    color: colors.text,
  },
  hoursText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },

  // FAQ
  faqItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs,
    ...shadows.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  faqQuestion: {
    ...typography.bodyMedium,
    color: colors.text,
    flex: 1,
    fontWeight: '500',
  },
  faqAnswer: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.sm,
    marginLeft: 26,
  },

  // Legal
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  legalLink: {
    ...typography.bodySmall,
    color: colors.info,
    textDecorationLine: 'underline',
  },
  legalDot: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
});
