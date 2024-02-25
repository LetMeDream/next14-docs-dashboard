'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  // NOTE: comment in this code when you get to this point in the course
  const searchParams = useSearchParams()
  let currentPage = Number(searchParams.get('page')) || 1
  const params = useSearchParams()

  const allPages = generatePagination(currentPage, totalPages);

  // There is my way
  const createPageURL = (page: number) => {
    let url 
    // If no pages, and no query
    if(!params.get('query') && page <= 1){
      url = `/dashboard/invoices`
    }
    // If pages, and no query
    if(!params.get('query') && page > 1){
      url = `/dashboard/invoices?page=${page}`
    }   
    // If query and pages
    if(params.get('query') && page > 1){
      url = `/dashboard/invoices?query=${params.get('query')}&page=${page}`
    }   
    // If query and no pages
    if(params.get('query') && page <= 1){
      url = `/dashboard/invoices?query=${params.get('query')}`
    }   
    return url || ''
  }

  // and the docs way
  const pathname = usePathname()
  const createPageURLDocs = (page: Number) => {
    const buildInParams = new URLSearchParams(searchParams)
    console.log(buildInParams)
    buildInParams.set('page', page.toString());
    return `${pathname}?${buildInParams.toString()}`;
  }


  return (
    <>
      {/* NOTE: comment in this code when you get to this point in the course */}

      <div className="inline-flex">
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: 'first' | 'last' | 'single' | 'middle' | undefined;

            if (index === 0) position = 'first';
            if (index === allPages.length - 1) position = 'last';
            if (allPages.length === 1) position = 'single';
            if (page === '...') position = 'middle';

            return (
              <PaginationNumber
                key={page}
                href={createPageURL(Number(page))}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );

            /* const className = clsx(
              'flex h-10 w-10 items-center justify-center text-sm border',
              {
                'rounded-l-md': position === 'first' || position === 'single',
                'rounded-r-md': position === 'last' || position === 'single',
                'z-10 bg-blue-600 border-blue-600 text-white': currentPage === page,
                'hover:bg-gray-100': !(currentPage === page) && position !== 'middle',
                'text-gray-300': position === 'middle',
              },
            );

              return (
                <button key={page} onClick={() => createPageURL(Number(page))} className={className}>
                  {page}
                </button>
              ) */


          })}
        </div>

        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-blue-600 border-blue-600 text-white': isActive,
      'hover:bg-gray-100': !isActive && position !== 'middle',
      'text-gray-300': position === 'middle',
    },
  );

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'hover:bg-gray-100': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
