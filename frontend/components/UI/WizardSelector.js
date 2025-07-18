import React, { useState } from 'react';
import WizardIcon from './WizardIcon';
import WizardStaff from './WizardStaff';
import WizardSilhouette from './WizardSilhouette';
import WizardSwirl from './WizardSwirl';
import MinimalWizard from './MinimalWizard';

export default function WizardSelector({ onSelect, currentSelection = 'WizardIcon' }) {
  const [selectedWizard, setSelectedWizard] = useState(currentSelection);

  const wizardOptions = [
    {
      name: 'WizardIcon',
      component: WizardIcon,
      label: 'Wizard Hat with Twinkling Stars',
      description: 'Classic wizard hat with animated stars that fade in and out'
    },
    {
      name: 'WizardStaff',
      component: WizardStaff,
      label: 'Wizard Staff with Pulsing Orb',
      description: 'Magical staff with color-changing orb and sparkle effects'
    },
    {
      name: 'WizardSilhouette',
      component: WizardSilhouette,
      label: 'Wizard Silhouette with Floating Sparkles',
      description: 'Full wizard figure with colorful floating sparkles'
    },
    {
      name: 'WizardSwirl',
      component: WizardSwirl,
      label: 'Wizard Hat with Swirling Magic',
      description: 'Wizard hat surrounded by swirling magical energy streams'
    },
    {
      name: 'MinimalWizard',
      component: MinimalWizard,
      label: 'Minimalist Wizard with Glowing Staff',
      description: 'Clean, simple wizard design with glowing staff orb'
    }
  ];

  const handleSelection = (wizardName) => {
    setSelectedWizard(wizardName);
    if (onSelect) {
      onSelect(wizardName);
    }
  };

  return (
    <div className="wizard-selector">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        {wizardOptions.map((option) => {
          const WizardComponent = option.component;
          const isSelected = selectedWizard === option.name;

          return (
            <div
              key={option.name}
              onClick={() => handleSelection(option.name)}
              style={{
                padding: '1rem',
                border: `2px solid ${isSelected ? 'var(--theme-accent, #805ad5)' : 'var(--theme-border, #e2e8f0)'}`,
                borderRadius: '0.5rem',
                backgroundColor: isSelected ? 'rgba(128, 90, 213, 0.1)' : 'var(--theme-cardBg, #ffffff)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isSelected ? '0 4px 12px rgba(128, 90, 213, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <WizardComponent size={48} />
              </div>

              <h4
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: isSelected ? 'var(--theme-accent, #805ad5)' : 'var(--theme-text, #2d3748)'
                }}
              >
                {option.label}
              </h4>

              <p
                style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  color: 'var(--theme-textLight, #718096)',
                  lineHeight: '1.4'
                }}
              >
                {option.description}
              </p>

              {isSelected && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'var(--theme-accent, #805ad5)',
                    color: 'white',
                    borderRadius: '0.25rem',
                    fontSize: '0.7rem',
                    fontWeight: '500'
                  }}
                >
                  SELECTED
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Large Preview */}
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'var(--theme-cardBg, #ffffff)',
          borderRadius: '0.5rem',
          border: '1px solid var(--theme-border, #e2e8f0)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}
      >
        <h3
          style={{
            margin: '0 0 1rem 0',
            color: 'var(--theme-text, #2d3748)',
            fontSize: '1.2rem'
          }}
        >
          Preview at Header Size
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {(() => {
            const SelectedComponent = wizardOptions.find(opt => opt.name === selectedWizard)?.component || WizardIcon;
            return <SelectedComponent size={60} />;
          })()}
          <span
            style={{
              fontSize: '3rem',
              fontWeight: '600',
              color: 'var(--theme-text, #2d3748)'
            }}
          >
            Planeswalker's Primer
          </span>
        </div>

        <p
          style={{
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: 'var(--theme-textLight, #718096)',
            fontStyle: 'italic'
          }}
        >
          {wizardOptions.find(opt => opt.name === selectedWizard)?.description}
        </p>
      </div>

      <style jsx>{`
        .wizard-selector {
          max-width: 100%;
          margin: 0 auto;
        }

        .wizard-selector > div:first-child > div:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 6px 20px rgba(128, 90, 213, 0.3) !important;
        }

        @media (max-width: 768px) {
          .wizard-selector > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
