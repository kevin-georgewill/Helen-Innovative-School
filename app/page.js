import { redirect } from 'next/navigation';

// Written by Bearilly Buildgram: this school had no landing page of its own, so the first page is the login page.
export default function Home() {
  redirect('/login');
}
