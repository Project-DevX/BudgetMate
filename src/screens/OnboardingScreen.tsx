import React, { useState, useRef } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Image } from "react-native";
import { Text, Button, useTheme, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: "Welcome to BudgetMate",
    description:
      "Your smart financial companion that helps you take control of your money with AI-powered insights and automated tracking.",
    icon: "account-balance-wallet",
    color: "#4A90E2",
  },
  {
    id: 2,
    title: "Smart Expense Tracking",
    description:
      "Automatically import transactions from your bank accounts or upload statements. Our AI categorizes expenses intelligently.",
    icon: "trending-up",
    color: "#50C878",
  },
  {
    id: 3,
    title: "Budget Management",
    description:
      "Create custom budgets by category and get real-time alerts when you're approaching your limits.",
    icon: "donut-large",
    color: "#FF6B6B",
  },
  {
    id: 4,
    title: "Bill Reminders",
    description:
      "Never miss a payment again. Set up automatic reminders for all your recurring bills and subscriptions.",
    icon: "access-time",
    color: "#FFD93D",
  },
  {
    id: 5,
    title: "AI-Powered Insights",
    description:
      "Get personalized financial insights and recommendations to optimize your spending and achieve your goals.",
    icon: "lightbulb",
    color: "#9B59B6",
  },
];

export function OnboardingScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
    scrollViewRef.current?.scrollTo({
      x: slideIndex * width,
      animated: true,
    });
  };

  const nextSlide = () => {
    if (currentSlide < onboardingData.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      // Navigate to login screen
      navigation.navigate("Login" as never);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const skipOnboarding = () => {
    navigation.navigate("Login" as never);
  };

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentSlide(index);
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={slide.id} style={[styles.slide, { width }]}>
      <View style={styles.slideContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: slide.color + "20" },
          ]}
        >
          <MaterialIcons name={slide.icon} size={80} color={slide.color} />
        </View>

        <Text
          variant="headlineLarge"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          {slide.title}
        </Text>

        <Text
          variant="bodyLarge"
          style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
        >
          {slide.description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Skip Button */}
      <View style={styles.header}>
        <Button
          mode="text"
          onPress={skipOnboarding}
          textColor={theme.colors.primary}
        >
          Skip
        </Button>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingData.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomContainer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    index === currentSlide
                      ? theme.colors.primary
                      : theme.colors.outline,
                  width: index === currentSlide ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {currentSlide > 0 && (
            <IconButton
              icon="chevron-left"
              size={32}
              iconColor={theme.colors.primary}
              onPress={prevSlide}
              style={styles.navButton}
            />
          )}

          <View style={styles.spacer} />

          <Button
            mode="contained"
            onPress={nextSlide}
            style={styles.nextButton}
            contentStyle={styles.buttonContent}
          >
            {currentSlide === onboardingData.length - 1
              ? "Get Started"
              : "Next"}
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
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slideContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    maxWidth: 400,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  description: {
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navigationButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButton: {
    margin: 0,
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    minWidth: 120,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
