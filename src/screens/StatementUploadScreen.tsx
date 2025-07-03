import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
  Card,
  Button,
  useTheme,
  Appbar,
  List,
  Divider,
  ProgressBar,
  Chip,
  Surface,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

export function StatementUploadScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const supportedFormats = [
    { format: "CSV", description: "Comma-separated values from your bank" },
    { format: "OFX", description: "Open Financial Exchange format" },
    { format: "QFX", description: "Quicken Financial Exchange format" },
    { format: "PDF", description: "Bank statements (auto-parsed)" },
  ];

  const uploadSteps = [
    "Download your bank statement",
    "Select the file format",
    "Upload the file",
    "Review imported transactions",
    "Confirm and save",
  ];

  const handleFileUpload = async (fileType: string) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFiles((files) => [
            ...files,
            `statement_${Date.now()}.${fileType.toLowerCase()}`,
          ]);
          Alert.alert(
            "Upload Complete",
            `${fileType} file uploaded successfully! Found 25 transactions ready for import.`,
            [
              {
                text: "Review Transactions",
                onPress: () => console.log("Review transactions"),
              },
              { text: "Upload Another", style: "cancel" },
            ]
          );
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleBankConnection = () => {
    Alert.alert(
      "Connect Bank Account",
      "This feature will securely connect to your bank using Plaid integration. You will be redirected to your bank's website to authorize the connection.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => console.log("Connect to bank") },
      ]
    );
  };

  const removeUploadedFile = (fileName: string) => {
    setUploadedFiles((files) => files.filter((f) => f !== fileName));
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Import Transactions"
          subtitle="Upload statements or connect accounts"
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Bank Connection Option */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.optionHeader}>
              <MaterialIcons
                name="account-balance"
                size={32}
                color={theme.colors.primary}
              />
              <View style={styles.optionText}>
                <Text variant="titleLarge" style={styles.optionTitle}>
                  Connect Bank Account
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Automatically import transactions from your bank
                </Text>
              </View>
            </View>

            <View style={styles.benefits}>
              <Text
                variant="bodySmall"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  marginBottom: 8,
                }}
              >
                Benefits:
              </Text>
              <View style={styles.benefitsList}>
                <Text variant="bodySmall">• Real-time transaction sync</Text>
                <Text variant="bodySmall">• Automatic categorization</Text>
                <Text variant="bodySmall">• No manual uploads needed</Text>
                <Text variant="bodySmall">• Bank-grade security</Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleBankConnection}
              style={styles.connectButton}
              icon="link"
            >
              Connect Bank Account
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.dividerContainer}>
          <Divider style={styles.divider} />
          <Text variant="bodyMedium" style={styles.dividerText}>
            OR
          </Text>
          <Divider style={styles.divider} />
        </View>

        {/* Manual Upload Option */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.optionHeader}>
              <MaterialIcons
                name="upload-file"
                size={32}
                color={theme.colors.secondary}
              />
              <View style={styles.optionText}>
                <Text variant="titleLarge" style={styles.optionTitle}>
                  Upload Bank Statement
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Import transactions from downloaded files
                </Text>
              </View>
            </View>

            {/* Supported Formats */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Supported Formats
            </Text>

            <View style={styles.formatsList}>
              {supportedFormats.map((format, index) => (
                <Surface key={index} style={styles.formatCard} elevation={1}>
                  <View style={styles.formatContent}>
                    <Chip mode="outlined" style={styles.formatChip}>
                      {format.format}
                    </Chip>
                    <Text variant="bodySmall" style={styles.formatDescription}>
                      {format.description}
                    </Text>
                  </View>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => handleFileUpload(format.format)}
                    disabled={isUploading}
                  >
                    Upload {format.format}
                  </Button>
                </Surface>
              ))}
            </View>

            {/* Upload Progress */}
            {isUploading && (
              <View style={styles.uploadProgress}>
                <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
                  Uploading file... {uploadProgress}%
                </Text>
                <ProgressBar progress={uploadProgress / 100} />
              </View>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <View style={styles.uploadedFiles}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Uploaded Files
                </Text>
                {uploadedFiles.map((fileName, index) => (
                  <Surface
                    key={index}
                    style={styles.uploadedFile}
                    elevation={1}
                  >
                    <View style={styles.fileInfo}>
                      <MaterialIcons
                        name="insert-drive-file"
                        size={24}
                        color={theme.colors.primary}
                      />
                      <Text variant="bodyMedium" style={styles.fileName}>
                        {fileName}
                      </Text>
                    </View>
                    <Button
                      mode="text"
                      compact
                      onPress={() => removeUploadedFile(fileName)}
                      textColor={theme.colors.error}
                    >
                      Remove
                    </Button>
                  </Surface>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Upload Instructions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              How to Upload Statements
            </Text>

            {uploadSteps.map((step, index) => (
              <List.Item
                key={index}
                title={step}
                left={() => (
                  <View
                    style={[
                      styles.stepNumber,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Text
                      style={{
                        color: theme.colors.onPrimary,
                        fontWeight: "bold",
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>
                )}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Security Information */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.securityHeader}>
              <MaterialIcons
                name="security"
                size={24}
                color={theme.colors.primary}
              />
              <Text variant="titleMedium" style={styles.securityTitle}>
                Your Data is Secure
              </Text>
            </View>

            <Text variant="bodyMedium" style={styles.securityDescription}>
              All uploaded files are encrypted and processed securely. We never
              store your banking credentials and all data is deleted after
              processing. Bank connections use read-only access with 256-bit
              encryption.
            </Text>

            <View style={styles.securityFeatures}>
              <View style={styles.securityFeature}>
                <MaterialIcons
                  name="verified-user"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text variant="bodySmall" style={styles.securityFeatureText}>
                  Bank-grade encryption
                </Text>
              </View>
              <View style={styles.securityFeature}>
                <MaterialIcons
                  name="lock"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text variant="bodySmall" style={styles.securityFeatureText}>
                  Read-only access
                </Text>
              </View>
              <View style={styles.securityFeature}>
                <MaterialIcons
                  name="delete-forever"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text variant="bodySmall" style={styles.securityFeatureText}>
                  Auto-delete after processing
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Help Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Need Help?
            </Text>

            <List.Item
              title="Download Guide"
              description="Learn how to download statements from your bank"
              left={(props) => <List.Icon {...props} icon="help" />}
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Download guide will be available soon."
                )
              }
            />

            <Divider />

            <List.Item
              title="Supported Banks"
              description="View list of supported financial institutions"
              left={(props) => <List.Icon {...props} icon="account-balance" />}
              onPress={() =>
                Alert.alert(
                  "Supported Banks",
                  "We support over 10,000 financial institutions including Chase, Bank of America, Wells Fargo, and more."
                )
              }
            />

            <Divider />

            <List.Item
              title="Contact Support"
              description="Get help with importing your data"
              left={(props) => <List.Icon {...props} icon="support" />}
              onPress={() =>
                Alert.alert(
                  "Contact Support",
                  "Email: support@budgetmate.com\nPhone: 1-800-BUDGET"
                )
              }
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  optionText: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  benefits: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
  },
  benefitsList: {
    gap: 4,
  },
  connectButton: {
    alignSelf: "flex-start",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    opacity: 0.6,
  },
  sectionTitle: {
    marginBottom: 16,
    marginTop: 8,
    fontWeight: "600",
  },
  formatsList: {
    gap: 12,
    marginBottom: 16,
  },
  formatCard: {
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formatContent: {
    flex: 1,
    marginRight: 12,
  },
  formatChip: {
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  formatDescription: {
    opacity: 0.7,
  },
  uploadProgress: {
    marginVertical: 16,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
  },
  uploadedFiles: {
    marginTop: 16,
  },
  uploadedFile: {
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileName: {
    marginLeft: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  securityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  securityTitle: {
    marginLeft: 8,
    fontWeight: "600",
  },
  securityDescription: {
    marginBottom: 16,
    lineHeight: 20,
  },
  securityFeatures: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  securityFeature: {
    flexDirection: "row",
    alignItems: "center",
  },
  securityFeatureText: {
    marginLeft: 4,
  },
});
