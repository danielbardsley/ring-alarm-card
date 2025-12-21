/**
 * CSS styles for Ring Alarm Card using Lit's css template literal
 */

import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
  }

  .card {
    background: var(--ha-card-background, var(--card-background-color, white));
    border-radius: var(--ha-card-border-radius, 12px);
    border: var(--ha-card-border-width, 1px) solid
      var(--ha-card-border-color, var(--divider-color, #e0e0e0));
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
    padding: 16px;
    box-sizing: border-box;
  }

  .title {
    font-size: 1.2em;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--primary-text-color);
  }

  .content {
    color: var(--secondary-text-color);
    line-height: 1.4;
  }

  .hello-world {
    text-align: center;
    padding: 20px;
    font-size: 1.1em;
    color: var(--primary-text-color);
  }

  .hass-status {
    text-align: center;
    margin-top: 8px;
    opacity: 0.7;
  }

  .hass-status small {
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
`;
