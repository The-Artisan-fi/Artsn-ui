import { connectToDatabase } from '@/lib/mongodb';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Login API Route Handler
 * 
 * This route handles user authentication by verifying email and password,
 * and issues a JWT token upon successful login.
 */
export async function POST(_req: Request) {
  try {
    // Parse the request body
    const req = await _req.json();
    const { email, password } = req;

    // Check if email and password are provided
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing email or password' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // Connect to the database
      const { db } = await connectToDatabase();
      const collection = db.collection('users');

      // Find the user by email
      const user = await collection.findOne({ email });
      if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Verify the password
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      // Return successful response with token and user UUID
      return new Response(JSON.stringify({ token, uuid: user.uuid }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      // Handle database or other errors
      return new Response(JSON.stringify({ error: 'Error logging in' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    // Handle JSON parsing errors
    return new Response(JSON.stringify({ error: 'Error logging in' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}