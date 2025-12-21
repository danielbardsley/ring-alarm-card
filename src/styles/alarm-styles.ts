/**
 * CSS styles for Ring Alarm Card alarm-specific styling
 * Includes state colors, animations, and layout for alarm status display
 */

import { css } from 'lit';

export const alarmStyles = css`
  :host {
    /* Alarm state colors using HA theme variables */
    --alarm-disarmed-color: var(--success-color, #4caf50);
    --alarm-armed-home-color: var(--warning-color, #ff9800);
    --alarm-armed-away-color: var(--error-color, #f44336);
    --alarm-pending-color: var(--info-color, #2196f3);
    --alarm-triggered-color: var(--error-color, #f44336);
    --alarm-unknown-color: var(--disabled-text-color, #9e9e9e);

    /* Error state colors */
    --alarm-error-color: var(--error-color, #f44336);
    --alarm-warning-color: var(--warning-color, #ff9800);
    --alarm-error-background: var(--error-color, #f44336);
    --alarm-error-text: var(--text-primary-color, #ffffff);

    /* Additional theme integration for better accessibility */
    --alarm-background: var(
      --ha-card-background,
      var(--card-background-color, #ffffff)
    );
    --alarm-text-primary: var(--primary-text-color, #212121);
    --alarm-text-secondary: var(--secondary-text-color, #727272);
    --alarm-border-color: var(
      --ha-card-border-color,
      var(--divider-color, #e0e0e0)
    );
  }

  /* Alarm status display layout */
  .alarm-status {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    gap: 12px;
    min-height: 60px;
  }

  .alarm-icon {
    font-size: 2.5rem;
    transition: color 0.3s ease;
    flex-shrink: 0;
  }

  .alarm-text {
    font-size: 1.2rem;
    font-weight: 500;
    text-transform: capitalize;
    color: var(--alarm-text-primary);
  }

  /* State-specific colors */
  .alarm-disarmed .alarm-icon {
    color: var(--alarm-disarmed-color);
  }

  .alarm-armed-home .alarm-icon {
    color: var(--alarm-armed-home-color);
  }

  .alarm-armed-away .alarm-icon {
    color: var(--alarm-armed-away-color);
  }

  .alarm-pending .alarm-icon {
    color: var(--alarm-pending-color);
  }

  .alarm-triggered .alarm-icon {
    color: var(--alarm-triggered-color);
  }

  .alarm-unknown .alarm-icon {
    color: var(--alarm-unknown-color);
  }

  /* Animation keyframes for pending state */
  @keyframes pulse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.05);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Animation keyframes for triggered state */
  @keyframes flash {
    0%,
    50% {
      opacity: 1;
    }
    25%,
    75% {
      opacity: 0.3;
    }
  }

  /* Apply animations to specific states */
  .alarm-pending .alarm-icon {
    animation: pulse 2s infinite;
  }

  .alarm-triggered .alarm-icon {
    animation: flash 1s infinite;
  }

  /* Compact mode styles */
  .compact .alarm-status {
    padding: 12px;
    gap: 8px;
    min-height: 40px;
  }

  .compact .alarm-icon {
    font-size: 1.8rem;
  }

  .compact .alarm-text {
    font-size: 1rem;
  }

  /* Error state styles */
  .alarm-error {
    background-color: rgba(var(--rgb-error-color, 244, 67, 54), 0.1);
    border: 1px solid var(--alarm-error-color);
    border-radius: var(--ha-card-border-radius, 12px);
    padding: 16px;
    margin: 8px 0;
    color: var(--alarm-text-primary);
  }

  .alarm-error-icon {
    color: var(--alarm-error-color);
    font-size: 1.5rem;
    margin-right: 8px;
  }

  .alarm-error-message {
    color: var(--alarm-error-color);
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  .alarm-warning {
    background-color: rgba(var(--rgb-warning-color, 255, 152, 0), 0.1);
    border: 1px solid var(--alarm-warning-color);
    border-radius: var(--ha-card-border-radius, 12px);
    padding: 16px;
    margin: 8px 0;
    color: var(--alarm-text-primary);
  }

  .alarm-warning-icon {
    color: var(--alarm-warning-color);
    font-size: 1.5rem;
    margin-right: 8px;
  }

  .alarm-warning-message {
    color: var(--alarm-warning-color);
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  /* Loading state styles */
  .alarm-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    color: var(--alarm-text-secondary);
  }

  .alarm-loading-icon {
    font-size: 1.5rem;
    margin-right: 8px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Accessibility improvements */
  .alarm-status[role='status'] {
    /* Ensure proper focus handling for screen readers */
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .alarm-icon {
      filter: contrast(1.2);
    }

    .alarm-error,
    .alarm-warning {
      border-width: 2px;
    }

    /* Ensure better contrast in high contrast mode */
    .alarm-text {
      font-weight: 600;
    }
  }

  /* Dark theme specific adjustments */
  @media (prefers-color-scheme: dark) {
    :host {
      /* Adjust opacity for better dark theme visibility */
      --alarm-error-background-opacity: 0.15;
      --alarm-warning-background-opacity: 0.15;
    }

    .alarm-error {
      background-color: rgba(
        var(--rgb-error-color, 244, 67, 54),
        var(--alarm-error-background-opacity, 0.15)
      );
    }

    .alarm-warning {
      background-color: rgba(
        var(--rgb-warning-color, 255, 152, 0),
        var(--alarm-warning-background-opacity, 0.15)
      );
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .alarm-pending .alarm-icon,
    .alarm-triggered .alarm-icon,
    .alarm-loading-icon {
      animation: none;
    }

    .alarm-icon {
      transition: none;
    }
  }
`;
