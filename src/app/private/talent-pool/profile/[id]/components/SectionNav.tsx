'use client';

import { useEffect, useMemo, useState } from 'react';

import { Link } from '@heroui/react';

type Section = {
  id: string;
  label: string;
  icon?: string;
};

interface SectionNavProps {
  sections: Section[];
}

export const SectionNav: React.FC<SectionNavProps> = ({ sections = [] }) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return (
    <div className='flex flex-wrap gap-2 text-sm'>
      {sections.map((item) => {
        const isActive = activeId === item.id;
        return (
          <Link
            key={item.id}
            href={`#${item.id}`}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium transition-all duration-200 ${
              isActive
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-default-200/60 bg-background/60 hover:bg-primary/5 hover:border-primary/30 text-foreground-600 hover:text-primary'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};
