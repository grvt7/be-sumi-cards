import { Router } from 'express';
import { ApiResponse } from '@/utils/ApiResponse';

const router = Router();

// Kana data (static - could be moved to a separate file)
const hiraganaData = [
  { romaji: 'a', kana: 'あ', type: 'hiragana' },
  { romaji: 'i', kana: 'い', type: 'hiragana' },
  { romaji: 'u', kana: 'う', type: 'hiragana' },
  { romaji: 'e', kana: 'え', type: 'hiragana' },
  { romaji: 'o', kana: 'お', type: 'hiragana' },
  { romaji: 'ka', kana: 'か', type: 'hiragana' },
  { romaji: 'ki', kana: 'き', type: 'hiragana' },
  { romaji: 'ku', kana: 'く', type: 'hiragana' },
  { romaji: 'ke', kana: 'け', type: 'hiragana' },
  { romaji: 'ko', kana: 'こ', type: 'hiragana' },
  { romaji: 'sa', kana: 'さ', type: 'hiragana' },
  { romaji: 'shi', kana: 'し', type: 'hiragana' },
  { romaji: 'su', kana: 'す', type: 'hiragana' },
  { romaji: 'se', kana: 'せ', type: 'hiragana' },
  { romaji: 'so', kana: 'そ', type: 'hiragana' },
  { romaji: 'ta', kana: 'た', type: 'hiragana' },
  { romaji: 'chi', kana: 'ち', type: 'hiragana' },
  { romaji: 'tsu', kana: 'つ', type: 'hiragana' },
  { romaji: 'te', kana: 'て', type: 'hiragana' },
  { romaji: 'to', kana: 'と', type: 'hiragana' },
  { romaji: 'na', kana: 'な', type: 'hiragana' },
  { romaji: 'ni', kana: 'に', type: 'hiragana' },
  { romaji: 'nu', kana: 'ぬ', type: 'hiragana' },
  { romaji: 'ne', kana: 'ね', type: 'hiragana' },
  { romaji: 'no', kana: 'の', type: 'hiragana' },
  { romaji: 'ha', kana: 'は', type: 'hiragana' },
  { romaji: 'hi', kana: 'ひ', type: 'hiragana' },
  { romaji: 'fu', kana: 'ふ', type: 'hiragana' },
  { romaji: 'he', kana: 'へ', type: 'hiragana' },
  { romaji: 'ho', kana: 'ほ', type: 'hiragana' },
  { romaji: 'ma', kana: 'ま', type: 'hiragana' },
  { romaji: 'mi', kana: 'み', type: 'hiragana' },
  { romaji: 'mu', kana: 'む', type: 'hiragana' },
  { romaji: 'me', kana: 'め', type: 'hiragana' },
  { romaji: 'mo', kana: 'も', type: 'hiragana' },
  { romaji: 'ya', kana: 'や', type: 'hiragana' },
  { romaji: 'yu', kana: 'ゆ', type: 'hiragana' },
  { romaji: 'yo', kana: 'よ', type: 'hiragana' },
  { romaji: 'ra', kana: 'ら', type: 'hiragana' },
  { romaji: 'ri', kana: 'り', type: 'hiragana' },
  { romaji: 'ru', kana: 'る', type: 'hiragana' },
  { romaji: 're', kana: 'れ', type: 'hiragana' },
  { romaji: 'ro', kana: 'ろ', type: 'hiragana' },
  { romaji: 'wa', kana: 'わ', type: 'hiragana' },
  { romaji: 'wo', kana: 'を', type: 'hiragana' },
  { romaji: 'n', kana: 'ん', type: 'hiragana' },
];

