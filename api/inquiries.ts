import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ObjectId } from 'mongodb';

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
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const client = await getClient();
    const db = client.db('propnest');
    const collection = db.collection('inquiries');

    if (req.method === 'GET') {
      const inquiries = await collection.find().sort({ createdAt: -1 }).toArray();
      return res.status(200).json(inquiries);
    }

    if (req.method === 'POST') {
      const { propertyId, propertyTitle, name, email, phone, message } = req.body;
      if (!name || !email || !message || !propertyId) {
        return res.status(400).json({ error: 'Missing required fields: name, email, message, propertyId' });
      }
      const result = await collection.insertOne({
        propertyId,
        propertyTitle: propertyTitle || '',
        name,
        email,
        phone: phone || '',
        message,
        status: 'new',
        createdAt: new Date(),
      });
      return res.status(201).json({ id: result.insertedId, success: true });
    }

    if (req.method === 'PATCH') {
      const { id, status } = req.body;
      if (!id || !status) return res.status(400).json({ error: 'Missing id or status' });
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status } });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Inquiry API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
