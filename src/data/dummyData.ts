// src/data/dummyData.ts

export interface User {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  online: boolean;
}

export interface Message {
  id: number;
  text: string;
  timestamp: string;
  sender: 'me' | number; // 'me' for my messages, user.id for theirs
}

export interface ProfileInfo {
  id: number;
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  media: string[];
}

export const users: User[] = [
  { id: 1, name: 'James William', avatar: 'https://i.pravatar.cc/150?u=james', lastMessage: 'Looking forward to hearing from you.', timestamp: '07:30', online: true },
  { id: 2, name: 'Aura Paisley', avatar: 'https://i.pravatar.cc/150?u=aura', lastMessage: 'Sure, you’re welcome. If there’s..', timestamp: '07:15', online: false },
  { id: 3, name: 'Mia Sophia', avatar: 'https://i.pravatar.cc/150?u=mia', lastMessage: 'I was a speaker at a conference.', timestamp: 'yesterday', online: true },
  { id: 4, name: 'Lucas Benjamin', avatar: 'https://i.pravatar.cc/150?u=lucas', lastMessage: 'Let me know if you have any of...', timestamp: '1d', online: false },
  { id: 5, name: 'David Ezkiel', avatar: 'https://i.pravatar.cc/150?u=david', lastMessage: 'I will not be needing you full-time..', timestamp: '2d', online: true },
];

export const messages: { [key: number]: Message[] } = {
  1: [
    { id: 1, text: 'Hello James, Nice to meet you.', sender: 1, timestamp: '10:00' },
    { id: 2, text: 'Following up from your previous email on Nata Job. Is there anything that needs help about Nata?', sender: 1, timestamp: '10:01' },
    { id: 3, text: 'Hello Barly, Nice to meet you too. Sorry for the delay. I was a speaker at a conference and this took my full attention lately.', sender: 'me', timestamp: '10:05' },
    { id: 4, text: 'Oh, it’s ok. If you need help with Nata Job, don’t hesitate to touch me. Looking forward to hearing from you!', sender: 1, timestamp: '10:06' },
  ],
  2: [
     { id: 1, text: 'Hi Aura, are you available for a quick call?', sender: 'me', timestamp: '07:10' },
     { id: 2, text: 'Sure, you’re welcome. If there’s anything else, just let me know!', sender: 2, timestamp: '07:15' },
  ],
  // Add more messages for other users if needed
};

export const profileInfos: { [key: number]: ProfileInfo } = {
  1: {
    id: 1,
    name: 'James William',
    title: 'Lead UI/UX Designer',
    location: 'San Francisco, CA',
    phone: '+1 (415) 872-1329',
    email: 'hello@james.com',
    media: ['https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=2', 'https://i.pravatar.cc/150?img=3'],
  },
   2: {
    id: 2,
    name: 'Aura Paisley',
    title: 'Frontend Developer',
    location: 'New York, NY',
    phone: '+1 (212) 555-0182',
    email: 'aura.p@example.com',
    media: ['https://i.pravatar.cc/150?img=4', 'https://i.pravatar.cc/150?img=5'],
  },
  // Add more profiles for other users
};