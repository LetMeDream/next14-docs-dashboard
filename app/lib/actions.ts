'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }).min(1, { message : 'Please select a customer' }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[],
    amount?: string[],
    status?: string[]
  },
  message: string | null
}

/* CREATE */
const CreateInvoice = FormSchema.omit({ id: true, date: true })
export const createInvoice = async (prevState: State, formData: FormData) => {

    const dataObject = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status')
    }

    const validatedFields = CreateInvoice.safeParse(dataObject)

    // console.log(validatedFields)
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }

    const date = new Date().toISOString().split('T')[0]
    const { customerId, status, amount } = validatedFields.data
    const amountInCents = amount * 100

    try {
      await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `
    } catch (error) {
      console.error(error)
      return {
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }
    revalidatePath('/dashboard/invoices/')
    redirect('/dashboard/invoices/')
}

/* UPDATE */
const UpdateInvoice = FormSchema.omit({ id: true, date: true })
export const updateInvoice = async (id: string, prevState: State, formData: FormData) => {
  console.log(formData)
  const dataObject = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  }
  const validatedData = UpdateInvoice.safeParse(dataObject)

  if(!validatedData.success){
    console.log(validatedData.error)
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing Fields. The invoice update failed."
    }
  }

  const amountInCents = validatedData.data.amount * 100 

  try {
    await sql`
    UPDATE invoices 
    SET amount = ${amountInCents},
        status = ${validatedData.data.status}
    WHERE id = ${id}
    `
  } catch (error) {
    console.error(error)
    return {
      message: 'there was an error updating the invoice'
    }
  }
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
}

export const deleteInvoice = async (id: string, formData: FormData) => {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`
    revalidatePath('/dashboard/invoices/')
  } catch (error) {
    console.error(error)
  }
}