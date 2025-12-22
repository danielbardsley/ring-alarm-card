/**
 * CSS styles for Ring Alarm Card control buttons
 * Includes base button styles, state variants, and compact mode
 */

import { css } from 'lit';

export const buttonStyles = css`
  /* Control buttons container */
  .control-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    padding-top: 0;
  }

  /* Base button styles using HA CSS custom properties */
  .control-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px 16px;
    min-width: 72px;
    border-radius: var(--ha-card-border-radius, 12px);
    border: 1px solid var(--divider-color, #e0e0e0);
    background: var(--ha-card-background, var(--card-background-color, #fff));
    color: var(--primary-text-color, #212121);
    font-family: var(--paper-font-body1_-_font-family, inherit);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition:
      background-color 300ms ease,
      border-color 300ms ease,
      color 300ms ease,
      box-shadow 300ms ease,
      transform 0.1s ease,
      opacity 0.2s ease;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    position: relative;
    overflow: visible;

    /* Progress indicator custom properties */
    --progress-percent: 0;
    --progress-color: var(--primary-color, #03a9f4);
    --progress-border-width: 3px;
  }

  .control-button:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }

  .control-button:hover:not(:disabled):not(.disabled) {
    background: var(--secondary-background-color, #f5f5f5);
  }

  .control-button:active:not(:disabled):not(.disabled) {
    transform: scale(0.98);
  }

  /* Button icon */
  .control-button-icon {
    --mdc-icon-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  /* Button label */
  .control-button-label {
    line-height: 1;
    white-space: nowrap;
  }

  /* Inactive state (default) */
  .control-button.inactive {
    background: var(--ha-card-background, var(--card-background-color, #fff));
    border-color: var(--divider-color, #e0e0e0);
    color: var(--primary-text-color, #212121);
  }

  .control-button.inactive .control-button-icon {
    color: var(--secondary-text-color, #727272);
  }

  /* Active state - Disarmed (success/green) */
  .control-button.active.disarm {
    background: var(--success-color, #4caf50);
    border-color: var(--success-color, #4caf50);
    color: var(--text-primary-color, #fff);
  }

  .control-button.active.disarm .control-button-icon {
    color: var(--text-primary-color, #fff);
  }

  /* Active state - Home (warning/orange) */
  .control-button.active.arm_home {
    background: var(--warning-color, #ff9800);
    border-color: var(--warning-color, #ff9800);
    color: var(--text-primary-color, #fff);
  }

  .control-button.active.arm_home .control-button-icon {
    color: var(--text-primary-color, #fff);
  }

  /* Active state - Away (error/red) */
  .control-button.active.arm_away {
    background: var(--error-color, #f44336);
    border-color: var(--error-color, #f44336);
    color: var(--text-primary-color, #fff);
  }

  .control-button.active.arm_away .control-button-icon {
    color: var(--text-primary-color, #fff);
  }

  /* Active state - Vacation (info/blue) */
  .control-button.active.vacation {
    background: var(--info-color, #03a9f4);
    border-color: var(--info-color, #03a9f4);
    color: var(--text-primary-color, #fff);
  }

  .control-button.active.vacation .control-button-icon {
    color: var(--text-primary-color, #fff);
  }

  /* Disabled state */
  .control-button:disabled,
  .control-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Loading state */
  .control-button.loading {
    cursor: wait;
    pointer-events: none;
  }

  .control-button.loading .control-button-icon {
    animation: button-spin 1s linear infinite;
  }

  @keyframes button-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Transitioning state - Progress indicator */
  .control-button.transitioning {
    /* Ensure button is positioned for pseudo-element */
    position: relative;
    overflow: visible;
  }

  .control-button.transitioning::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    background: conic-gradient(
      from 0deg at 50% 50%,
      var(--progress-color) calc(var(--progress-percent) * 1%),
      transparent calc(var(--progress-percent) * 1%)
    );
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    padding: var(--progress-border-width);
    pointer-events: none;
    z-index: 1;
  }

  /* Theme-specific progress colors */
  .control-button.transitioning {
    --progress-color: var(--primary-color, #03a9f4);
  }

  .control-button.transitioning.arm_home {
    --progress-color: var(--warning-color, #ff9800);
  }

  .control-button.transitioning.arm_away {
    --progress-color: var(--error-color, #f44336);
  }

  .control-button.transitioning.disarm {
    --progress-color: var(--success-color, #4caf50);
  }

  /* Error state */
  .control-button.error {
    border-color: var(--error-color, #f44336);
    background: rgba(244, 67, 54, 0.1);
    animation: button-shake 0.5s ease;
  }

  .control-button.error .control-button-icon {
    color: var(--error-color, #f44336);
  }

  @keyframes button-shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20%,
    60% {
      transform: translateX(-4px);
    }
    40%,
    80% {
      transform: translateX(4px);
    }
  }

  /* Compact mode variant styles */
  .compact .control-buttons {
    padding: 12px;
    padding-top: 0;
    gap: 6px;
  }

  .compact .control-button {
    padding: 8px 12px;
    min-width: 60px;
    font-size: 0.75rem;
    border-radius: 8px;
  }

  .compact .control-button-icon {
    --mdc-icon-size: 20px;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .control-button {
      border-width: 2px;
    }

    .control-button.active {
      font-weight: 600;
    }

    .control-button:focus-visible {
      outline-width: 3px;
    }
  }

  /* Dark theme adjustments */
  @media (prefers-color-scheme: dark) {
    .control-button.inactive {
      background: var(
        --ha-card-background,
        var(--card-background-color, #1c1c1c)
      );
      border-color: var(--divider-color, #3c3c3c);
    }

    .control-button:hover:not(:disabled):not(.disabled) {
      background: var(--secondary-background-color, #2c2c2c);
    }

    .control-button.error {
      background: rgba(244, 67, 54, 0.15);
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .control-button {
      transition: none;
    }

    .control-button.loading .control-button-icon {
      animation: none;
    }

    .control-button.error {
      animation: none;
    }

    /* Show static progress state instead of animation */
    .control-button.transitioning::before {
      /* Keep the progress indicator visible but without animation */
      /* The conic-gradient will show static progress based on --progress-percent */
    }
  }

  /* Screen reader only class for ARIA live region */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
