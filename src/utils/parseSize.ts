interface SizeUnit {
  unit: string
  factor: number
}

const sizeUnits: SizeUnit[] = ([
  'Byte',
  'KB',
  'MB',
  'GB',
  'TB',
]).map((unit, index) => ({
  unit,
  factor: Math.pow(1024, index),
}))

export function chooseUnit (size: number): SizeUnit {
  for (let i = sizeUnits.length - 1; i >= 0; --i) {
    const sizeUnit = sizeUnits[i]
    if (sizeUnit.factor <= size) return sizeUnit
  }
  return sizeUnits[0]
}

export function size2str (size: number, fixed: number = 2): string {
  const sizeUnit = chooseUnit(size)
  return `${(size / sizeUnit.factor).toFixed(fixed)}${sizeUnit.unit}`
}
