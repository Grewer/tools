function Add(num1, num2) {
  let r1
  let r2
  try {
    r1 = num1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = num2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const m = 10 ** Math.max(r1, r2)
  return Math.round(num1 * m + num2 * m) / m
}

function Mul(arg1, arg2) {
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m
}

export default {
  Add,
  Mul,
}
