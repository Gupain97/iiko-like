import { Request, Response } from 'express';
import { loginByPin } from '../services/auth.service';



export const login = async (req: Request, res: Response) => {
  const { pin } = req.body;

  const user = await loginByPin(pin);

  if (!user) {
    return res.status(401).json({
      success: false,
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      role: user.role,
      name: user.name,
      surname: user.surname,
    },
  });
};


// export const login = async (req: Request, res: Response) => {
//     const { pin } = req.body;

//     if (!pin) {
//         return res.status(400).json({message: 'Введите пин-код'})
//     }

//     try {
//         const user = await loginByPin(pin);
//         console.log( user , 'controller')
        
//         return res.status(200).json({message: 'Авторизация успешна!', user});
//     } catch (error) {
//         return res.status(401).json({message: 'Неверный пин!'});
//     };

    // const result = loginByPin(pin);

    // if (!result.success) {
    //     return res.status(401).json({ message: result.message });
    // }

    // return res.json(result);
//};
