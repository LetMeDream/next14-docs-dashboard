'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

    revalidatePath('/dashboard/invoices/')
    redirect('/dashboard/invoices/')
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true })
export const updateInvoice = async (id: string, formData: FormData) => {
  console.log(formData)
  const dataObject = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  }
  const validatedData = UpdateInvoice.parse(dataObject)
  const amountInCents = validatedData.amount * 100 

  await sql`
  UPDATE invoices 
  SET amount = ${amountInCents},
      status = ${validatedData.status}
  WHERE id = ${id}
  `
  revalidatePath('/dashboard/invoices/')
  redirect('/dashboard/invoices/')
}

const statusSwitch = z.object({
  status: z.string()
})
export const changeStatus = async (id: string, formData: FormData) => {
  const formObject = {
    status: formData.get('status')
  }
  const { status} = statusSwitch.parse(formObject)
  const query = `UPDATE invoices SET status = ${status} WHERE id = ${id}`

  try {
    await sql`
    UPDATE invoices 
      SET status=${status}
    WHERE id=${id}
    `
  } catch (error) {
    console.log(error)
  }
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices');

}

const DeleteInvoice = z.string()
export const deleteInvoice = async (id: string, formData: FormData) => {
  const validatedId = DeleteInvoice.parse(id)

  await sql`
  DELETE FROM invoices 
  WHERE id = ${id}
  `

  revalidatePath('/dashboard/invoices/')
  redirect('/dashboard/invoices/')
}