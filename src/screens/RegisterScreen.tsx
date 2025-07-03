import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
  TextInput,
  Button,
  useTheme,
  Card,
  HelperText,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../store";
import { registerUser } from "../store/slices/authSlice";

export function RegisterScreen({ navigation }: any) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(
        registerUser({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        })
      ).unwrap();

      Alert.alert(
        "Registration Successful",
        "Your account has been created successfully!",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error || "An error occurred during registration. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text
            variant="headlineLarge"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            Create Account
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Join BudgetMate to take control of your finances
          </Text>

          <Card
            style={[styles.formCard, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <TextInput
                label="Full Name"
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.name}
                autoComplete="name"
              />
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>

              <TextInput
                label="Email Address"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.email}
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>

              <TextInput
                label="Password"
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.password}
                secureTextEntry
                autoComplete="new-password"
              />
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>

              <TextInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  updateFormData("confirmPassword", value)
                }
                mode="outlined"
                style={styles.input}
                error={!!errors.confirmPassword}
                secureTextEntry
                autoComplete="new-password"
              />
              <HelperText type="error" visible={!!errors.confirmPassword}>
                {errors.confirmPassword}
              </HelperText>

              {error && (
                <HelperText
                  type="error"
                  visible={true}
                  style={styles.errorText}
                >
                  {error}
                </HelperText>
              )}

              <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.registerButton}
                loading={loading}
                disabled={loading}
              >
                Create Account
              </Button>

              <Button
                mode="text"
                onPress={() => navigation.navigate("Login")}
                style={styles.loginButton}
                disabled={loading}
              >
                Already have an account? Sign In
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    marginBottom: 32,
  },
  formCard: {
    elevation: 4,
  },
  input: {
    marginBottom: 4,
  },
  errorText: {
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 8,
  },
});
