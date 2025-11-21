import { Router } from 'express';
import { nanoid } from 'nanoid';

export const router = Router();

const participants = [];

const requiredFields = [
    'name',
    'email',
    'phone',
    'password',
    'confirmPassword',
    'interests',
    'terms'
];

function validatePayload(body = {}) {
  for (const field of requiredFields) {
    if (
      body[field] === undefined ||
      body[field] === null ||
      body[field] === ''
    ) {
      return `${field} 為必填`;
    }
  }

  if (!/^09\d{8}$/.test(body.phone)) {
    return '手機需為09開頭10碼';
  }

  if (typeof body.password !== 'string' || body.password.length < 8) {
    return '密碼需至少8碼';
  }

  if (body.password !== body.confirmPassword) {
    return '密碼與確認密碼不一致';
  }

  if (!Array.isArray(body.interests) || body.interests.length === 0) {
    return '至少選擇一個興趣';
  }

  if (body.terms !== true) {
    return '必須同意服務條款';
  }

  return null;
}

router.get('/', (req, res) => {
  res.json({
    total: participants.length,
    data: participants
  });
});

router.get('/:id', (req, res) => {
  const found = participants.find((p) => p.id === req.params.id);
  if (!found) {
    return res.status(404).json({ error: '找不到參與者' });
  }
  res.json(found);
});

router.post('/', (req, res) => {
  const body = req.body || {};
  const errorMessage = validatePayload(body);

  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }

  const newParticipant = {
    id: nanoid(8),
    name: body.name,
    email: body.email,
    phone: body.phone,
    interests: body.interests,
    terms: body.terms,
    createdAt: new Date().toISOString()
  };

  participants.push(newParticipant);

  res.status(201).json({
    message: '報名成功',
    participant: newParticipant
  });
});

router.delete('/:id', (req, res) => {
  const index = participants.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: '找不到參與者' });
  }

  const [removed] = participants.splice(index, 1);

  res.json({
    message: '已取消報名',
    participant: removed
  });
});
