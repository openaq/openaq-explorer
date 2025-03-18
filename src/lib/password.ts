import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import zxcvbnEnPackage from '@zxcvbn-ts/language-en';

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};

zxcvbnOptions.setOptions(options);

export function evaluatePassword(password: string) {
  return zxcvbn(password);
}

export function validatePassword(password: string, passwordConfirm: string) {
  'use server';
  let errors: Error[] = [];
  if (password.length < 8) {
    errors.push(new Error('Passwords must be at least 8 characters long'));
  }
  const result = evaluatePassword(password);
  if (result.score < 4) {
    errors.push(
      new Error('Passwords not strong enough, please choose a strong password')
    );
  }
  if (password !== passwordConfirm) {
    errors.push(new Error('Passwords must match'));
  }
  if (errors.length > 0) {
    throw new AggregateError((errors = errors), 'Password errors');
  }
}
