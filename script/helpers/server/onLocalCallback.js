const callbacks = {};

// This will listen from client emitted event
RegisterNetEvent('_internal_:fromServerEventCallback');
onNet('_internal_:fromServerEventCallback', async (eventName, ...params) => {
  try {
    if (callbacks[eventName]) {
      callbacks[eventName].forEach(async (callback) => {
        const response = await callback(...params);
        emit('_internal_:fromLocalServerEventCallback', eventName, response);
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.message);
  }
});

const onLocalCallback = async (eventName, callback) => {
  if (!(eventName in callbacks)) {
    callbacks[eventName] = [];
  }

  callbacks[eventName].push(callback);
};

export default onLocalCallback;
