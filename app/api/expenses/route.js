import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://sribalagan:seemasri@cluster0.ok09s1x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Your MongoDB URI
let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

const connectToDatabase = async () => {
  const client = await clientPromise;
  return client.db('your_database_name'); // Replace with your actual database name
};

export async function GET() {
  const db = await connectToDatabase();
  const expenses = await db.collection('expenses').find({}).toArray();
  
  return new Response(JSON.stringify(expenses), { status: 200 });
}

export async function POST(request) {
  const db = await connectToDatabase();
  const { description, amount } = await request.json();
  
  const { insertedId } = await db.collection('expenses').insertOne({ description, amount });
  const newExpense = await db.collection('expenses').findOne({ _id: insertedId });

  return new Response(JSON.stringify(newExpense), { status: 201 });
}

export async function PUT(request) {
  const db = await connectToDatabase();
  const { id, description, amount } = await request.json();

  const result = await db.collection('expenses').updateOne(
    { _id: new ObjectId(id) },
    { $set: { description, amount } }
  );

  if (result.modifiedCount === 0) {
    return new Response('Expense not found', { status: 404 });
  }

  const updatedExpense = await db.collection('expenses').findOne({ _id: new ObjectId(id) });
  return new Response(JSON.stringify(updatedExpense), { status: 200 });
}

export async function DELETE(request) {
  const db = await connectToDatabase();
  const { id } = await request.json();

  const result = await db.collection('expenses').deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return new Response('Expense not found', { status: 404 });
  }

  return new Response(JSON.stringify({ message: 'Expense deleted' }), { status: 200 });
}
