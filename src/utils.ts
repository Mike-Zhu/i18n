
// add a express
export interface WordInfo {
  content: string;
  filename: string;
  start: number;
  end: number;
  kind: number;
}

interface StrObject {
  [key: string]: boolean;
}
export function remoeDuplicate<T extends string>(list: T[]): T[] {
  let _ret = [];
  let _map = {} as StrObject;

  list.forEach(str => {
    if (_map[str] !== true) {
      _map[str] = true;
      _ret.push(str)
    }
  })

  return _ret;
}