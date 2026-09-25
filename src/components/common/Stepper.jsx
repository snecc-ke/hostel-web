import React from 'react';
import { Check } from 'lucide-react';

/**
 * Stepper
 * steps: [{ id, label }]
 * currentStep: number (0-indexed)
 * onStepClick: (index) => void (optional — click to jump)
 * maxReachedStep: number (highest step user can click to)
 */
function Stepper({ steps = [], currentStep = 0, onStepClick, maxReachedStep }) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isClickable = onStepClick && idx <= (maxReachedStep ?? currentStep);

          return (
            <React.Fragment key={step.id}>
              {/* Circle */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(idx)}
                className={`flex flex-col items-center gap-2 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: isCompleted || isCurrent ? '#E9A23B' : '#E5E7EB',
                    color: isCompleted || isCurrent ? '#14213D' : '#9CA3AF',
                    border: isCurrent ? '3px solid rgba(233,162,59,0.35)' : 'none',
                  }}
                >
                  {isCompleted ? <Check size={16} /> : idx + 1}
                </div>
                <span
                  className="text-xs font-medium whitespace-nowrap"
                  style={{ color: isCompleted || isCurrent ? '#14213D' : '#9CA3AF' }}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-2 mb-6 transition-colors duration-300"
                  style={{
                    backgroundColor: idx < currentStep ? '#E9A23B' : '#E5E7EB',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Stepper;