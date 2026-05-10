import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRegisteredDevice {
  deviceId: string;
  model?: string;
  platform?: 'ios' | 'android';
  firstLoginAt?: Date;
  lastLoginAt?: Date;
}

export interface IUser extends Document {
  username: string;
  password: string; // Store as plain text exactly as client app currently handles
  isAdult: boolean;
  registeredDevices: IRegisteredDevice[];
  accountStatus: 'active' | 'blocked' | 'suspended';
  maxDevicesAllowed: number;
  createdAt: Date;
  updatedAt: Date;
}

const RegisteredDeviceSchema = new Schema<IRegisteredDevice>({
  deviceId: { type: String, required: true },
  model: { type: String },
  platform: { type: String, enum: ['ios', 'android'] },
  firstLoginAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now }
});

const UserSchema = new Schema<IUser>(
  {
    username: { 
      type: String, 
      required: [true, 'Username is required'], 
      unique: true, 
      trim: true, 
      lowercase: true 
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'] 
    },
    isAdult: { 
      type: Boolean, 
      default: false 
    },
    registeredDevices: [RegisteredDeviceSchema],
    accountStatus: { 
      type: String, 
      enum: ['active', 'blocked', 'suspended'], 
      default: 'active' 
    },
    maxDevicesAllowed: { 
      type: Number, 
      default: 2 
    }
  },
  { 
    timestamps: true 
  }
);

UserSchema.index({ username: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
