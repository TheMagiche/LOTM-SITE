export interface SitePathway {
  id: string;
  name: string;
  tarotCard: string;
  tarotNumber: string;
  sequenceNine: string;
  sequenceZero: string;
  emblemSrc: string;
}

export const SITE_PATHWAYS: SitePathway[] = [
  { id: 'fool', name: 'Fool', tarotCard: 'The Fool', tarotNumber: '0', sequenceNine: 'Seer', sequenceZero: 'Fool', emblemSrc: '/pathways/fool.webp' },
  { id: 'door', name: 'Door', tarotCard: 'The Magician', tarotNumber: 'I', sequenceNine: 'Apprentice', sequenceZero: 'Door', emblemSrc: '/pathways/door.webp' },
  { id: 'paragon', name: 'Paragon', tarotCard: 'The High Priestess', tarotNumber: 'II', sequenceNine: 'Savant', sequenceZero: 'Paragon', emblemSrc: '/pathways/paragon.webp' },
  { id: 'demoness', name: 'Demoness', tarotCard: 'The Empress', tarotNumber: 'III', sequenceNine: 'Assassin', sequenceZero: 'Demoness', emblemSrc: '/pathways/demoness.webp' },
  { id: 'black_emperor', name: 'Black Emperor', tarotCard: 'The Emperor', tarotNumber: 'IV', sequenceNine: 'Lawyer', sequenceZero: 'Black Emperor', emblemSrc: '/pathways/black_emperor.webp' },
  { id: 'tyrant', name: 'Tyrant', tarotCard: 'The Hierophant', tarotNumber: 'V', sequenceNine: 'Sailor', sequenceZero: 'Tyrant', emblemSrc: '/pathways/tyrant.webp' },
  { id: 'error', name: 'Error', tarotCard: 'The Lovers', tarotNumber: 'VI', sequenceNine: 'Marauder', sequenceZero: 'Error', emblemSrc: '/pathways/error.webp' },
  { id: 'red_priest', name: 'Red Priest', tarotCard: 'The Chariot', tarotNumber: 'VII', sequenceNine: 'Hunter', sequenceZero: 'Red Priest', emblemSrc: '/pathways/red_priest.webp' },
  { id: 'visionary', name: 'Visionary', tarotCard: 'Justice', tarotNumber: 'VIII', sequenceNine: 'Spectator', sequenceZero: 'Visionary', emblemSrc: '/pathways/visionary.webp' },
  { id: 'hermit', name: 'Hermit', tarotCard: 'The Hermit', tarotNumber: 'IX', sequenceNine: 'Mystery Pryer', sequenceZero: 'Hermit', emblemSrc: '/pathways/hermit.webp' },
  { id: 'wheel_of_fortune', name: 'Wheel of Fortune', tarotCard: 'Wheel of Fortune', tarotNumber: 'X', sequenceNine: 'Monster', sequenceZero: 'Wheel of Fortune', emblemSrc: '/pathways/wheel_of_fortune.webp' },
  { id: 'twilight_giant', name: 'Twilight Giant', tarotCard: 'Strength', tarotNumber: 'XI', sequenceNine: 'Warrior', sequenceZero: 'Twilight Giant', emblemSrc: '/pathways/twilight_giant.webp' },
  { id: 'hanged_man', name: 'Hanged Man', tarotCard: 'The Hanged Man', tarotNumber: 'XII', sequenceNine: 'Secrets Suppliant', sequenceZero: 'Hanged Man', emblemSrc: '/pathways/hanged_man.webp' },
  { id: 'death', name: 'Death', tarotCard: 'Death', tarotNumber: 'XIII', sequenceNine: 'Corpse Collector', sequenceZero: 'Death', emblemSrc: '/pathways/death.webp' },
  { id: 'chained', name: 'Chained', tarotCard: 'Temperance', tarotNumber: 'XIV', sequenceNine: 'Prisoner', sequenceZero: 'Chained', emblemSrc: '/pathways/chained.webp' },
  { id: 'abyss', name: 'Abyss', tarotCard: 'The Devil', tarotNumber: 'XV', sequenceNine: 'Criminal', sequenceZero: 'Abyss', emblemSrc: '/pathways/abyss.webp' },
  { id: 'white_tower', name: 'White Tower', tarotCard: 'The Tower', tarotNumber: 'XVI', sequenceNine: 'Reader', sequenceZero: 'White Tower', emblemSrc: '/pathways/white_tower.webp' },
  { id: 'darkness', name: 'Darkness', tarotCard: 'The Star', tarotNumber: 'XVII', sequenceNine: 'Sleepless', sequenceZero: 'Darkness', emblemSrc: '/pathways/darkness.webp' },
  { id: 'moon', name: 'Moon', tarotCard: 'The Moon', tarotNumber: 'XVIII', sequenceNine: 'Apothecary', sequenceZero: 'Moon', emblemSrc: '/pathways/moon.webp' },
  { id: 'sun', name: 'Sun', tarotCard: 'The Sun', tarotNumber: 'XIX', sequenceNine: 'Bard', sequenceZero: 'Sun', emblemSrc: '/pathways/sun.webp' },
  { id: 'justiciar', name: 'Justiciar', tarotCard: 'Judgment', tarotNumber: 'XX', sequenceNine: 'Arbiter', sequenceZero: 'Justiciar', emblemSrc: '/pathways/justiciar.webp' },
  { id: 'mother', name: 'Mother', tarotCard: 'The World', tarotNumber: 'XXI', sequenceNine: 'Planter', sequenceZero: 'Mother', emblemSrc: '/pathways/mother.webp' },
];
