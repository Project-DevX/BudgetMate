import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Dialog,
  Portal,
  Button,
  List,
  RadioButton,
  Text,
  useTheme,
} from "react-native-paper";

interface CurrencySelectionDialogProps {
  visible: boolean;
  currentCurrency: string;
  onDismiss: () => void;
  onSelect: (currency: string) => void;
}

const CURRENCIES = [
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
];

export function CurrencySelectionDialog({
  visible,
  currentCurrency,
  onDismiss,
  onSelect,
}: CurrencySelectionDialogProps) {
  const theme = useTheme();
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);

  const handleSelect = () => {
    onSelect(selectedCurrency);
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Select Currency</Dialog.Title>
        <Dialog.Content>
          <ScrollView
            style={styles.currencyList}
            showsVerticalScrollIndicator={true}
          >
            {CURRENCIES.map((currency) => (
              <List.Item
                key={currency.code}
                title={`${currency.name} (${currency.symbol})`}
                description={currency.code}
                left={() => (
                  <RadioButton
                    value={currency.code}
                    status={
                      selectedCurrency === currency.code
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => setSelectedCurrency(currency.code)}
                  />
                )}
                onPress={() => setSelectedCurrency(currency.code)}
                style={[
                  styles.currencyItem,
                  selectedCurrency === currency.code && {
                    backgroundColor: theme.colors.primaryContainer,
                  },
                ]}
              />
            ))}
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleSelect}>Select</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

interface DateFormatSelectionDialogProps {
  visible: boolean;
  currentFormat: string;
  onDismiss: () => void;
  onSelect: (format: string) => void;
}

const DATE_FORMATS = [
  { format: "MM/DD/YYYY", example: "12/31/2024", description: "US Format" },
  { format: "DD/MM/YYYY", example: "31/12/2024", description: "UK Format" },
  { format: "YYYY-MM-DD", example: "2024-12-31", description: "ISO Format" },
  {
    format: "DD-MM-YYYY",
    example: "31-12-2024",
    description: "European Format",
  },
  {
    format: "MMM DD, YYYY",
    example: "Dec 31, 2024",
    description: "Long Format",
  },
  {
    format: "DD MMM YYYY",
    example: "31 Dec 2024",
    description: "International Format",
  },
];

export function DateFormatSelectionDialog({
  visible,
  currentFormat,
  onDismiss,
  onSelect,
}: DateFormatSelectionDialogProps) {
  const theme = useTheme();
  const [selectedFormat, setSelectedFormat] = useState(currentFormat);

  const handleSelect = () => {
    onSelect(selectedFormat);
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Select Date Format</Dialog.Title>
        <Dialog.Content>
          <ScrollView
            style={styles.formatList}
            showsVerticalScrollIndicator={true}
          >
            {DATE_FORMATS.map((format) => (
              <List.Item
                key={format.format}
                title={format.description}
                description={`${format.format} (${format.example})`}
                left={() => (
                  <RadioButton
                    value={format.format}
                    status={
                      selectedFormat === format.format ? "checked" : "unchecked"
                    }
                    onPress={() => setSelectedFormat(format.format)}
                  />
                )}
                onPress={() => setSelectedFormat(format.format)}
                style={[
                  styles.formatItem,
                  selectedFormat === format.format && {
                    backgroundColor: theme.colors.primaryContainer,
                  },
                ]}
              />
            ))}
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleSelect}>Select</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    maxHeight: "70%",
    maxWidth: "90%",
    alignSelf: "center",
  },
  currencyList: {
    maxHeight: 300,
  },
  currencyItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 1,
  },
  formatList: {
    maxHeight: 300,
  },
  formatItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 1,
  },
});
