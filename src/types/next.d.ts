import { NextPage } from 'next';

declare module 'next' {
  interface PageProps {
    params: Promise<{
      timeTable: string;
      ticketClass: string;
      ticket: string;
      quantity?: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
} 