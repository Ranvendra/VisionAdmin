import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

// GET: Fetch all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find().sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error: any) {
    console.error('API GET Users Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch seeded users.',
      },
      { status: 500 }
    );
  }
}

// POST: Create a new user manual seed
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, isAdult, maxDevicesAllowed } = body;

    // Input Validation
    if (!username || typeof username !== 'string' || !username.trim()) {
      return NextResponse.json(
        { success: false, error: 'Username is required.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      return NextResponse.json(
        { success: false, error: 'Password is required.' },
        { status: 400 }
      );
    }

    // Sanitise numerical field
    let parsedMaxDevices = 2; // Model default
    if (maxDevicesAllowed !== undefined && maxDevicesAllowed !== null && maxDevicesAllowed !== '') {
      const num = Number(maxDevicesAllowed);
      if (!isNaN(num) && num > 0) {
        parsedMaxDevices = Math.floor(num);
      }
    }

    // Connect DB
    await connectDB();

    // Atomic Upsert Logic (Same Design Pattern as Stream Router)
    const filter = { username: username.trim().toLowerCase() };
    const updateData = {
      username: username.trim(), // Ensure stored normalized if upserting
      password: password.trim(), // Updated securely
      isAdult: Boolean(isAdult),
      maxDevicesAllowed: parsedMaxDevices,
    };

    const savedUser = await User.findOneAndUpdate(
      filter,
      { $set: updateData },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: `User "${username.trim()}" synchronized in database successfully.`,
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        isAdult: savedUser.isAdult,
        accountStatus: savedUser.accountStatus,
        createdAt: savedUser.createdAt,
      },
    });

  } catch (error: any) {
    console.error('API POST Create User Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred while seeding the user.',
      },
      { status: 500 }
    );
  }
}
