/**
 * Realistic sample data so the app can be tried out before real plots exist.
 * Run with `npm run db:seed`. Wipes both tables first.
 */
import 'dotenv/config';

import { db } from './index';
import { buyers, plots, type NewBuyer, type NewPlot } from './schema';

const LAKH = 100_000;
const CRORE = 10_000_000;

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

const SAMPLE_PLOTS: NewPlot[] = [
  {
    location: 'Shankarpally',
    sizeValue: 2,
    sizeUnit: 'acres',
    askingPrice: 1.2 * CRORE,
    ownerName: 'Ramesh Reddy',
    ownerPhone: '98480 11223',
    status: 'available',
    notes: 'Road facing, borewell already there. Papers clear.',
  },
  {
    location: 'Chevella',
    sizeValue: 1,
    sizeUnit: 'acres',
    askingPrice: 45 * LAKH,
    ownerName: 'Lakshmi Devi',
    ownerPhone: '99590 44556',
    status: 'available',
    notes: 'Owner is in a hurry, some price movement possible.',
  },
  {
    location: 'Moinabad',
    sizeValue: 300,
    sizeUnit: 'sq yards',
    askingPrice: 28 * LAKH,
    ownerName: 'Srinivas Rao',
    ownerPhone: '90000 77889',
    status: 'available',
    notes: 'HMDA approved layout, corner plot.',
  },
  {
    location: 'Shankarpally',
    sizeValue: 40,
    sizeUnit: 'cents',
    askingPrice: 60 * LAKH,
    ownerName: 'Anjaiah',
    ownerPhone: '94900 33221',
    status: 'available',
  },
  {
    location: 'Vikarabad',
    sizeValue: 5,
    sizeUnit: 'acres',
    askingPrice: 1.75 * CRORE,
    ownerName: 'Mohan Rao',
    ownerPhone: '98661 55443',
    status: 'under_negotiation',
    notes: 'Advance discussed with a Hyderabad buyer. Waiting on their loan.',
  },
  {
    location: 'Chevella',
    sizeValue: 2.5,
    sizeUnit: 'acres',
    askingPrice: 95 * LAKH,
    ownerName: 'Padma Reddy',
    ownerPhone: '97010 88776',
    status: 'sold',
    soldAt: daysAgo(9),
    notes: 'Sold to a Kukatpally family. Commission received.',
  },
  {
    location: 'Kollur',
    sizeValue: 250,
    sizeUnit: 'sq yards',
    askingPrice: 55 * LAKH,
    ownerName: 'Venkatesh',
    ownerPhone: '89777 22110',
    status: 'sold',
    soldAt: daysAgo(120),
  },
];

const SAMPLE_BUYERS: NewBuyer[] = [
  {
    name: 'Suresh Kumar',
    phone: '98490 12345',
    budgetMin: 40 * LAKH,
    budgetMax: 70 * LAKH,
    areaPreference: 'Shankarpally, Chevella',
    sizePreference: '1 acre or so',
    status: 'active',
    lastContactedAt: daysAgo(12),
    notes: 'Wants to build a farmhouse. Can pay in one go.',
  },
  {
    name: 'Praveen Goud',
    phone: '99486 55667',
    budgetMin: 1 * CRORE,
    budgetMax: 2 * CRORE,
    areaPreference: 'Shankarpally',
    sizePreference: '2 acres and above',
    status: 'active',
    lastContactedAt: daysAgo(7),
    notes: 'Investor. Has bought through us before.',
  },
  {
    name: 'Fatima Begum',
    phone: '90300 99887',
    budgetMin: 20 * LAKH,
    budgetMax: 35 * LAKH,
    areaPreference: 'Moinabad',
    sizePreference: '200–300 sq yards',
    status: 'new',
    lastContactedAt: null,
    notes: 'Came through Rafi bhai. Wants an approved layout only.',
  },
  {
    name: 'Ravi Teja',
    phone: '81420 66554',
    budgetMin: 1.5 * CRORE,
    budgetMax: 2.5 * CRORE,
    areaPreference: 'Vikarabad, Chevella',
    status: 'active',
    lastContactedAt: daysAgo(2),
    notes: 'Looking for a big piece for a resort.',
  },
  {
    name: 'Ashok Sharma',
    phone: '70320 11445',
    budgetMin: 30 * LAKH,
    budgetMax: 50 * LAKH,
    areaPreference: 'Kollur',
    status: 'new',
    lastContactedAt: daysAgo(20),
  },
  {
    name: 'Geetha Rani',
    phone: '96520 33778',
    budgetMin: 80 * LAKH,
    budgetMax: 1.1 * CRORE,
    areaPreference: 'Chevella',
    status: 'closed',
    lastContactedAt: daysAgo(9),
    notes: 'Bought the 2.5 acre Chevella plot.',
  },
  {
    name: 'Naveen Chandra',
    phone: '77020 44991',
    budgetMin: 15 * LAKH,
    budgetMax: 25 * LAKH,
    areaPreference: 'Shadnagar',
    status: 'lost',
    lastContactedAt: daysAgo(45),
    notes: 'Budget too low for what he wants. Bought elsewhere.',
  },
];

async function seed() {
  await db.delete(plots);
  await db.delete(buyers);

  const now = new Date();
  await db.insert(plots).values(
    SAMPLE_PLOTS.map((plot) => ({ ...plot, createdAt: now, updatedAt: now })),
  );
  await db.insert(buyers).values(
    SAMPLE_BUYERS.map((buyer) => ({ ...buyer, createdAt: now, updatedAt: now })),
  );

  console.log(`Seeded ${SAMPLE_PLOTS.length} plots and ${SAMPLE_BUYERS.length} buyers.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
