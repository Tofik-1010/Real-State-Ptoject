import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not configured');
  cachedClient = new MongoClient(uri);
  await cachedClient.connect();
  return cachedClient;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const client = await getClient();
    const db = client.db('propnest');
    const collection = db.collection('properties');

    if (req.method === 'GET') {
      const properties = await collection.find().sort({ createdAt: -1 }).toArray();
      return res.status(200).json(properties);
    }

    if (req.method === 'POST') {
      const { title, price, location, city, state, size, type, status, bedrooms, bathrooms, image, agentName, agentPhone, description, features } = req.body;
      if (!title || !price || !location || !city) {
        return res.status(400).json({ error: 'Missing required fields: title, price, location, city' });
      }
      const result = await collection.insertOne({
        title,
        price: Number(price),
        location,
        city,
        state: state || '',
        size: size || '',
        type: type || 'house',
        status: status || 'available',
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        image: image || '',
        agentName: agentName || '',
        agentPhone: agentPhone || '',
        description: description || '',
        features: features || [],
        createdAt: new Date(),
      });
      return res.status(201).json({ id: result.insertedId, success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Properties API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
