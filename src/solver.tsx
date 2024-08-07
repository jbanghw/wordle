import { allWords } from "./words";

export async function solve(guesses: string[], guessesColors: string[]) {
  // possible letters for each index of the solution word + must-include letters
  const letters: string[] = [
    'abcdefghijklmnopqrstuvwxyz',
    'abcdefghijklmnopqrstuvwxyz',
    'abcdefghijklmnopqrstuvwxyz',
    'abcdefghijklmnopqrstuvwxyz',
    'abcdefghijklmnopqrstuvwxyz',
    ''
  ];
  // maximum occurence of each letter in the alphabet (5 by default)
  const maxLetterCount: any = {};
  for (let i = 0; i < 26; i++) {
    maxLetterCount[letters[0][i]] = 5;
  }

  // adjust possible letters based on board state
  for (let i = 0; i < guesses.length; i++) {
    for (let j = 0; j < 5; j++) {
      const currLetter = guesses[i][j];

      // correct guess (green)
      if (guessesColors[i][j] === 'g') {
        letters[j] = currLetter;
        letters[5] += currLetter;
      // semi-correct guess (yellow)
      } else if (guessesColors[i][j] === 'y') {
        letters[j] = letters[j].replace(currLetter, '');
        letters[5] += currLetter;
      // wrong guess (gray)
      } else if (guessesColors[i][j] === 'w') {
        // a square could be gray while still being in the result word (multiple occurences in the guess)
        // then the max count of that letter is the number of non-gray square of of that letter
        let containsCount = 0;
        for (let k = 0; k < 5; k++) {
          if (guesses[i][k] === currLetter && guessesColors[i][k] !== 'w') {
            containsCount += 1;
          }
        }
        maxLetterCount[currLetter] = containsCount;

        // remove currLetter from all positions if the letter doesn't exist in the result word at all
        if (containsCount === 0) {
          for (let k = 0; k < 5; k++) {
            letters[k] = letters[k].replace(currLetter, '');
          }
        } else {
          letters[j] = letters[j].replace(currLetter, '');
        }
      }
    }
  }

  const res: string[] = [];

  // iterate all possible words and filter impossible words
  for (let word of allWords) {
    let possible = true;

    // check each letter
    for (let i = 0; i < 5; i++) {
      if (!letters[i].includes(word[i])) {
        possible = false;
        break;
      }
    }

    // check must-contain letters
    if (possible) {
      for (let chr of letters[5]) {
        if (!word.includes(chr)) {
          possible = false;
          break;
        }
      }
    }

    // check duplicate letters
    if (possible) {
      const currWordCountedLetters: any = {};
      for (let chr of word) {
        currWordCountedLetters[chr] = (currWordCountedLetters[chr] ?? 0) + 1;
      }
      for (let chr in currWordCountedLetters) {
        if ((maxLetterCount[chr] ?? 5) < currWordCountedLetters[chr]) {
          possible = false;
          break;
        }
      }
    }

    // add to result
    if (possible) {
      res.push(word);
    }
  }

  return JSON.stringify(res);
}