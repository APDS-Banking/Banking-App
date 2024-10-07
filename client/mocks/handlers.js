import { rest } from 'msw';

export const handlers = [
  rest.post('http://localhost:3001/login', (req, res, ctx) => {
    const { email, password } = req.body;
    
    if (email === 'user@test.com' && password === 'password123') {
      return res(ctx.json({ token: 'mock-token' }));
    } else {
      return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
    }
  }),
  
];
