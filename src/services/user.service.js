const { v4: uuidv4 } = require('uuid');
const { findUserByEmail, createUser } = require('../models/user.model');

async function findOrCreateUserByGoogle({ email, name, googleId }) {
  let user = await findUserByEmail(email);

  if (!user) {
    const newUser = {
      id: uuidv4(),
      firstName: name.split(' ')[0] || '',
      lastName: name.split(' ')[1] || '',
      name,
      email,
      password: null,
      role: 'user',
      provider: 'google',
      googleId,
    };

    user = await createUser(newUser);
  }

  return user;
}

module.exports = { findOrCreateUserByGoogle };
