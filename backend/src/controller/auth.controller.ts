import { Request, Response } from 'express';
import { signUpService, loginService } from '@/services/auth.service';
import IMerchant from '@/models/merchant.model';
import { hashPassword, comparePassword } from '@/utils/hash.util';
import { generateTokens } from '@/utils/token.util';

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Name, email and password are required' });
    }
    if (role === 'merchant') {
      const { companyName, companyId, nationalId } = req.body;
      if (!companyName || !companyId || !nationalId) {
        return res
          .status(400)
          .json({ msg: 'Company name, company ID and national ID are required for merchants' });
      }
    }
    const user = await signUpService({ name, email, password });
    return res.status(201).json({ msg: 'User created', user });
  } catch (err: any) {
    return res.status(400).json({ msg: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { user, tokens } = await loginService(email, password);

    return res.json({ msg: "Logged in", tokens, user });
  } catch (err: any) {
    return res.status(400).json({ msg: err.message });
  }
};
