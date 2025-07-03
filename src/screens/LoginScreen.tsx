import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button, useTheme, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppDispatch, useAppSelector } from "../store";
import { loginUser } from "../store/slices/authSlice";

export function LoginScreen({ navigation }: any) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      dispatch(loginUser({ email, password }));
    }
  };

  const handleGoogleSignIn = () => {
    Alert.alert("Google Sign-In", "Google Sign-In will be implemented here", [
      { text: "OK" },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text
          variant="headlineMedium"
          style={[styles.title, { color: theme.colors.primary }]}
        >
          Welcome to BudgetMate
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Your smart budgeting companion
        </Text>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          {error && (
            <Text
              variant="bodyMedium"
              style={[styles.error, { color: theme.colors.error }]}
            >
              {error}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading || !email || !password}
            style={styles.button}
          >
            Login
          </Button>

          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
            <Text
              variant="bodySmall"
              style={[
                styles.dividerText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              OR
            </Text>
            <Divider style={styles.divider} />
          </View>

          <Button
            mode="outlined"
            onPress={handleGoogleSignIn}
            loading={loading}
            disabled={loading}
            style={[styles.button, styles.googleButton]}
            icon={({ size, color }) => (
              <MaterialIcons name="login" size={size} color={color} />
            )}
          >
            Continue with Google
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate("Register")}
            style={styles.button}
          >
            Don't have an account? Sign up
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 48,
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
  googleButton: {
    marginTop: 0,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  error: {
    textAlign: "center",
    marginBottom: 8,
  },
});
