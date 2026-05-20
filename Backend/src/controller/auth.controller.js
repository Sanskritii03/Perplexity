import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { sendEmail } from '../services/mail.service.js'

export async function registerUser (req, res) {
  console.log(req.body)
  const { username, email, password } = req.body

  const isAlreadyUserExist = await userModel.findOne({
    $or: [{ email }, { username }]
  })

  if (isAlreadyUserExist) {
    return res.status(400).json({
      message: 'user already exists',
      success: false,
      err: 'user exists'
    })
  }

  const user = await userModel.create({
    username,
    email,
    password
  })

  const emailVerificationToken = jwt.sign(
    {
      email: user.email
    },
    process.env.JWT_SECRET
  )

  await sendEmail({
    to: email,
    subject: 'welcome to perplexity',
    html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If its not you ,then you feel free to complaints.</p>
                <p>Best regards,<br>The Perplexity Team</p>

  `
  })
   
  return res.status(201).json({
    message: 'successfully registered',
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  })
}

export async function loginUser (req, res) {
  const { email, password } = req.body

  const user = await userModel.findOne({
    $or: [{ email }]
  })

  if (!user) {
    return res.status(409).json({
      message: 'invalid user',
      err: 'user not found',
      success: false
    })
  }
  const isPasswordValid = await user.comparePassword(password)

  if (!isPasswordValid) {
    return res.status(409).json({
      message: 'invalid password',
      err: 'password not match',
      success: false
    })
  }

  if (!user.verified) {
    return res.status(400).json({
      message: 'not verified',
      success: false,
      err: 'user is not verified'
    })
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  )
  res.cookie('token', token)

  res.status(201).json({
    message: 'successfully loggedIN',
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  })
}

export async function getMe (req, res) {
  const userId = req.user.id
  const user = await userModel.findById(userId).select('-password')

  if (!user) {
    return res.status(404).json({
      message: 'user not found',
      err: 'user not found',
      success: false
    })
  }
  res.status(200).json({
    message: 'user detail fetched successfully',
    success: true,
    user
  })
}

export async function verifyEmail (req, res) {
  const { token } = req.query
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const user = await userModel.findOne({
    email: decoded.email
  })

  if (!user) {
    return res.status(409).json({
      message: 'invalid token',
      success: false,
      err: 'user not found'
    })
  }
  user.verified = true

  await user.save()

  const html = ` 
  <h1> email verified successfully</h1>
  <p> your email been verified successfully, you can login successfully</p>
  <a href='http://localhost:3000/api/auth/login'> login</a>
`
  res.send(html)
}
