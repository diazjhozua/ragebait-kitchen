const GIF_TIERS = {
  mild: [
    'Bcpspr9LTSvss',
    '7ILfGZFvTPMB1TAkXE',
    'SSWqRoTCJJcSMrqtyD',
    '26AHMg3t0Tgt569fW',
    'KAe0nKHLZod644jize',
    '26DNj0EL08J6pTbTG',
    'RJIzhZQGfKZ2VzpjVX',
    'iE34Yaj3zHtVnEtq7c',
    'd96sDMsc3pRbrn13mZ',
    'j8TqCNLk6BIwtETx2x',
    '3o6ZsU5vAb0r9d1UYM',
    'okFDq1MPeU2UE',
  ],
  frustrated: [
    'l3V0H7bYv5Ml5TOfu',
    '5WksjArWZT7jnT801G',
    'wHZ5DnLzR5j0YGagH6',
    '5xtDarDewDfNyPrYSbe',
    'WcC0nE2ZoNoW2mE52K',
    '3oEjI67Egb8G9jqs3m',
    'l3V0Bxyy2PorRcNWw',
    'l0HUnirvda45xWroA',
    'sQQTpNAbQGztGoMPug',
    'ZdO8fWTGR0ym8w2ICk',
    '1cVGbGVJvCaDn3PgkA',
    '3o7abFcKeGeShjBNbG',
  ],
  yelling: [
    '1o1ocENZYS9mrU5ich',
    '26BoEuSlTXdkc9aWk',
    'fstSEyiu9q9AacpoGV',
    'kgZiCWgSCfklO0XU8p',
    'Nmh41I1Ef3vOXiaTaZ',
    'l3V0gnmiNvCNz85Wg',
    'XBu2bPe96lUeJuQakb',
    'fvZXvd2351EhpLTv7R',
    'LkOEUR98VcNZVpZ7Dn',
    '2AMd7RhHBk6KzVJUEy',
    'VG2OzjYkBLK9vGf3UH',
    'iDm3wGFSm53tIEvvtN',
  ],
  nuclear: [
    'MnpPCugwALAHsTygpd',
    'LgFYmux1Tarq8',
    'we4Hp4J3n7riw',
    '103t71VKmtY1UY',
    'qEfGLWRq9LokP6cBeX',
    'xT0BKBOzy7ASIA82ZO',
    '3o6ZtrtmTYvdJaAwg0',
    '8F9bRREbwTXTHjSFCH',
    'w8DBZcITFIl0TpCPGe',
    '7JI6TYAP3P8ZktUvFf',
    'OT51z4VsxVeqXMSXhM',
    'NkPitwsmPx2eXVDQ8F',
  ],
};

export function getGifForScore(score: number): string {
  const tier =
    score >= 86 ? GIF_TIERS.nuclear :
    score >= 61 ? GIF_TIERS.yelling :
    score >= 31 ? GIF_TIERS.frustrated :
                  GIF_TIERS.mild;
  return tier[Math.floor(Math.random() * tier.length)];
}

export function getGifUrl(id: string): string {
  return `https://media.giphy.com/media/${id}/giphy.gif`;
}
