import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/user';
import { Authentication } from '../middleware/authentication';
import { validate } from 'class-validator';

export const getUser = async (req: Request, res: Response) => {
  const token = req.token;
  const userRepository = await getRepository(User);

  const user = await userRepository.findOneOrFail({
    where: {
      id: token!.id,
    },
  });

  if (!user) {
    return res.status(404).send('user not found');
  }
  return res.send({
    data: {
      highScore: user.highScore,
      id: user.id,
      userName: user.userName,
    },
  });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const token = req.token;
  const userRepository = await getRepository(User);

  const user = await userRepository.findOneOrFail({
    where: {
      id: token!.id,
    },
  });

  if (!user) {
    return res.status(404).send('user not found');
  }
  {
    const users = await userRepository.find({
      select: ['userName', 'highScore'],
      order: { highScore: 'DESC' },
      take: 8,
    });
    return res.status(200).send({
      data: users,
    });
  }
};

export const patchUser = async (req: Request, res: Response) => {
  const token = req.token;
  const { key, userName, highScore } = req.body;

  const userRepository = await getRepository(User);

  if (!key || key !== process.env.SECRET_KEY_512) {
    return res.status(401).send({
      message: 'only backend is allowed to patch your high score, sorry!',
    });
  }
  const user = await userRepository.findOneOrFail({
    where: {
      id: token!.id,
    },
  });

  if (!user) {
    return res.status(404).send('user not found');
  }

  const userWithSameName = await userRepository.findOne({
    where: {
      userName,
    },
  });

  // if another user has the same name return 400
  // to uppercase because mysql is not case sensitive
  if (userWithSameName && user.userName.toUpperCase() !== userName.toUpperCase()) {
    return res.status(400).send({
      status: 'bad_request: name already taken',
    });
  }

  user.userName = userName;
  user.highScore = highScore;
  await userRepository.save(user);
  return res.send({
    data: {
      highScore: user.highScore,
      id: user.id,
      userName: user.userName,
    },
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  const userRepository = await getRepository(User);

  // check if User exists
  const user = await userRepository.findOne({
    where: {
      userName,
    },
  });

  if (user) {
    return res.status(400).send({
      status: 'bad_request: name already taken',
    });
  }

  const hashedPassword: string = await Authentication.hashPassword(password);
  const newUser = new User();
  newUser.userName = userName;
  newUser.highScore = 0;
  newUser.password = hashedPassword;

  const errors = await validate(newUser);

  if (errors.length > 0) {
    res.status(400).send({
      status: `bad request (${errors})`,
    });
  }

  const createdUser = await userRepository.save(newUser);
  // delete to not return the password in Response
  // @ts-ignore
  delete createdUser.password;

  return res.status(201).send({
    data: createdUser,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  const userRepository = await getRepository(User);

  // check if User exists
  const user = await userRepository.findOne({
    select: ['password', 'userName', 'highScore', 'id'],
    where: {
      userName,
    },
  });

  if (!user) {
    return res.status(401).send({
      status: 'unauthorized',
    });
  }

  const matchingPasswords: boolean = await Authentication.comparePasswordWithHash(password, user.password);
  if (!matchingPasswords) {
    return res.status(401).send({
      status: 'unauthorized',
    });
  }

  const token: string = await Authentication.generateToken({
    highScore: user.highScore,
    id: user.id,
    userName: user.userName,
  });

  return res.send({
    data: token,
  });
};