const katakanaData = [
  { romaji: 'a', kana: 'ア', type: 'katakana' },
  { romaji: 'i', kana: 'イ', type: 'katakana' },
  { romaji: 'u', kana: 'ウ', type: 'katakana' },
  { romaji: 'e', kana: 'エ', type: 'katakana' },
  { romaji: 'o', kana: 'オ', type: 'katakana' },
  { romaji: 'ka', kana: 'カ', type: 'katakana' },
  { romaji: 'ki', kana: 'キ', type: 'katakana' },
  { romaji: 'ku', kana: 'ク', type: 'katakana' },
  { romaji: 'ke', kana: 'ケ', type: 'katakana' },
  { romaji: 'ko', kana: 'コ', type: 'katakana' },
  { romaji: 'sa', kana: 'サ', type: 'katakana' },
  { romaji: 'shi', kana: 'シ', type: 'katakana' },
  { romaji: 'su', kana: 'ス', type: 'katakana' },
  { romaji: 'se', kana: 'セ', type: 'katakana' },
  { romaji: 'so', kana: 'ソ', type: 'katakana' },
  { romaji: 'ta', kana: 'タ', type: 'katakana' },
  { romaji: 'chi', kana: 'チ', type: 'katakana' },
  { romaji: 'tsu', kana: 'ツ', type: 'katakana' },
  { romaji: 'te', kana: 'テ', type: 'katakana' },
  { romaji: 'to', kana: 'ト', type: 'katakana' },
  { romaji: 'na', kana: 'ナ', type: 'katakana' },
  { romaji: 'ni', kana: 'ニ', type: 'katakana' },
  { romaji: 'nu', kana: 'ヌ', type: 'katakana' },
  { romaji: 'ne', kana: 'ネ', type: 'katakana' },
  { romaji: 'no', kana: 'ノ', type: 'katakana' },
  { romaji: 'ha', kana: 'ハ', type: 'katakana' },
  { romaji: 'hi', kana: 'ヒ', type: 'katakana' },
  { romaji: 'fu', kana: 'フ', type: 'katakana' },
  { romaji: 'he', kana: 'ヘ', type: 'katakana' },
  { romaji: 'ho', kana: 'ホ', type: 'katakana' },
  { romaji: 'ma', kana: 'マ', type: 'katakana' },
  { romaji: 'mi', kana: 'ミ', type: 'katakana' },
  { romaji: 'mu', kana: 'ム', type: 'katakana' },
  { romaji: 'me', kana: 'メ', type: 'katakana' },
  { romaji: 'mo', kana: 'モ', type: 'katakana' },
  { romaji: 'ya', kana: 'ヤ', type: 'katakana' },
  { romaji: 'yu', kana: 'ユ', type: 'katakana' },
  { romaji: 'yo', kana: 'ヨ', type: 'katakana' },
  { romaji: 'ra', kana: 'ラ', type: 'katakana' },
  { romaji: 'ri', kana: 'リ', type: 'katakana' },
  { romaji: 'ru', kana: 'ル', type: 'katakana' },
  { romaji: 're', kana: 'レ', type: 'katakana' },
  { romaji: 'ro', kana: 'ロ', type: 'katakana' },
  { romaji: 'wa', kana: 'ワ', type: 'katakana' },
  { romaji: 'wo', kana: 'ヲ', type: 'katakana' },
  { romaji: 'n', kana: 'ン', type: 'katakana' },
];

// Sample vocabulary data
const vocabularyData = [
  {
    id: 1,
    japanese: 'こんにちは',
    romaji: 'konnichiwa',
    english: 'hello',
    category: 'greetings',
    jlptLevel: 'N5',
  },
  {
    id: 2,
    japanese: 'ありがとう',
    romaji: 'arigatou',
    english: 'thank you',
    category: 'greetings',
    jlptLevel: 'N5',
  },
  {
    id: 3,
    japanese: '水',
    romaji: 'mizu',
    english: 'water',
    category: 'nouns',
    jlptLevel: 'N5',
  },
  {
    id: 4,
    japanese: '食べる',
    romaji: 'taberu',
    english: 'to eat',
    category: 'verbs',
    jlptLevel: 'N5',
  },
  {
    id: 5,
    japanese: '学校',
    romaji: 'gakkou',
    english: 'school',
    category: 'nouns',
    jlptLevel: 'N5',
  },
];

/**
 * @route   GET /api/v1/data/kana/hiragana
 * @desc    Get hiragana data
 * @access  Public
 */
router.get('/kana/hiragana', (_req, res) => {
  res.status(200).json(
    new ApiResponse(200, hiraganaData, 'Hiragana data retrieved successfully')
  );
});

/**
 * @route   GET /api/v1/data/kana/katakana
 * @desc    Get katakana data
 * @access  Public
 */
router.get('/kana/katakana', (_req, res) => {
  res.status(200).json(
    new ApiResponse(200, katakanaData, 'Katakana data retrieved successfully')
  );
});

/**
 * @route   GET /api/v1/data/kana
 * @desc    Get all kana data
 * @access  Public
 */
router.get('/kana', (_req, res) => {
  const allKana = [...hiraganaData, ...katakanaData];
  res.status(200).json(
    new ApiResponse(200, allKana, 'All kana data retrieved successfully')
  );
});

/**
 * @route   GET /api/v1/data/vocabulary
 * @desc    Get vocabulary data
 * @access  Public
 * @query   category? - Filter by category
 * @query   jlptLevel? - Filter by JLPT level
 */
router.get('/vocabulary', (req, res) => {
  const { category, jlptLevel } = req.query;
  
  let filteredVocab = vocabularyData;
  
  if (category) {
    filteredVocab = filteredVocab.filter(v => v.category === category);
  }
  
  if (jlptLevel) {
    filteredVocab = filteredVocab.filter(v => v.jlptLevel === jlptLevel);
  }
  
  res.status(200).json(
    new ApiResponse(200, filteredVocab, 'Vocabulary data retrieved successfully')
  );
});

/**
 * @route   GET /api/v1/data/vocabulary/categories
 * @desc    Get vocabulary categories
 * @access  Public
 */
router.get('/vocabulary/categories', (_req, res) => {
  const categories = [...new Set(vocabularyData.map(v => v.category))];
  const levels = [...new Set(vocabularyData.map(v => v.jlptLevel))];
  
  res.status(200).json(
    new ApiResponse(200, { categories, levels }, 'Vocabulary categories and levels retrieved successfully')
  );
});

export default router;
