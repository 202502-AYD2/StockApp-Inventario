import React from 'react';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/config/prisma';

export default async function PROJECTS(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Handle GET request
    prisma.project
      .findMany({
        orderBy: { createdAt: 'desc' },
      })
      .then((projects) => {
        console.log('projects :>> ', projects);
        res.status(200).json(projects);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Error fetching projects' });
      });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
