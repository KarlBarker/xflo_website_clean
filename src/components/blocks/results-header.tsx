import React from 'react';

interface ResultsHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ResultsHeader({
  title = "Created with passion, driven by results",
  className
}: Omit<ResultsHeaderProps, 'subtitle'>) {
  return (
    <section className={`pt-32 pb-spacing-section bg-surface-primary ${className || ''}`} data-nav-theme="light">
      <div className="container-inner">
        <div className="max-w-4xl">
          <h1 className="title-7xl font-semibold text-content-inverse tracking-header leading-header">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}