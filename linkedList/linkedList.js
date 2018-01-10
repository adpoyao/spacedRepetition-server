'use strict';

const _find = (linkedList, index) => {
  let node = linkedList.head;
  for (let i = 0; i < index; i++) {
    node = node.next;
  }
  return node;
};

// Retrieve from list
const retrieve = (linkedList, index) => {
  if (index < 0 || index >= linkedList.length) {
    throw new Error('Index Error');
  }
  const node = _find(linkedList, index);
  return node.value;
};

//Remove from list
const remove = (linkedList, index) => {
  if (index < 0 || index >= linkedList.length) {
    throw new Error('Index Error');
  }
  if(index === 0){
    linkedList.head = linkedList.head.next;
  }
  else {
    let before = linkedList._find(linkedList, index - 1);
    before.next = before.next.next;
  }
  linkedList.length--;
};

// Insert to list
const insert = (linkedList, index, value) => {
  if (index < 0 || index > linkedList.length) {
    throw new Error('Index Error');
  }
  const newNode = {value};
  if (index === 0) {
    newNode.next = linkedList.head;
    linkedList.head = newNode;
  }
  else {
    let before = _find(linkedList, index-1);
    newNode.next = before.next;
    before.next = newNode;
  }
  linkedList.length++;
};

// Display list
function display(linkedList){
  let currNode = linkedList.head;
  if(!currNode){
    return 'List is Empty';
  }
  while (!(currNode.next === null)) {
    console.log(currNode.value);
    currNode = currNode.next;
  }
  console.log(currNode.value);
}

// Return size of list
function size(linkedList){
  let counter = 0;
  let currNode = linkedList.head;
  if(!currNode){
    return counter;
  }
  else
    counter++;
  while (!(currNode.next === null)) {
    counter++;
    currNode = currNode.next;
  }
  return counter;
}

module.exports = { retrieve, remove, insert, display, size };

// Tests
const test = {
  'length': 10,
  'head': {
    'value': {
      '_id': '5a5511dc734d1d2d83df15e9',
      'vocab': '今日',
      'hiragana': 'きょう',
      'katakana': 'キョウ',
      'romaji': 'kyou',
      'example': '今日は何したの?',
      'correct': 'today'
    },
    'next': {
      'value': {
        '_id': '5a5516dd734d1d2d83df1883',
        'vocab': '金曜日',
        'hiragana': 'きんようび',
        'katakana': 'コンヨウビ',
        'romaji': 'kin\'youbi',
        'example': 'やっと金曜日ですよ。',
        'correct': 'friday'
      },
      'next': {
        'value': {
          '_id': '5a551757734d1d2d83df18c3',
          'vocab': '好き',
          'hiragana': 'すき',
          'katakana': 'スキ',
          'romaji': 'suki',
          'example': 'リンゴが好きじゃない',
          'correct': 'like'
        },
        'next': {
          'value': {
            '_id': '5a5517d2734d1d2d83df18dc',
            'vocab': '音楽',
            'hiragana': 'おんがく',
            'katakana': 'オンガク',
            'romaji': 'ongaku',
            'example': '音楽を聴きます。',
            'correct': 'music'
          },
          'next': {
            'value': {
              '_id': '5a55186d734d1d2d83df18f5',
              'vocab': '嬉しい',
              'hiragana': 'うれしい',
              'katakana': 'ウレシイ',
              'romaji': 'ureshii',
              'example': '君がここにいて嬉しいよ。',
              'correct': 'happy'
            },
            'next': {
              'value': {
                '_id': '5a5518f5734d1d2d83df1992',
                'vocab': '夏',
                'hiragana': 'なつ',
                'katakana': 'ナツ',
                'romaji': 'natsu',
                'example': '夏が一番好きだと思います。',
                'correct': 'summer'
              },
              'next': {
                'value': {
                  '_id': '5a5519be734d1d2d83df1a0c',
                  'vocab': '携帯',
                  'hiragana': 'けいたい',
                  'katakana': 'ケイタイ',
                  'romaji': 'keitai',
                  'example': 'あ、携帯を忘れちゃった。',
                  'correct': 'cell phone'
                },
                'next': {
                  'value': {
                    '_id': '5a551a6f734d1d2d83df1a45',
                    'vocab': '読む',
                    'hiragana': 'よむ',
                    'katakana': 'ヨム',
                    'romaji': 'yomu',
                    'example': '彼は毎日小説を読む。',
                    'correct': 'read'
                  },
                  'next': {
                    'value': {
                      '_id': '5a551b25734d1d2d83df1a7e',
                      'vocab': '猫',
                      'hiragana': 'ねこ',
                      'katakana': 'ネコ',
                      'romaji': 'neko',
                      'example': '猫は夜目が利く。',
                      'correct': 'cat'
                    },
                    'next': {
                      'value': {
                        '_id': '5a551ba2734d1d2d83df1ab2',
                        'vocab': '美味しい',
                        'hiragana': 'おいしい',
                        'katakana': 'オイシイ',
                        'romaji': 'oishii',
                        'example': 'これは美味しいケーキです。',
                        'correct': 'tasty'
                      },
                      'next': null
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// Simple question retrieval
// console.log(retrieve(test,0));
// console.log(retrieve(test,1));
// console.log(retrieve(test,2));

// Remove question to and place to Nth place
let answeredQuestion = retrieve(test, 0);
remove(test, 0);
insert(test, test.length, answeredQuestion);
// display(test);
