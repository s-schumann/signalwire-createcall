const { Voice } = require('@signalwire/realtime-api');
const axios = require('axios');

const createCall = async () => {
  const client = new Voice.Client({
    project: process.env.PROJECT_ID,
    token: process.env.API_TOKEN,
    contexts: ['poc'],
  });

  try {
    const call = await client.dialPhone({
      from: process.env.PHONE_NUMBER,
      to: process.env.DESTINATION,
      timeout: 30,
    });

    console.log('The call has been answered!', call);

    let message = await call.playTTS({
      text: 'Hello! This is a test call.',
      gender: 'female',
    });

    await message.ended();

    await axios
      .get(
        'https://' +
          process.env.SIGNALWIRE_SPACE_URL +
          '/api/laml/2010-04-01/Accounts/' +
          process.env.PROJECT_ID +
          '/Calls/' +
          call.id,
        {
          auth: {
            username: process.env.PROJECT_ID,
            password: process.env.API_TOKEN,
          },
        }
      )
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});

    await call.hangup();
  } catch (error) {
    console.error(error);
  }
};

createCall();