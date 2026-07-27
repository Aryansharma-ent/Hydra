import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AsyncHandler from "express-async-handler";
import User from "../models/User";

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = AsyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }


  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        tier : user.tier,
        token: generateToken(user._id.toString()),
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = AsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;


  const user = await User.findOne({ email });

  if (user && user.password && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
           tier : user.tier,
        token: generateToken(user._id.toString()),
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Google OAuth Register/Login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = AsyncHandler(async (req: Request, res: Response) => {
  const { googleId, email, name, avatarUrl } = req.body;

  if (!googleId || !email) {
    res.status(400);
    throw new Error("Google ID and Email are required");
  }


  let user = await User.findOne({ googleId });

  if (!user) {
   
    user = await User.findOne({ email });

    if (user) {
    
      user.googleId = googleId;
      if (!user.avatarUrl && avatarUrl) user.avatarUrl = avatarUrl;
      await user.save();
    } else {
      // 3. Create new OAuth user
      user = await User.create({
        googleId,
        email,
        name: name || email.split("@")[0],
        avatarUrl,
      });
    }
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      tier : user.tier,
      token: generateToken(user._id.toString()),
    },
  });
});

// @desc    GitHub OAuth Register/Login
// @route   POST /api/auth/github
// @access  Public
export const githubLogin = AsyncHandler(async (req: Request, res: Response) => {
  const { githubId, email, name, avatarUrl } = req.body;

  if (!githubId || !email) {
    res.status(400);
    throw new Error("GitHub ID and Email are required");
  }

  let user = await User.findOne({ githubId });

  if (!user) {
  
    user = await User.findOne({ email });

    if (user) {
      
      user.githubId = githubId;
      if (!user.avatarUrl && avatarUrl) user.avatarUrl = avatarUrl;
      await user.save();
    } else {
  
      user = await User.create({
        githubId,
        email,
        name: name || email.split("@")[0],
        avatarUrl,
      });
    }
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      tier : user.tier,
      token: generateToken(user._id.toString()),
    },
  });
});

// @desc    Get user profile details
// @route   GET /api/auth/me
// @access  Private
export const getMe = AsyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.status(200).json({
    success: true,
    data: user,
  });
});