import { Request, Response } from 'express';
import { deleteSession, loginByPin } from './auth.service';



export const login = async (req: Request, res: Response) => {
  const { pin } = req.body;

  const {auth , workSpace, sessionId} = await loginByPin(pin);

  if (!auth) {
    return res.status(401).json({
      success: false,
    });
  }


  res.cookie("sessionId", sessionId);

  res.json({
    success: true,
    workSpace,
    user: auth
  });
};

export const deleteSessionController = async (req: Request, res: Response) => {
  const key = req.cookies.sessionId;
  const result = await deleteSession(key);
  res.json(result);
}


// export const login = async (req: Request, res: Response) => {
//     const { pin } = req.body;

//     if (!pin) {
//         return res.status(400).json({message: 'Введите пин-код'})
//     }

//     try {
//         const user = await loginByPin(pin);
        
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
