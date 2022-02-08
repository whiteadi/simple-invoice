export type InvoiceItem = {
    id: number,
    description: string,
    price: number,
    invoiceId: number,
}
export type Invoice = {
    id: number,
    name: string,
    due_date: Date,
    status: string,
}