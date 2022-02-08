import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

import { Invoice, InvoiceItem } from '../types';
import { StatusTypes } from '../constants';
import { getItems } from '../api';
import { stopPropagation } from '../utils/utile';
import moment from 'moment';

const StyleWrap = styled.div`
  td {
    width: 10%;
    cursor: pointer;
    &:nth-child(2){
      width: 60%;
    }
  }
  tr.overdue td {
    background-color: #ffd3d3;
  }
  .btn {
    margin: 2px;
  }
`;

const StyledButton = styled.button`
  background: 'white';
  color: blue;
  &:hover {
    cursor: pointer;
  }
`;

const StyledLink = styled.a`
  background: 'blue';
  color: green;
  text-decoration: none;
  font-size: 12px;
  padding: 1rem;
  font-family: sans-serif;
  border-radius: 5px;
  text-align: center;
  margin: 5px;
  border: '3px solid black';
`;

type InvoicesProps = {
    invoices: Array<Invoice>,
    handleDelete: (id: number) => void,
};

const getInvoiceTotal = async (invoiceId: number): Promise<number> => {
    const items = await getItems(invoiceId);
    const total: number = items.reduce((acc: number, item: InvoiceItem) => (acc + item.price), 0);
    return total;
};

const getTotal = async (invoices: Array<Invoice>) => {
    let total = 0;
    for (const invoice of invoices) {
        const invoiceTotal = await getInvoiceTotal(invoice.id);
        total = total + invoiceTotal;
    }
    return total;
};

type InvoicesTotalProps = {
    id: number,
    total: number,
};

const Invoices = ({ invoices, handleDelete }: InvoicesProps): JSX.Element => {
    const [total, setTotal] = useState(0);
    const [totalPerInvoice, setTotalPerInvoice] = useState<InvoicesTotalProps[] | []>([]);

    useEffect(() => {
        getTotal(invoices).then(sum => setTotal(sum));
    }, [invoices]);

    useEffect(() => {
        for (const invoice of invoices) {
            getItems(invoice.id).then(items => {
                const totalInvoice: number = items.reduce((acc: number, item: InvoiceItem) => (acc + item.price), 0);
                setTotalPerInvoice(prevTotalPerInvoice => [
                    ...prevTotalPerInvoice,
                    {
                        id: invoice.id,
                        total: totalInvoice,
                    }
                ]);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoices]);

    const navigate = useNavigate();
    const newURL = '/invoice';

    const getInvoiceRow = (invoice: Invoice, totalForInvoice: InvoicesTotalProps[]) => {
        const mailSubject = encodeURI(`Invoice: ${invoice.name}`);
        const mailBody =
            `Please view your invoice at this web page: http://example.com/invoices/${invoice.id}`;
        const mailTo = `mailto:?subject=${mailSubject}&body=${mailBody}`;
        const overdue =
            invoice.status !== StatusTypes.PAID && (new Date(invoice.due_date).getTime() - new Date().getTime() <= 0);
        const editURL = `/edit/${invoice.id}`;

        const bgColor = overdue ? '#FF0000' : '#FFFFFF';
        return (
            <tr
                key={invoice.id}
                onClick={() => navigate(editURL)}
                style={{ backgroundColor: bgColor, }}
            >
                <td>{moment(invoice.due_date).format("dd/MM/yyyy")}</td>
                <td>{invoice.name}</td>
                <td>{(totalForInvoice.find(totalObj => totalObj.id === invoice.id)?.total)?.toLocaleString("en-US")}</td>
                <td>{invoice.status}</td>
                <td>
                    {/* EDIT */}
                    <StyledLink href={editURL} onClick={stopPropagation}>Edit</StyledLink>
                </td>
                <td>
                    {/* MAIL */}
                    <StyledLink href={mailTo} onClick={stopPropagation}>Email</StyledLink>
                </td>
                <td>
                    {/* DELETE BUTTON */}
                    <StyledButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        handleDelete(invoice.id);
                        e.stopPropagation();
                    }}>Delete</StyledButton>
                </td>
            </tr>
        )
    };

    return (
        <StyleWrap>
            <h1>Invoices</h1>
            <hr />
            <div>
                <div>
                    <StyledLink href={newURL}>Add invoice</StyledLink>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Due Date</th>
                        <th>Name</th>
                        <th>Total invoice</th>
                        <th>Status</th>
                        <th colSpan={3}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice: Invoice) => {
                        const row = getInvoiceRow(invoice, totalPerInvoice);
                        return row;
                    })}
                </tbody>
            </table>
            <div>
                <div>Total</div>
                <div>
                    {total.toLocaleString("en-US")}
                </div>
            </div>
        </StyleWrap>
    )
};


export default Invoices;