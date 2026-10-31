import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { PageId } from '../types';

interface CrumbItem {
  label: string;
  page?: PageId;
  options?: { projectId?: string; serviceId?: string; articleId?: string };
}

interface BreadcrumbsProps {
  items: CrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { navigate } = useNavigation();

  return (
    <nav aria-label="Breadcrumb" className="py-4 text-xs text-gray-500 font-medium">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <button
            onClick={() => navigate('home')}
            className="hover:text-[#12161A] transition-colors"
          >
            Home
          </button>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li aria-hidden="true" className="text-gray-300">
                /
              </li>
              <li>
                {item.page && !isLast ? (
                  <button
                    onClick={() => navigate(item.page!, item.options)}
                    className="hover:text-[#12161A] transition-colors"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className={isLast ? 'text-[#12161A] font-semibold' : 'text-gray-600'}>
                    {item.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
