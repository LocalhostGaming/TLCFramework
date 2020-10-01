const getPlayerFivemId = async (playerSource, type = 'discord') => {
  let discordIdentifier;

  const playerIdentifierCount = GetNumPlayerIdentifiers(playerSource);

  // loop all player identifiers
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < playerIdentifierCount; i++) {
    const playerIdentifier = GetPlayerIdentifier(playerSource, i);
    // Get discord identifier
    if (playerIdentifier.includes(`${type}:`)) {
      const [, identifier] = playerIdentifier.split(':');

      discordIdentifier = identifier;
    }
  }

  return discordIdentifier;
};

export default getPlayerFivemId;
