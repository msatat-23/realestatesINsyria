import { Readex_Pro } from 'next/font/google';
import Navbar from "@/components/navbar/navbar";
import Search from "@/components/search/search";
import Subdesc from "@/components/subscriptiondescription/subdesc";
import classes from './page.module.css';
import { Fragment } from "react";
import Mainpageproperties from "@/components/property/mainpageproperties";
import Footer from "@/components/footer/footer";
import prisma from '@/lib/prisma';
const Readex_Pro_Font = Readex_Pro(
  {
    subsets: ['arabic'],
    weight: "400"
  }
);


export default async function Home() {
  let propertiesToTake = 12;
  const exclusive = await prisma.property.findMany({
    where: {
      subscription: "EXCLUSIVE",
      state: "ACCEPTED"
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: propertiesToTake,
    select: {
      id: true,
      title: true,
      description: true,
      purpose: true,
      state: true,
      propertyType: true,
      price: true,
      area: true,
      region: { select: { city: { select: { name: true } }, name: true } },
      subscription: true,
      createdAt: true
    },
  });
  const special = await prisma.property.findMany({
    where: {
      subscription: "PREMIUM",
      state: "ACCEPTED"
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: propertiesToTake,
    select: {
      id: true,
      title: true,
      description: true,
      purpose: true,
      state: true,
      propertyType: true,
      price: true,
      area: true,
      region: { select: { city: { select: { name: true } }, name: true } },
      subscription: true,
      createdAt: true
    },
  });

  return (
    <Fragment>

      <div className={`${classes.background} ${Readex_Pro_Font.className}`}>
        <Navbar />
        <Search />
        <Mainpageproperties properties={{ exclusive, special }} />
        <Subdesc />
        <Footer />
      </div>
    </Fragment>);
}
