'use client';

import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { changeStatus } from '@/app/lib/actions';
import { useState, useEffect } from 'react';

export default function InvoiceStatus({
   status,
   invoice, 
   index
  }: { 
    status: string, 
    invoice: {
      status: string,
      id: string
    },
    index: number
  }) {
  
  const bindChangeStatus = changeStatus.bind(null, invoice?.id.trim())
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    setNewStatus(() => {
      return invoice.status === 'paid' ? 'pending' : 'paid'
    })
  }, [invoice.status])

  return (
    <>
      <form 
        id={`form_${index}`}
        action={bindChangeStatus}
      > 
        <button
          className={clsx(
            'inline-flex items-center rounded-full px-2 py-1 text-xs cursor-pointer relative',
            {
              'bg-gray-100 text-gray-500': status === 'pending',
              'bg-green-500 text-white': status === 'paid',
            },
          )}
        > 
          {status === 'pending' ? (
            <>
              Pending
              <ClockIcon className="ml-1 w-4 text-gray-500" />
            </>
          ) : null}
          {status === 'paid' ? (
            <>
              Paid
              <CheckIcon className="ml-1 w-4 text-white" />
            </>
          ) : null}
        </button>
        <input className='hidden' id='status' name='status' defaultValue={newStatus} />
      </form>
    </>
  );
}
