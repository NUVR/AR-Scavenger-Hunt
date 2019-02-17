import { Object3D } from 'three';

export interface SceneMapper {
  ASSET_URL: string;
  loadModel(): Promise<Object3D>;
  hasModel(): boolean;
  getModel(): Object3D;
  update?(delta: number): void;
}

type NumberPatterns =
  | 'One'
  | 'Two'
  | 'Three'
  | 'Four'
  | 'Five'
  | 'Six'
  | 'Seven'
  | 'Eight'
  | 'Nine'
  | 'Ten'
  | 'Eleven'
  | 'Twelve';
type LetterPatterns = 'A' | 'B';
type DefaultPatterns = 'hiro' | 'kanji';
type CustomPatterns = 'NUvr' | 'Train';

type Patterns = NumberPatterns | LetterPatterns | DefaultPatterns | CustomPatterns;
