const callbacks = {};

// This will listen to server event callback
RegisterNetEvent('_internal_:fromServerEventCallback');
onNet('_internal_:fromServerEventCallback', async (eventName, response) => {
  await callbacks[eventName](response);
});

const emitNetCallback = async (eventName, callback, ...params) => {
  callbacks[eventName] = callback;

  emitNet('_internal_:fromClientEventCallback', eventName, ...params);
};

export default emitNetCallback;
