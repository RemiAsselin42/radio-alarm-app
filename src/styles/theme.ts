export const colors = {
  background: "#1a1a1a",
  surface: "#2a2a2a",
  surfaceLight: "#3a3a3a",
  border: "#4a4a4a",
  text: "#e0e0e0",
  textSecondary: "#a0a0a0",
  accent: "#6a6a6a",
  accentLight: "#8a8a8a",
  error: "#cf6679",
  success: "#81c784",
  warning: "#ffb74d",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: "600" as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500" as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    color: colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: colors.textSecondary,
  },
  time: {
    fontSize: 36,
    fontWeight: "300" as const,
    color: colors.text,
  },
};
