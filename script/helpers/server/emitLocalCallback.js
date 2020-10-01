const callbacks = {};

// This will listen to server event callback
RegisterNetEvent('_internal_:fromLocalServerEventCallback');
onNet('_internal_:fromLocalServerEventCallback', async (eventName, response) => {
  await callbacks[eventName](response);
});

const emitLocalCallback = async (eventName, callback, ...params) => {
  callbacks[eventName] = callback;

  emit('_internal_:fromServerEventCallback', eventName, ...params);
};

export default emitLocalCallback;
