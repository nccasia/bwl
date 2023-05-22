const getEmojis = async(token) => {
    const response = await fetch(`https://discord.com/api/v9/guilds/921239248991055882/emojis`, {
      headers: {
        Authorization: `Bot ${token}`,
      },
    });
    if (response.ok) {
      const emojis = await response.json();
      console.log(emojis);
    } else {
      console.error('Failed to retrieve emojis:', response.status, response.statusText);
    }
  }