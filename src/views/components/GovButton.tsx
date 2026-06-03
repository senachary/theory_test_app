import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

type Variant = 'primary' | 'secondary' | 'warning' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

const variantClasses: Record<Variant, { button: string; text: string }> = {
  primary: {
    button: 'bg-[#00703C] active:bg-[#005a30]',
    text: 'text-white',
  },
  secondary: {
    button: 'bg-[#f3f2f1] border border-[#b1b4b6] active:bg-[#dbdad9]',
    text: 'text-[#0b0c0c]',
  },
  warning: {
    button: 'bg-[#FFDD00] active:bg-[#e6c700]',
    text: 'text-[#0b0c0c]',
  },
  danger: {
    button: 'bg-[#D4351C] active:bg-[#aa2a16]',
    text: 'text-white',
  },
};

export function GovButton({ label, onPress, variant = 'primary', disabled, loading, fullWidth }: Props) {
  const styles = variantClasses[variant];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        ${styles.button}
        ${fullWidth ? 'w-full' : 'self-start'}
        ${disabled || loading ? 'opacity-50' : ''}
        px-6 py-4 rounded-none shadow-sm
      `}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#0b0c0c'} />
      ) : (
        <Text className={`${styles.text} text-base font-bold text-center`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
