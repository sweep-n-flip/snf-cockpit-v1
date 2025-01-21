'use client'
import React, { useState, Suspense, ReactNode } from 'react'

export interface Tab {
  id: string
  label: string
  component: ReactNode
}

export interface TabsProps {
  tabs: Tab[]
  defaultActiveTab?: string
  className?: string
}

interface TabSkeletonProps {
  className?: string
}

const TabSkeleton: React.FC<TabSkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse p-4 ${className}`}>
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
)

const Tabs: React.FC<TabsProps> = ({ tabs, defaultActiveTab, className = '' }) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (!tabs || tabs.length === 0) return ''
    return defaultActiveTab || tabs[0].id
  })

  return (
    <div className={`w-full  ${className}`}>
      {!tabs || tabs.length === 0 ? (
        <div className="p-4 text-gray-500">No tabs available</div>
      ) : (
        <nav className="flex space-x-8 border-b border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex items-center px-1 py-4 ${
                activeTab === tab.id
                  ? '-mb-px text-color-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              type="button"
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <span className="text-sm font-medium">{tab.label}</span>
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-color-primary transition-all duration-300 ease-out
              ${activeTab === tab.id ? 'w-full' : 'w-0 group-hover:w-full'}`}
                aria-hidden="true"
              />
            </button>
          ))}
        </nav>
      )}
      <div className="py-6">
        {tabs?.map(
          (tab) =>
            activeTab === tab.id && (
              <Suspense key={tab.id} fallback={<TabSkeleton />}>
                {tab.component}
              </Suspense>
            ),
        )}
      </div>
    </div>
  )
}

export default Tabs
