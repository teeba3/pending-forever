'use client';
import { BugsProvider } from '@/bugs/BugsContext';
import { AppProvider } from '@/lib/AppContext';
import Shell from './Shell';

export default function Portal() {
  return (<BugsProvider><AppProvider><Shell /></AppProvider></BugsProvider>);
}
