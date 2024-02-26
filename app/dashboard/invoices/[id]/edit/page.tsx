import React from 'react'
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import EditInvoiceForm from '@/app/ui/invoices/edit-form'
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data'

const Page = async (
  {
    params
  } : {
    params: {
      id: string
    }
  }
) => {
  const customers = await fetchCustomers()
  const invoice = await fetchInvoiceById(params.id)
  console.log(invoice)

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: `/dashboard/invoices/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <EditInvoiceForm 
        customers={customers}
        invoice={invoice}
      />

    </main>
  )
}

export default Page