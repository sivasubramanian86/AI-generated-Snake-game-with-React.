import { Track, Difficulty } from './types';

// Using consistent soundhelix links for reliable demo audio
export const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neural Network Beats",
    artist: "AI Composer Alpha",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/id/1/200/200"
  },
  {
    id: 2,
    title: "Synthwave Dreams",
    artist: "Cybernetic Orchestra",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    cover: "https://picsum.photos/id/2/200/200"
  },
  {
    id: 3,
    title: "Algorithmic Soul",
    artist: "Deep Learning Unit 7",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/id/3/200/200"
  }
];

export const GRID_SIZE = 20;
export const CELL_SIZE = 20; // Size in pixels
export const CANVAS_SIZE = GRID_SIZE * CELL_SIZE; // 400px

export const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: { label: 'EASY', speed: 400, length: 3, increment: 1 },
  [Difficulty.MEDIUM]: { label: 'MEDIUM', speed: 130, length: 5, increment: 2 },
  [Difficulty.HARD]: { label: 'HARD', speed: 80, length: 8, increment: 4 },
};

export const INITIAL_SPEED = 150; // Fallback
export const SPEED_INCREMENT = 2; // Fallback