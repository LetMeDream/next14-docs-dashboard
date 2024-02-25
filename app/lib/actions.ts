'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string()
})

const CreateInvoice = FormSchema.omit({ id: true, date: true })

export const createInvoice = async (formData: FormData)  => {
  
    const dataObject = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status')
    }

    const validatedData = CreateInvoice.parse(dataObject)
    const amountInCents = validatedData.amount * 100
    const date = new Date().toISOString().split('T')[0]

    const { customerId, status } = validatedData

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

  
}