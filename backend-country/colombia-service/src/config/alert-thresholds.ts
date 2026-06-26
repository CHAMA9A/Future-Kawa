export type AlertThresholds = {
  temperature: {
    min: number;
    max: number;
  };
  humidity: {
    min: number;
    max: number;
  };
};

export const DEFAULT_ALERT_THRESHOLDS: AlertThresholds = {
  temperature: {
    min: 30,
    max: 36,
  },
  humidity: {
    min: 30,
    max: 45,
  },
};

let currentAlertThresholds: AlertThresholds = { ...DEFAULT_ALERT_THRESHOLDS };

export const getAlertThresholds = (): AlertThresholds => currentAlertThresholds;

export const updateAlertThresholds = (thresholds: AlertThresholds): AlertThresholds => {
  currentAlertThresholds = thresholds;
  return currentAlertThresholds;
};

export const resetAlertThresholds = (): AlertThresholds => {
  currentAlertThresholds = { ...DEFAULT_ALERT_THRESHOLDS };
  return currentAlertThresholds;
};