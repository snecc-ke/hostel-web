import React from 'react';

/**
 * Simple tab bar.
 * tabs: [{ id, label, count? }]
 * activeTab: id of current tab
 * onChange: (id) => void
 */
function Tabs({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-gold' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      isActive ? 'bg-gold/15 text-gold' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: '#E9A23B' }}
                ></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Tabs;