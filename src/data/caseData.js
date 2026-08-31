// ============================================================
//  caseData.js — All static content for Case #CASE-20-YUKKU
// ============================================================

export const VAULT_CODE = '2801';

export const SUSPECT_NICKNAMES = [
  'YUKKULU',
  'AMMULU',
  'KANNAMMA',
  'BOORI BUGGALU',
  'PONGU BUGGALU',
];

export const CASE_INFO = {
  caseCode: '#CASE-20-YUKKU',
  leadAgent: 'Agent Akkulu',
  suspect: 'The Girl with the Cutest Pongu Buggalu',
  birthday: '01 September 2006',
  age: 20,
  passcode: VAULT_CODE,
};

export const STAGES = [
  {
    id: 1,
    code: 'STAGE-01',
    title: 'Biometric Suspect Scan',
    subtitle: 'Nee Muthi Analysis',
    icon: '🔬',
    description: 'Facial verification of the suspect known for her Pongu Buggalu.',
    badge: 'BIOMETRICS',
  },
  {
    id: 2,
    code: 'STAGE-02',
    title: 'Latent Print Forensics',
    subtitle: 'Entha Ishtam?',
    icon: '🧪',
    description: 'Quantitative analysis of emotional density levels.',
    badge: 'FORENSICS',
  },
  {
    id: 3,
    code: 'STAGE-03',
    title: 'Nickname Decryption Cipher',
    subtitle: 'Alias Identification',
    icon: '🔐',
    description: 'Intercepted transmissions contain suspect aliases — match them all.',
    badge: 'CRYPTOGRAPHY',
  },
  {
    id: 4,
    code: 'STAGE-04',
    title: 'Vault Access Protocol',
    subtitle: 'Case Clearance',
    icon: '🔒',
    description: 'Enter the classified vault passcode to unlock the final evidence.',
    badge: 'CLASSIFIED',
  },
];

export const EVIDENCE_CARDS = [
  {
    id: 1,
    title: 'Evidence Log #001',
    subtitle: 'Biometric Analysis Report',
    lines: [
      { label: 'Suspect ID', value: 'YUKKULU / AMMULU' },
      { label: 'Smile Threat Level', value: '🔴 CRITICAL' },
      { label: 'Cute Score', value: '∞ / 10' },
      { label: 'Pongu Buggalu Rating', value: 'Dangerously High' },
      { label: 'Status', value: '✅ VERIFIED' },
    ],
  },
  {
    id: 2,
    title: 'Evidence Log #002',
    subtitle: 'Forensic Affection Report',
    lines: [
      { label: 'Affection Level', value: '1000% — Chaala Ishtam' },
      { label: 'Emotional Density', value: 'Off the Charts' },
      { label: 'Threat Assessment', value: '💖 Heart Thief' },
      { label: 'Sample Type', value: 'Pure Love Print' },
      { label: 'Status', value: '✅ CONFIRMED' },
    ],
  },
  {
    id: 3,
    title: 'Evidence Log #003',
    subtitle: 'Alias Decryption Complete',
    lines: [
      { label: 'Primary Alias', value: 'YUKKULU' },
      { label: 'Family Alias', value: 'AMMULU / KANNAMMA' },
      { label: 'Iconic Tags', value: 'BOORI & PONGU BUGGALU' },
      { label: 'Kottesta Count', value: 'Uncountable' },
      { label: 'Status', value: '✅ ALL ALIASES MATCHED' },
    ],
  },
];

import rawLoveLetter from '../../LETTER.txt?raw';

export const LOVE_LETTER = rawLoveLetter;

export const MEMORY_WALL_CAPTIONS = {
  left:   'My favourite smile in the whole world 💕',
  right:  'Cutest suspect ever caught on camera 📸',
  puzzle: 'Us. My most treasured evidence. 💑',
};

export const GALLERY_PHOTOS = [
  { src: '/assets/At Bowling Alley.jpeg', label: 'At Bowling Alley' },
  { src: '/assets/Face Time -2.jpeg', label: 'Our Face time' },
  { src: '/assets/Face Time -3.jpeg', label: 'Our Face time' },
  { src: '/assets/Face Time -4.jpeg', label: 'Our Face time' },
  { src: '/assets/Face Time -5.jpeg', label: 'Our Face time' },
  { src: '/assets/Face Time.jpeg', label: 'Our Face time' },
  { src: '/assets/Me After Our 1st Meet.jpeg', label: 'Me After Our 1st Meet' },
  { src: '/assets/My First treat to her.jpeg', label: 'My First treat to her (where Subway became "Me"!)' },
  { src: '/assets/Our 2nd Date.jpeg', label: 'Our 2nd Date' },
  { src: '/assets/Our First Watch Along.jpeg', label: 'Our First Watch Along' },
];

export const ART_US_PHOTOS = [
  { src: '/assets/ArtUs_1_Yukku and Akku.jpeg',         label: 'Yukku and Akku 💑' },
  { src: '/assets/ArtUs_2_Our Play Along.jpeg',         label: 'Our Play Along 🎮' },
  { src: '/assets/ArtUs_3_Reel Watch Along.jpeg',       label: 'Reel Watch Along 🎬' },
  { src: '/assets/ArtUs_4_Our Journal.jpeg',            label: 'Our Journal 📓' },
  { src: '/assets/ArtUs_5_Our Journal - 2.jpeg',        label: 'Our Journal — Page 2 📓' },
];

export const WORDS_FOR_YU = [
  { src: '/assets/Words_1_Wholesome.jpeg',                              label: 'Wholesome 🌸', type: 'image' },
  { src: '/assets/Words_2_Vitamin U.mp4',                               label: 'Vitamin U 💊', type: 'video' },
  { src: '/assets/Words_3_No Choice.mp4',                               label: 'No Choice 💕', type: 'video' },
  { src: '/assets/Words_4_Everything is Better With You.mp4',          label: 'Everything is Better With You 🌟', type: 'video' },
  { src: '/assets/Words_5_My Conclusion.mp4',                          label: 'My Conclusion 💖', type: 'video' },
];
