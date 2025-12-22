/**
 * TransitionStateManager - Utility module for managing alarm state transitions
 * Handles transitional state detection, progress calculation, and target identification
 */

import { AlarmState } from '@/types';
import { ControlActionType } from './alarm-control-manager';

/**
 * Interface representing the current transition state
 */
export interface TransitionState {
  isTransitioning: boolean;
  targetAction: ControlActionType | null;
  totalDuration: number;
  remainingSeconds: number;
  progress: number;
  startTime: number;
}

/**
 * TransitionStateManager class for managing alarm state transition logic
 */
export class TransitionStateManager {
  /**
   * Determine if the alarm is in a transitional state
   * @param alarmState - The current alarm state
   * @returns True if the state is transitional (arming, pending, disarming)
   */
  static isTransitionalState(alarmState: AlarmState['state']): boolean {
    const transitionalStates: AlarmState['state'][] = [
      'arming',
      'pending',
      'disarming',
    ];
    return transitionalStates.includes(alarmState);
  }

  /**
   * Get the target action for a transitional state
   * For 'arming' states, determines target based on entity attributes
   * For 'pending' states, returns the currently armed state
   * @param alarmState - The current alarm state
   * @param entityAttributes - The entity attributes containing targetState or similar
   * @returns The target action type or null if not transitional
   */
  static getTransitionTarget(
    alarmState: AlarmState['state'],
    entityAttributes: Record<string, unknown>
  ): ControlActionType | null {
    if (!TransitionStateManager.isTransitionalState(alarmState)) {
      return null;
    }

    if (alarmState === 'arming') {
      // Determine target from entity attributes
      // Ring integration uses 'targetState', others may use 'next_state'
      const targetState =
        (entityAttributes.targetState as string | undefined) ??
        (entityAttributes.target_state as string | undefined) ??
        (entityAttributes.next_state as string | undefined) ??
        (entityAttributes.arm_mode as string | undefined) ??
        (entityAttributes.mode as string | undefined);

      if (targetState) {
        // Handle various formats: 'armed_home', 'home', 'arm_home'
        const normalizedState = targetState.toLowerCase();
        if (
          normalizedState === 'armed_home' ||
          normalizedState === 'home' ||
          normalizedState === 'arm_home'
        ) {
          return 'arm_home';
        }
        if (
          normalizedState === 'armed_away' ||
          normalizedState === 'away' ||
          normalizedState === 'arm_away'
        ) {
          return 'arm_away';
        }
      }

      // Default to arm_away if no target can be determined
      return 'arm_away';
    }

    if (alarmState === 'pending') {
      // For pending (entry delay), check targetState first (Ring uses this)
      // then fall back to previous_state
      const targetState =
        (entityAttributes.targetState as string | undefined) ??
        (entityAttributes.target_state as string | undefined);

      if (targetState) {
        const normalizedState = targetState.toLowerCase();
        if (
          normalizedState === 'armed_home' ||
          normalizedState === 'home'
        ) {
          return 'arm_home';
        }
        if (
          normalizedState === 'armed_away' ||
          normalizedState === 'away'
        ) {
          return 'arm_away';
        }
      }

      // Fall back to previous_state
      const previousState = entityAttributes.previous_state as
        | string
        | undefined;
      if (previousState === 'armed_home') {
        return 'arm_home';
      }
      if (previousState === 'armed_away') {
        return 'arm_away';
      }
      // Default to arm_away if no state attribute found
      return 'arm_away';
    }

    if (alarmState === 'disarming') {
      return 'disarm';
    }

    return null;
  }

  /**
   * Calculate progress percentage from exitSecondsLeft
   * @param exitSecondsLeft - Current seconds remaining in countdown
   * @param totalDuration - Total countdown duration in seconds
   * @returns Progress percentage (0-100), clamped to valid range
   */
  static calculateProgress(
    exitSecondsLeft: number,
    totalDuration: number
  ): number {
    // Handle edge cases
    if (totalDuration <= 0) {
      return 100;
    }

    if (exitSecondsLeft < 0) {
      return 100;
    }

    if (exitSecondsLeft >= totalDuration) {
      return 0;
    }

    const progress = ((totalDuration - exitSecondsLeft) / totalDuration) * 100;

    // Clamp to [0, 100] range
    return Math.max(0, Math.min(100, progress));
  }

  /**
   * Get the initial total duration when transition starts
   * Captures exitSecondsLeft at transition start
   * @param exitSecondsLeft - The initial exitSecondsLeft value
   * @returns The total duration for the transition
   */
  static captureInitialDuration(exitSecondsLeft: number): number {
    return Math.max(0, exitSecondsLeft);
  }

  /**
   * Create an initial transition state object
   * @param targetAction - The target action for the transition
   * @param exitSecondsLeft - The initial exitSecondsLeft value
   * @returns A new TransitionState object
   */
  static createTransitionState(
    targetAction: ControlActionType | null,
    exitSecondsLeft: number
  ): TransitionState {
    const totalDuration =
      TransitionStateManager.captureInitialDuration(exitSecondsLeft);
    return {
      isTransitioning: targetAction !== null,
      targetAction,
      totalDuration,
      remainingSeconds: exitSecondsLeft,
      progress: 0,
      startTime: Date.now(),
    };
  }

  /**
   * Create an empty (non-transitioning) state object
   * @returns A TransitionState object representing no transition
   */
  static createEmptyState(): TransitionState {
    return {
      isTransitioning: false,
      targetAction: null,
      totalDuration: 0,
      remainingSeconds: 0,
      progress: 0,
      startTime: 0,
    };
  }
}
