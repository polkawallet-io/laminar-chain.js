// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { TypeRegistry } from '@polkadot/types';
import { createTypeUnsafe } from '@polkadot/types/create';
import { u8aToU8a } from '@polkadot/util';
import Metadata from '@polkadot/metadata/Decorated';
import { types } from '../index';
import metadataRaw from '../metadata/static-latest';

describe('Leverages', (): void => {
  const registry = new TypeRegistry();
  registry.register(types);

  new Metadata(registry, metadataRaw);

  const Leverages: any = registry.get('Leverages');

  it('constructs via an string[]', (): void => {
    const leverages = new Leverages(registry, ['LongTwo', 'ShortTwenty']);

    expect(leverages.isEmpty).toEqual(false);
    expect(leverages.toString()).toEqual('[LongTwo, ShortTwenty]');
  });

  it('throws with invalid values', (): void => {
    expect(() => new Leverages(registry, ['LongTwo', 'LongThree', 'invalid'])).toThrow(/Invalid key 'invalid'/);
  });

  it('throws with add on invalid', (): void => {
    expect(() => new Leverages(registry, []).add('invalid')).toThrow(/Invalid key 'invalid'/);
  });

  it('allows construction via number', (): void => {
    expect(new Leverages(registry, 16399).eq(['LongTwo', 'LongThree', 'LongFive', 'LongTen', 'ShortFifty'])).toBe(true);
  });

  it('does not allow invalid number', (): void => {
    expect(() => new Leverages(registry, 65535)).toBeTruthy();
  });

  it('hash a valid encoding', (): void => {
    const leverages = new Leverages(registry, ['LongTwo', 'LongThree', 'LongTwenty']);
    const leverages1 = new Leverages(registry, [
      'LongTwo',
      'LongThree',
      'LongFive',
      'LongTen',
      'LongTwenty',
      'LongThirty',
      'LongFifty',
      'ShortTwo',
      'ShortThree',
      'ShortFive',
      'ShortTen',
      'ShortTwenty',
      'ShortThirty',
      'ShortFifty'
    ]);

    expect(leverages.toU8a()).toEqual(new Uint8Array([0, 19]));
    expect(leverages1.toU8a()).toEqual(new Uint8Array([127, 127]));
  });

  describe('utils', (): void => {
    const leverages = new Leverages(registry, ['ShortThirty', 'ShortFifty']);

    it('compares against string array', (): void => {
      expect(leverages.eq(['ShortThirty', 'ShortFifty'])).toBe(true);
    });

    // it('compares against number (encoded)', (): void => {
    //   expect(leverages.eq(LEVERAGES_FIELDS.ShortThirty | LEVERAGES_FIELDS.ShortFifty)).toBe(true);
    // });

    it('compares against other sets', (): void => {
      expect(leverages.eq(new Leverages(registry, ['ShortThirty', 'ShortFifty']))).toBe(true);
    });

    it('returns false on other values', (): void => {
      expect(leverages.eq('ShortTwenty')).toBe(false);
    });
  });

  it('has a sane toRawType representation', (): void => {
    expect(new Leverages(registry).toRawType()).toEqual(
      JSON.stringify({
        _set: {
          LongTwo: 1,
          LongThree: 2,
          LongFive: 4,
          LongTen: 8,
          LongTwenty: 16,
          LongThirty: 32,
          LongFifty: 64,
          LongOneHundred: 128,
          ShortTwo: 256,
          ShortThree: 512,
          ShortFive: 1024,
          ShortTen: 2048,
          ShortTwenty: 4096,
          ShortThirty: 8192,
          ShortFifty: 16384,
          ShortOneHundred: 32768
        }
      })
    );
  });

  it('EventRecord', (): void => {
    const raw =
      '0x0c000000000000001027000001010000010000001501d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d000000000201ffff000001000000000010270000000100';
    createTypeUnsafe(registry, 'Vec<EventRecord>', [u8aToU8a(raw)], true);
    expect(raw).toBeTruthy();
  });
});
