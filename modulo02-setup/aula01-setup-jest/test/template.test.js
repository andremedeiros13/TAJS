import {describe ,it, expect, jest } from '@jest/globals';

function sum (a, b) {
    return a + b;
}

it('sum two values', ()=>{
    expect(sum(2,3)).toBe(5);
})