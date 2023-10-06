export default function checkValueGeo(value) {
  const regex = /^\[?-?([1-8]?\d(\.\d{1,18})?|90(\.\d{1,18})?),\s?-?((?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)\]?$/;
  return regex.test(value);
}
