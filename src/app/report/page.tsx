"use client"
import Contact from '@/src/components/Contact'
import Header from '@/src/components/Header';
import React from 'react'

export default function Reportpage() {
  return (
    <>
      <Header/>
      <Contact page={"complaint"} />
    </>
  );
}
