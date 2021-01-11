import { PackageService } from './packageService';

const packageService = PackageService.getInstance();
function sum(a: number, b: number) {
   return a + b;
}

test('adds 1 + 2 to equal 3', () => {
   // let t  = packageService.read(2);
   
   expect(sum(1, 2)).toBe(3);
});